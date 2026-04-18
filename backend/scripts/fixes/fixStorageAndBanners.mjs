import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';
import { createClient } from '@supabase/supabase-js';

const databaseUrl = process.env.DATABASE_URL;
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!databaseUrl || !supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing env vars');
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixAll() {
  // ==========================================
  // FIX 1: Notify PostgREST to reload schema
  // (so it discovers the new 'banners' table)
  // ==========================================
  console.log('🔄 [Fix 1] Reloading PostgREST schema cache...');
  await client.connect();
  await client.query("NOTIFY pgrst, 'reload schema'");
  console.log('✅ PostgREST schema cache reloaded. Banners table should now be accessible via REST API.');

  // ==========================================
  // FIX 2: Create Storage bucket 'media'
  // ==========================================
  console.log('\n🔄 [Fix 2] Creating storage bucket "media"...');
  
  // Create via direct SQL for reliability
  try {
    await client.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES (
        'media', 
        'media', 
        true, 
        5242880,
        ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml']
      )
      ON CONFLICT (id) DO UPDATE SET 
        public = true,
        file_size_limit = 5242880,
        allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'];
    `);
    console.log('✅ Storage bucket "media" created (public, max 5MB, images only).');
  } catch (err) {
    console.error('⚠️  Bucket creation error:', err.message);
  }

  // Create storage policies for the media bucket
  console.log('\n🔄 [Fix 3] Setting up storage policies...');
  
  const policies = [
    {
      name: 'Public can view media',
      sql: `
        CREATE POLICY "Public can view media" ON storage.objects
        FOR SELECT USING (bucket_id = 'media');
      `
    },
    {
      name: 'Authenticated users can upload media',
      sql: `
        CREATE POLICY "Authenticated users can upload media" ON storage.objects
        FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');
      `
    },
    {
      name: 'Authenticated users can update media',
      sql: `
        CREATE POLICY "Authenticated users can update media" ON storage.objects
        FOR UPDATE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
      `
    },
    {
      name: 'Authenticated users can delete media',
      sql: `
        CREATE POLICY "Authenticated users can delete media" ON storage.objects
        FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
      `
    }
  ];

  for (const policy of policies) {
    try {
      await client.query(policy.sql);
      console.log(`  ✅ Policy "${policy.name}" created.`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  ⏭️  Policy "${policy.name}" already exists, skipping.`);
      } else {
        console.error(`  ⚠️  Policy "${policy.name}" error:`, err.message);
      }
    }
  }

  await client.end();

  // ==========================================
  // VERIFY: Test banners API
  // ==========================================
  console.log('\n🔄 [Verify] Testing banners REST API...');
  const { data, error } = await supabase.from('banners').select('*');
  if (error) {
    console.error('❌ Banners API still failing:', error.message);
    console.log('💡 Try reloading the Supabase project from the Dashboard if this persists.');
  } else {
    console.log(`✅ Banners API working! Found ${data.length} banner(s).`);
  }

  console.log('\n🎉 All fixes applied! Please reload the admin dashboard.');
}

fixAll().catch(console.error);
