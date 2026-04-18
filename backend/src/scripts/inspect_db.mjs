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

        console.log('--- static_pages columns ---');
        const res1 = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'static_pages'");
        console.log(res1.rows.map(r => r.column_name));

        console.log('--- navigation policies ---');
        const res3 = await client.query("SELECT policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'navigation'");
        console.table(res3.rows);

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

inspect();
