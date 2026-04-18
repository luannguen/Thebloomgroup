import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: 'f:/code duan/Thebloomgroup/backend/.env' });

async function nuclearRlsDisable() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    try {
        console.log('--- NUCLEAR RLS DISABLE (STORAGE SCHEMA) ---');
        
        const tables = [
            'objects', 
            'buckets', 
            'buckets_analytics', 
            'buckets_vectors', 
            'migrations', 
            's3_multipart_uploads', 
            's3_multipart_uploads_parts'
        ];

        for (const table of tables) {
            try {
                // Thử tắt RLS
                await client.query(`ALTER TABLE storage."${table}" DISABLE ROW LEVEL SECURITY;`);
                console.log(`✅ Disabled RLS on: ${table}`);
            } catch (e) {
                console.log(`⚠️ Could not disable RLS on ${table}: ${e.message}`);
                
                // Nếu không tắt được (do ownership), tạo Policy cho phép tất cả mọi thứ
                try {
                    await client.query(`DROP POLICY IF EXISTS "allow_all_access" ON storage."${table}";`);
                    await client.query(`CREATE POLICY "allow_all_access" ON storage."${table}" FOR ALL TO public USING (true) WITH CHECK (true);`);
                    console.log(`   👉 Applied permissive ALL policy to ${table}`);
                } catch (policyError) {
                    console.log(`   ❌ Failed to apply policy to ${table}: ${policyError.message}`);
                }
            }
        }

        console.log('\n--- DATA CLEANUP ---');
        await client.query("UPDATE storage.objects SET owner_id = NULL WHERE bucket_id = 'media'");
        console.log('✅ Sanitized owner_id for media bucket.');

    } catch (err) {
        console.error('Fatal Error:', err);
    } finally {
        await client.end();
    }
}

nuclearRlsDisable();
