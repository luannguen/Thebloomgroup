import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Client } = pkg;

dotenv.config({ path: 'f:/code duan/Thebloomgroup/backend/.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const dbUrl = process.env.DATABASE_URL;

async function debugStorage() {
    console.log('--- DEBUG STORAGE ROLE & POLICIES ---');
    console.log('URL:', supabaseUrl);
    
    // 1. Kiểm tra trực tiếp qua SQL xem Policy nào đang tồn tại cho Object
    const pgClient = new Client({ connectionString: dbUrl });
    await pgClient.connect();
    try {
        const policies = await pgClient.query(`
            SELECT policyname, roles, cmd, qual, with_check 
            FROM pg_policies 
            WHERE schemaname = 'storage' AND tablename = 'objects';
        `);
        console.log('\n[SQL] Current Policies on storage.objects:');
        console.table(policies.rows);
    } finally {
        await pgClient.end();
    }

    // 2. Thử truy cập bằng Anon Key (Giả lập chưa login)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('\n[API] Testing list() with ANON key...');
    
    const { data, error } = await supabase.storage.from('media').list('uploads');
    
    if (error) {
        console.error('❌ Status:', error.status);
        console.error('❌ Error Name:', error.name);
        console.error('❌ Message:', error.message);
        
        if (error.message.includes('row-level security policy')) {
            console.log('\n👉 KẾT LUẬN: Role "anon" bị chặn bởi RLS. Cần nới lỏng Policy cho cả anon.');
        }
    } else {
        console.log('✅ Success! Listed', data.length, 'files using ANON key.');
        console.log('👉 KẾT LUẬN: Anon key có quyền. Lỗi ở Admin có thể do Session bị hỏng hoặc Token không được gửi.');
    }
}

debugStorage();
