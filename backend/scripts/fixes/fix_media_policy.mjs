import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
const client = new pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function fixPolicies() {
  try {
    console.log('🔄 Bổ sung chính sách upload công khai cho bucket "media"...');
    
    // Xóa chính sách cũ nếu có để tránh xung đột
    await client.query(`DROP POLICY IF EXISTS "Public Upload Media" ON storage.objects`);
    
    // Tạo chính sách cho phép upload không cần auth (tạm thời để seeding)
    await client.query(`
      CREATE POLICY "Public Upload Media" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'media');
    `);
    
    console.log('✅ Chính sách "Public Upload Media" đã được tạo.');
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

fixPolicies();
