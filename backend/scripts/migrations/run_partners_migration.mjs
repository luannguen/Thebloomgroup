import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../../.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = process.env.DATABASE_URL;

if (!url) {
    console.error('Missing DATABASE_URL in .env file!');
    process.exit(1);
}

const { Client } = pg;

async function runSQL() {
    const client = new Client({
        connectionString: url,
    });

    try {
        console.log('Connecting to PostgreSQL database...');
        await client.connect();
        
        const filePath = path.join(__dirname, '..', 'SQL', '09_create_partners_table.sql');
        console.log(`Executing 09_create_partners_table.sql...`);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        await client.query(sql);
        console.log(`Successfully executed 09_create_partners_table.sql ✔️`);
        
    } catch (err) {
        console.error('Error executing SQL file:', err);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

runSQL();
