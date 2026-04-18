import { Client } from 'pg';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

const client = new Client({
  connectionString: dbUrl,
});

async function main() {
  try {
    await client.connect();
    
    await client.query(`
      -- Drop all existing policies on static_pages
      DROP POLICY IF EXISTS "Enable read access for all users" ON static_pages;
      DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON static_pages;
      DROP POLICY IF EXISTS "Enable update for authenticated users only" ON static_pages;
      DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON static_pages;
      DROP POLICY IF EXISTS "Allow all access to static_pages" ON static_pages;
      
      -- Create universal policy for anon key
      CREATE POLICY "Allow all access to static_pages"
        ON static_pages
        FOR ALL
        USING (true)
        WITH CHECK (true);
    `);
    
    console.log('✅ RLS for static_pages successfully relaxed!');
  } catch (err) {
    console.error('❌ Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

main();
