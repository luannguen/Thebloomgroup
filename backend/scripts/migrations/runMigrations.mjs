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

async function runSQLFiles() {
    const client = new Client({
        connectionString: url,
    });

    try {
        console.log('Connecting to PostgreSQL database...');
        await client.connect();
        
        const sqlDir = path.join(__dirname, '../../src/sql');
        const files = ['01_schema.sql', '02_permissions.sql', '03_seed_data.sql'];
        
        for (const file of files) {
            console.log(`Executing ${file}...`);
            const filePath = path.join(sqlDir, file);
            const sql = fs.readFileSync(filePath, 'utf8');
            
            // Execute the raw SQL
            await client.query(sql);
            console.log(`Successfully executed ${file} ✔️`);
        }
        
    } catch (err) {
        console.error('Error executing SQL files:', err);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

runSQLFiles();
