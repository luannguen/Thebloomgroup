import pg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;
dotenv.config({ path: '.env' });

const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL, 
    ssl: { rejectUnauthorized: false } 
});

async function check() {
  const res = await pool.query("SELECT slug, title, content FROM static_pages WHERE slug IN ('team', 'contact', 'lien-he')");
  console.log(JSON.stringify(res.rows, null, 2));
  await pool.end();
}
check();
