import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: 'f:/code duan/Thebloomgroup/backend/.env' });

async function listStorageMetadata() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT 
        t.table_name, 
        c.relrowsecurity as rls_enabled
      FROM information_schema.tables t
      JOIN pg_class c ON c.relname = t.table_name
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE t.table_schema = 'storage' AND n.nspname = 'storage';
    `);
    console.log('Tables in storage schema:');
    console.table(res.rows);

  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    await client.end();
  }
}

listStorageMetadata();
