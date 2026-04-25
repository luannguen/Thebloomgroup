import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const databaseUrl = process.env.DATABASE_URL;

const client = new pg.Client({ 
  connectionString: databaseUrl, 
  ssl: { rejectUnauthorized: false } 
});

async function applyFix() {
  await client.connect();
  
  try {
    console.log('🔄 Cleaning up storage policies...');
    
    // Drop known problematic policies
    await client.query(`
      DROP POLICY IF EXISTS "Allow public upload to cvs" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public upload to cvs v2" ON storage.objects;
      DROP POLICY IF EXISTS "Allow public select from cvs" ON storage.objects;
      DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
    `);

    console.log('🔄 Creating new permissive policies...');
    
    // Most robust policy: Allow anyone to insert into the cvs/ folder of the media bucket
    await client.query(`
      CREATE POLICY "Allow public upload to cvs" 
      ON storage.objects FOR INSERT 
      TO public 
      WITH CHECK (bucket_id = 'media' AND name LIKE 'cvs/%');
    `);

    await client.query(`
      CREATE POLICY "Allow public select from cvs" 
      ON storage.objects FOR SELECT 
      TO public 
      USING (bucket_id = 'media' AND name LIKE 'cvs/%');
    `);

    // Add UPDATE policy too, sometimes needed for multipart or overwrites
    await client.query(`
      CREATE POLICY "Allow public update to cvs" 
      ON storage.objects FOR UPDATE 
      TO public 
      USING (bucket_id = 'media' AND name LIKE 'cvs/%');
    `);

    console.log('🔄 Updating bucket settings for max compatibility...');
    await client.query(`
      UPDATE storage.buckets
      SET 
        public = true,
        file_size_limit = 10485760,
        allowed_mime_types = ARRAY[
          'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-word.document.macroEnabled.12',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
          'application/octet-stream'
        ]
      WHERE id = 'media';
    `);

    console.log('✅ Fix applied successfully.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
