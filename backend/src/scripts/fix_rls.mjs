import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        console.log('Connected to database. Checking policies...');

        // 1. Create policy for anonymous upload to 'cvs' folder in 'media'
        try {
            await client.query('DROP POLICY IF EXISTS "Enable anonymous upload to cvs folder" ON storage.objects');
        } catch (e) {
            console.log('Note on dropping policy:', e.message);
        }

        await client.query(`
            CREATE POLICY "Enable anonymous upload to cvs folder" 
            ON storage.objects 
            FOR INSERT 
            TO public 
            WITH CHECK (
                bucket_id = 'media' 
                AND (storage.foldername(name))[1] = 'cvs'
            )
        `);

        console.log('RLS Policy "Enable anonymous upload to cvs folder" created successfully.');

        // 2. Refresh permissions (optional, for safety)
        // Note: Sometimes policies take a moment or require cache refresh in some systems, 
        // but Postgres applies them immediately.

    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();
