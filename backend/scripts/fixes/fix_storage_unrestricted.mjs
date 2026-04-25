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
    console.log('🔄 Setting bucket to public and granting permissions...');
    
    // Set bucket to public
    await client.query("UPDATE storage.buckets SET public = true WHERE id = 'cv_uploads';");
    
    // Grant schema usage
    await client.query('GRANT USAGE ON SCHEMA storage TO anon, authenticated, public;');
    
    // Grant table permissions
    try {
      await client.query('GRANT ALL ON TABLE storage.objects TO anon, authenticated, public;');
      await client.query('GRANT ALL ON TABLE storage.buckets TO anon, authenticated, public;');
      console.log('✅ Explicit table grants successful.');
    } catch (e) {
      console.warn('⚠️ Table grants failed:', e.message);
    }

    console.log('🔄 Creating wide-open RLS policy for the media bucket...');
    
    // Drop all policies on storage.objects
    await client.query(`
      DO $$
      DECLARE
        pol RECORD;
      BEGIN
        FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage')
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
        END LOOP;
      END $$;
    `);

    // Create the most permissive policy possible
    await client.query(`
      CREATE POLICY "allow_everything_on_objects" 
      ON storage.objects FOR ALL 
      TO public 
      USING (true) 
      WITH CHECK (true);
    `);

    console.log('✅ Wide-open RLS policy created.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
