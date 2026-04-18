import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;

async function fixStorageRLS() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database to fix Storage RLS...');

    // 0. Grant permissions and set search_path
    console.log('Granting permissions and setting search_path...');
    await client.query('GRANT USAGE ON SCHEMA storage TO postgres, anon, authenticated, service_role;');
    await client.query('GRANT ALL ON ALL TABLES IN SCHEMA storage TO postgres, anon, authenticated, service_role;');
    await client.query('ALTER ROLE anon SET search_path TO public, storage;');
    await client.query('ALTER ROLE authenticated SET search_path TO public, storage;');

    // 1. Create 'media' bucket if not exists
    console.log('Ensuring "media" bucket exists...');
    await client.query(`
      INSERT INTO storage.buckets (id, name, public)
      VALUES ('media', 'media', true)
      ON CONFLICT (id) DO UPDATE SET public = true;
    `);

    // 2. Add policies for Storage
    console.log('Applying targeted storage policies to roles...');
    
    await client.query('DROP POLICY IF EXISTS "buckets_select_all" ON storage.buckets;');
    await client.query('DROP POLICY IF EXISTS "objects_select_all" ON storage.objects;');
    await client.query('DROP POLICY IF EXISTS "objects_insert_all" ON storage.objects;');
    await client.query('DROP POLICY IF EXISTS "objects_update_all" ON storage.objects;');
    await client.query('DROP POLICY IF EXISTS "objects_delete_all" ON storage.objects;');

    // Bucket policies
    await client.query('CREATE POLICY "anon_buckets_select" ON storage.buckets FOR SELECT TO anon USING (true);');
    await client.query('CREATE POLICY "auth_buckets_select" ON storage.buckets FOR SELECT TO authenticated USING (true);');

    // Object policies
    await client.query('CREATE POLICY "anon_objects_select" ON storage.objects FOR SELECT TO anon USING (bucket_id = \'media\');');
    await client.query('CREATE POLICY "auth_objects_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = \'media\');');
    
    await client.query('CREATE POLICY "anon_objects_insert" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = \'media\');');
    await client.query('CREATE POLICY "auth_objects_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = \'media\');');
    
    await client.query('CREATE POLICY "auth_objects_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = \'media\');');
    await client.query('CREATE POLICY "auth_objects_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = \'media\');');

    console.log('✅ Storage policies applied to roles.');

  } catch (err) {
    console.error('❌ Error fixing storage:', err);
  } finally {
    await client.end();
  }
}

fixStorageRLS();
