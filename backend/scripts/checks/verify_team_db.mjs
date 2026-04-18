import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

async function verify() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT id, slug, title FROM static_pages WHERE slug = 'team'");
    if (res.rows.length > 0) {
      console.log('SUCCESS: Team page found in DB:', res.rows[0]);
    } else {
      console.log('FAILURE: Team page NOT found in DB.');
      const all = await client.query("SELECT slug FROM static_pages");
      console.log('Existing slugs:', all.rows.map(r => r.slug).join(', '));
    }
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await client.end();
  }
}

verify();
