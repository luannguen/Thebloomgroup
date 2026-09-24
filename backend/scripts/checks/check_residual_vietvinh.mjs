import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres';

async function checkResidual() {
  const client = new Client({ connectionString });
  await client.connect();

  const tables = [
    'static_pages',
    'site_settings',
    'news',
    'products',
    'services',
    'service_categories',
    'projects',
    'categories',
    'navigation',
    'banners',
    'faqs',
    'achievements',
    'partners'
  ];

  console.log('=== Checking residual Viet Vinh / VVC occurrences ===');
  for (const table of tables) {
    try {
      const query = `
        SELECT count(*) as total,
          count(CASE WHEN CAST(t.* AS text) ~* 'vietvinh|việt vinh|\\bVVC\\b' THEN 1 END) as matches
        FROM public.${table} t;
      `;
      const res = await client.query(query);
      console.log(`- ${table.padEnd(20)}: ${res.rows[0].matches} / ${res.rows[0].total} rows contain 'vietvinh|việt vinh|VVC'`);
    } catch (err) {
      console.log(`- ${table.padEnd(20)}: Error (${err.message})`);
    }
  }

  await client.end();
}

checkResidual();
