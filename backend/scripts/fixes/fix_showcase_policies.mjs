import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const client = new pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function fixPolicies() {
  try {
    console.log('🔄 Bổ sung chính sách upload/insert công khai cho Sản phẩm & Dự án...');
    
    // Policy cho Categories
    await client.query(`DROP POLICY IF EXISTS "Public Insert Categories" ON public.categories`);
    await client.query(`CREATE POLICY "Public Insert Categories" ON public.categories FOR INSERT WITH CHECK (true)`);
    await client.query(`DROP POLICY IF EXISTS "Public Update Categories" ON public.categories`);
    await client.query(`CREATE POLICY "Public Update Categories" ON public.categories FOR UPDATE USING (true)`);
    
    // Policy cho Products
    await client.query(`DROP POLICY IF EXISTS "Public Insert Products" ON public.products`);
    await client.query(`CREATE POLICY "Public Insert Products" ON public.products FOR INSERT WITH CHECK (true)`);
    await client.query(`DROP POLICY IF EXISTS "Public Update Products" ON public.products`);
    await client.query(`CREATE POLICY "Public Update Products" ON public.products FOR UPDATE USING (true)`);
    
    // Policy cho Projects
    await client.query(`DROP POLICY IF EXISTS "Public Insert Projects" ON public.projects`);
    await client.query(`CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true)`);
    await client.query(`DROP POLICY IF EXISTS "Public Update Projects" ON public.projects`);
    await client.query(`CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true)`);
    
    console.log('✅ Các chính sách đã được cập nhật.');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

fixPolicies();
