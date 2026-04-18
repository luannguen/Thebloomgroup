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
        for (const table of tables) {
            console.log(`\n--- ${table} columns ---`);
            try {
                const res = await client.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '${table}'`);
                if (res.rows.length === 0) {
                    console.log(`Table ${table} does not exist`);
                } else {
                    console.log(res.rows.map(r => `${r.column_name} (${r.data_type})`).join(', '));
                }
            } catch (e) {
                console.log(`Table ${table} does not exist or error: ${e.message}`);
            }
        }

        console.log('\n--- static_pages data ---');
        const pages = await client.query("SELECT slug, title FROM static_pages");
        console.table(pages.rows);

        console.log('\n--- services data (first 5) ---');
        const svcs = await client.query("SELECT id, title, slug FROM services LIMIT 5");
        console.table(svcs.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
