import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres';

async function deepInspect() {
  const client = new Client({ connectionString });
  await client.connect();

  const checks = [
    { table: 'static_pages', id: 'aa472ad0-2088-4e01-8ae0-cd6f71a5c405' },
    { table: 'static_pages', id: 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb' },
    { table: 'products', id: '8f5c8a61-0125-4f4e-8b37-75ca99b87059' },
    { table: 'services', id: 'b44803a7-beb3-4233-be3e-c51c93cbbda3' },
    { table: 'services', id: 'd3502863-4f77-4e4e-9fc0-00f7db49460d' },
    { table: 'services', id: '29c904f5-38c3-44c6-8ea7-94f777fac8be' },
    { table: 'services', id: 'e1049d6b-7b2a-42c3-af7e-248e17285c65' },
    { table: 'banners', id: 'ac9adfa7-f5b9-4f41-8c3c-31d28877d73e' },
    { table: 'partners', id: '536281e5-f83c-4e22-ad03-cede78a3f88a' }
  ];

  for (const c of checks) {
    const res = await client.query(`SELECT * FROM public.${c.table} WHERE id = $1`, [c.id]);
    const row = res.rows[0];
    console.log(`\n================== [${c.table}] ID: ${c.id} ==================`);
    for (const [k, v] of Object.entries(row)) {
      if (typeof v === 'string' && /vietvinh|việt vinh|\bVVC\b/i.test(v)) {
        console.log(`Column [${k}]:`);
        const matches = v.match(/.{0,50}(vietvinh|việt vinh|\bVVC\b).{0,50}/gi);
        matches?.forEach(m => console.log(`   --> "...${m.trim()}..."`));
      }
    }
  }

  await client.end();
}

deepInspect();
