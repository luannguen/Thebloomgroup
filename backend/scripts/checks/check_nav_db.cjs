const pg = require('pg');
const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

async function check() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT id, title, slug, parent_id, "order" FROM navigation ORDER BY parent_id NULLS FIRST, "order" ASC');
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

check();
