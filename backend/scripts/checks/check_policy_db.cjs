const pg = require('pg');
const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

async function check() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT slug, title, content FROM static_pages WHERE slug IN ('chinh-sach-bao-mat', 'chinh-sach-cookie', 'dieu-khoan-su-dung')");
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
