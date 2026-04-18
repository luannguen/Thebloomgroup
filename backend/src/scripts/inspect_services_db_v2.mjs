import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Client } = pg;

async function inspect() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        const tables = ['services', 'service_categories', 'service_inquiries', 'contacts', 'static_pages'];
        
        // Use a more reliable way to check table existence
        for (const table of tables) {
            console.log(`\n--- checking ${table} ---`);
            const checkRes = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = $1
                );
            `, [table]);
            
            const exists = checkRes.rows[0].exists;
            if (!exists) {
                console.log(`Table public.${table} does not exist`);
                continue;
            }

            const colRes = await client.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = $1
            `, [table]);
            console.log(`Columns: ${colRes.rows.map(r => `${r.column_name} (${r.data_type})`).join(', ')}`);

            const dataRes = await client.query(`SELECT * FROM public.${table} LIMIT 3`);
            console.log(`Data (first 3):`);
            console.table(dataRes.rows);
        }

    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await client.end();
    }
}

inspect();
