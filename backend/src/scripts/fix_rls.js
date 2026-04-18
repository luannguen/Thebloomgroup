const pg = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function run() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        
        // 1. Create policy for anonymous upload to 'cvs' folder in 'media'
        // Using storage.foldername(name)[1] to check the top-level folder
        // For 'cvs/abc.pdf', (storage.foldername(name))[1] is 'cvs'
        
        // First drop if exists (optional but safer for idempotency in some cases)
        // Note: DROP POLICY depends on the table and name
        try {
            await client.query('DROP POLICY "Enable anonymous upload to cvs folder" ON storage.objects');
        } catch (e) {
            // Ignore if doesn't exist
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

        // 2. Also allow public to SELECT their own uploaded CVs if they have the link
        // (Though there is already a "Public can view media" policy, it doesn't hurt)

        console.log('RLS Policy for anonymous CV uploads created successfully.');

    } catch (err) {
        console.error('Error executing SQL:', err);
    } finally {
        await client.end();
    }
}

run();
