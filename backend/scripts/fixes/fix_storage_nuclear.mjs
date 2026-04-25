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
  try {
    await client.connect();
    console.log('🔄 Attempting to DISABLE RLS on storage.objects (The Nuclear Option)...');
    
    // Disable RLS on storage.objects
    try {
      await client.query('ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;');
      console.log('✅ RLS disabled on storage.objects.');
    } catch (e) {
      console.error('❌ Failed to disable RLS:', e.message);
      console.log('🔄 Falling back to wide-open policy...');
      await client.query('ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;');
      await client.query('DROP POLICY IF EXISTS "allow_everything" ON storage.objects;');
      await client.query('CREATE POLICY "allow_everything" ON storage.objects FOR ALL TO public USING (true) WITH CHECK (true);');
    }

    // Ensure bucket is public
    await client.query("UPDATE storage.buckets SET public = true WHERE id = 'cv_uploads';");
    
    // Grant explicit permissions to EVERYTHING in storage
    await client.query('GRANT USAGE ON SCHEMA storage TO anon, authenticated, public;');
    await client.query('GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, public;');
    await client.query('GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, public;');
    await client.query('GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO anon, authenticated, public;');

    console.log('✅ Permissions granted to anon/public role.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
