/**
 * Apply Storage RLS Policies for media bucket
 * 
 * Script này dùng Supabase Management API (qua Service Role Key)
 * để apply các chính sách bảo mật cho storage bucket 'media'.
 * 
 * Chạy: node scripts/fixes/apply_storage_rls.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, '../../.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = {};
for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const eqIndex = trimmed.indexOf('=');
    const key = trimmed.substring(0, eqIndex).trim();
    let value = trimmed.substring(eqIndex + 1).trim();
    // Remove surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }
    env[key] = value;
}

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
    process.exit(1);
}

console.log(`🔧 Supabase URL: ${SUPABASE_URL}`);
console.log(`🔑 Service Role Key: ${SERVICE_ROLE_KEY.substring(0, 12)}...`);

const sql = `
-- ==========================================
-- STORAGE RLS POLICIES FOR MEDIA BUCKET
-- ==========================================

-- 1. Ensure bucket 'media' exists and is public
UPDATE storage.buckets SET public = true WHERE id = 'media';

-- 2. Drop all existing conflicting policies on storage.objects
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- 3. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create clean policies for 'media' bucket
-- SELECT: Anyone can view files in 'media' bucket
CREATE POLICY "media_select_public" ON storage.objects 
FOR SELECT TO public USING (bucket_id = 'media');

-- INSERT: Anyone can upload files to 'media' bucket  
CREATE POLICY "media_insert_public" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'media');

-- UPDATE: Anyone can update files in 'media' bucket
CREATE POLICY "media_update_public" ON storage.objects
FOR UPDATE TO public USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- DELETE: Anyone can delete files from 'media' bucket
CREATE POLICY "media_delete_public" ON storage.objects
FOR DELETE TO public USING (bucket_id = 'media');

-- 5. Also set policies on storage.buckets so anon can list buckets
DROP POLICY IF EXISTS "media_bucket_select" ON storage.buckets;
CREATE POLICY "media_bucket_select" ON storage.buckets
FOR SELECT TO public USING (id = 'media');

SELECT 'SUCCESS: All storage RLS policies applied!' as status;
`;

async function runSQL() {
    console.log('\n📋 Executing SQL via Supabase REST API...\n');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({})
    });

    // The REST API doesn't support raw SQL.
    // We'll use the Supabase SQL endpoint directly instead.
    const sqlResponse = await fetch(`${SUPABASE_URL}/pg`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ query: sql })
    });

    if (!sqlResponse.ok) {
        // Try alternative: supabase management API
        console.log('⚠️ Direct SQL endpoint not available. Trying alternative method...\n');
        
        // Use the stored procedure approach - execute each statement separately
        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('SELECT'));

        // For Supabase, the proper way is via the Dashboard SQL Editor
        // But we can try using the pg wire protocol through DATABASE_URL
        console.log('📝 Generating SQL file to run in Supabase Dashboard...\n');
        
        const sqlFilePath = resolve(__dirname, '../SQL/apply_storage_rls.sql');
        const { writeFileSync } = await import('fs');
        writeFileSync(sqlFilePath, sql, 'utf-8');
        console.log(`✅ SQL file saved to: ${sqlFilePath}`);
        console.log('\n🔗 Please run this SQL in your Supabase Dashboard:');
        console.log(`   https://supabase.com/dashboard/project/akryfqelpljvrydxftxc/sql/new\n`);
        console.log('   Or paste the SQL below:\n');
        console.log('─'.repeat(60));
        console.log(sql);
        console.log('─'.repeat(60));
        return;
    }

    const result = await sqlResponse.json();
    console.log('✅ SQL executed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
}

runSQL().catch(err => {
    console.error('❌ Failed:', err.message);
    process.exit(1);
});
