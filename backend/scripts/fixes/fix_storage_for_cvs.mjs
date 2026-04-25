import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env');
  process.exit(1);
}

const client = new pg.Client({ 
  connectionString: databaseUrl, 
  ssl: { rejectUnauthorized: false } 
});

async function applyFix() {
  console.log('🔄 Connecting to database...');
  await client.connect();
  
  console.log('🔄 Updating media bucket settings...');
  const query = `
    UPDATE storage.buckets
    SET 
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY[
        'image/png', 
        'image/jpeg', 
        'image/jpg', 
        'image/webp', 
        'image/gif', 
        'image/svg+xml',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ]
    WHERE id = 'media'
    RETURNING id, name, file_size_limit, allowed_mime_types;
  `;

  try {
    const res = await client.query(query);
    if (res.rowCount === 0) {
      console.error('❌ Bucket "media" not found!');
    } else {
      console.log('✅ Updated bucket settings:', JSON.stringify(res.rows[0], null, 2));
    }

    // Add extra policy for cvs/ folder just in case
    console.log('🔄 Ensuring public upload policy for cvs/ folder...');
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT 1 FROM pg_policies 
              WHERE tablename = 'objects' 
              AND schemaname = 'storage'
              AND policyname = 'Allow public upload to cvs'
          ) THEN
              CREATE POLICY "Allow public upload to cvs" 
              ON storage.objects FOR INSERT 
              TO public 
              WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'cvs');
          END IF;
      END
      $$;
    `);
    console.log('✅ Storage policies checked/updated.');

  } catch (err) {
    console.error('❌ Error applying fix:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
