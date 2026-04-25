import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const databaseUrl = process.env.DATABASE_URL;

const client = new pg.Client({ 
  connectionString: databaseUrl, 
  ssl: { rejectUnauthorized: false } 
});

async function applyFix() {
  await client.connect();
  
  try {
    console.log('🔄 GRANTING schema permissions to public/anon...');
    
    await client.query(`
      GRANT USAGE ON SCHEMA storage TO anon, authenticated, public;
      GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated, public;
      GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated, public;
      GRANT ALL ON ALL ROUTINES IN SCHEMA storage TO anon, authenticated, public;
    `);

    console.log('✅ Permissions granted.');

    // Ensure RLS is enabled but permissive
    await client.query(`
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
    `);

    console.log('🔄 Re-creating permissive policy...');
    await client.query(`
      DROP POLICY IF EXISTS "Allow all on media for all" ON storage.objects;
      CREATE POLICY "Allow all on media for all" 
      ON storage.objects FOR ALL
      TO public 
      USING (bucket_id = 'media')
      WITH CHECK (bucket_id = 'media');
    `);

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
