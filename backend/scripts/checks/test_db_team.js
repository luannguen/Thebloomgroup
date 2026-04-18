import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        const res = await pool.query('SELECT * FROM team_members');
        console.log("Team members:", res.rows);
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await pool.end();
    }
}

run();
