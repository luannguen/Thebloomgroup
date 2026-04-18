import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const client = new pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function fixPolicies() {
  try {
    console.log('🔄 Bổ sung chính sách RLS cho bảng Services...');
    
    // Policy cho Service Categories
    await client.query(`DROP POLICY IF EXISTS "Public Insert Service Categories" ON public.service_categories`);
    await client.query(`CREATE POLICY "Public Insert Service Categories" ON public.service_categories FOR INSERT WITH CHECK (true)`);
    await client.query(`DROP POLICY IF EXISTS "Public Update Service Categories" ON public.service_categories`);
    await client.query(`CREATE POLICY "Public Update Service Categories" ON public.service_categories FOR UPDATE USING (true)`);
    
    // Policy cho Services
    await client.query(`DROP POLICY IF EXISTS "Public Insert Services" ON public.services`);
    await client.query(`CREATE POLICY "Public Insert Services" ON public.services FOR INSERT WITH CHECK (true)`);
    await client.query(`DROP POLICY IF EXISTS "Public Update Services" ON public.services`);
    await client.query(`CREATE POLICY "Public Update Services" ON public.services FOR UPDATE USING (true)`);
    
    console.log('✅ Các chính sách Services đã được cập nhật.');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

fixPolicies();
