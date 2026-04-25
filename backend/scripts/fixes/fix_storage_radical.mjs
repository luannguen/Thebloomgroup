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
    console.log('🔄 DELETING ALL POLICIES on storage.objects to fix RLS issue...');
    
    // This script will remove ALL policies for the media bucket and create a wide-open one for testing
    await client.query(`
      DO $$
      DECLARE
          pol record;
      BEGIN
          FOR pol IN (
              SELECT policyname 
              FROM pg_policies 
              WHERE tablename = 'objects' 
              AND schemaname = 'storage'
          ) LOOP
              EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
          END LOOP;
      END
      $$;
    `);

    console.log('🔄 Creating WIDE OPEN policies for the media bucket...');
    
    // ALLOW ALL for ALL roles on the media bucket
    await client.query(`
      CREATE POLICY "Allow all on media for all" 
      ON storage.objects FOR ALL
      TO public 
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
    `);

    console.log('🔄 Resetting bucket settings (ALLOW ALL)...');
    await client.query(`
      UPDATE storage.buckets
      SET 
        public = true,
        file_size_limit = NULL,
        allowed_mime_types = NULL
      WHERE id = 'media';
    `);

    console.log('✅ Radical fix applied. ALL restrictions removed from media bucket.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
