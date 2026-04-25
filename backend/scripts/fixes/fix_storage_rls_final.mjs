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
  
  try {
    console.log('🔄 Dropping old restrictive policies if they exist...');
    await client.query(`
      DROP POLICY IF EXISTS "Allow public upload to cvs" ON storage.objects;
      DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
    `);

    console.log('🔄 Creating a more robust public upload policy for cvs/ folder...');
    // We use name LIKE 'cvs/%' which is safer than foldername function
    await client.query(`
      CREATE POLICY "Allow public upload to cvs" 
      ON storage.objects FOR INSERT 
      TO public 
      WITH CHECK (bucket_id = 'media' AND name LIKE 'cvs/%');
    `);

    console.log('🔄 Creating public select policy for cvs/ folder (optional but helpful)...');
    await client.query(`
      CREATE POLICY "Allow public select from cvs" 
      ON storage.objects FOR SELECT 
      TO public 
      USING (bucket_id = 'media' AND name LIKE 'cvs/%');
    `);

    console.log('✅ Storage policies updated with LIKE operator.');

    // Also double check bucket is public
    console.log('🔄 Ensuring media bucket is public...');
    await client.query(`
      UPDATE storage.buckets 
      SET public = true 
      WHERE id = 'media';
    `);
    console.log('✅ Media bucket set to public.');

  } catch (err) {
    console.error('❌ Error applying fix:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
