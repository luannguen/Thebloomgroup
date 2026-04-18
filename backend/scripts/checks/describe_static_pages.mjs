import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function describeTable() {
    try {
        await client.connect();
        
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'static_pages'
        `);
        
        console.log('Columns in static_pages:');
        console.table(res.rows);
        
    } catch (err) {
        console.error('Error describing table:', err);
    } finally {
        await client.end();
    }
}

describeTable();
