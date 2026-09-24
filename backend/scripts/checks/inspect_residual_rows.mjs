import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres';

async function inspectMatches() {
  const client = new Client({ connectionString });
  await client.connect();

  const queries = [
    { table: 'static_pages', cols: 'id, slug, title' },
    { table: 'products', cols: 'id, name, slug, description' },
    { table: 'services', cols: 'id, title, slug, description' },
    { table: 'banners', cols: 'id, title' },
    { table: 'partners', cols: 'id, name' }
  ];

  for (const q of queries) {
    try {
      const res = await client.query(`
        SELECT ${q.cols} FROM public.${q.table} t 
        WHERE CAST(t.* AS text) ~* 'vietvinh|việt vinh|\\bVVC\\b';
      `);
      console.log(`\n=== Matches in ${q.table} (${res.rows.length}) ===`);
      res.rows.forEach(r => console.log(JSON.stringify(r)));
    } catch (e) {
      console.error(`Error querying ${q.table}:`, e.message);
    }
  }

  await client.end();
}

inspectMatches();
