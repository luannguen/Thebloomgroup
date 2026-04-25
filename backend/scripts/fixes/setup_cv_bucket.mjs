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
    console.log('🔄 Creating a dedicated bucket for CVs...');
    
    // Create bucket if not exists
    await client.query(`
      INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
      VALUES ('cv_uploads', 'cv_uploads', true, 10485760, NULL)
      ON CONFLICT (id) DO UPDATE 
      SET public = true, file_size_limit = 10485760, allowed_mime_types = NULL;
    `);

    console.log('🔄 Setting up permissive RLS for cv_uploads bucket...');
    
    await client.query(`
      DROP POLICY IF EXISTS "Allow all on cv_uploads" ON storage.objects;
      CREATE POLICY "Allow all on cv_uploads" 
      ON storage.objects FOR ALL
      TO public 
      USING (bucket_id = 'cv_uploads')
      WITH CHECK (bucket_id = 'cv_uploads');
    `);

    console.log('✅ Dedicated bucket cv_uploads set up.');

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.end();
  }
}

applyFix().catch(console.error);
