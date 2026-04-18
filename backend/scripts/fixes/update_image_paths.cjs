const pg = require('pg');
const { Client } = pg;
const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

async function run() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query("SELECT content FROM public.static_pages WHERE slug = 'he-thong-lanh'");
    if (res.rows.length > 0) {
      let content = res.rows[0].content;
      // Replace with shorter paths
      let newContent = content
        .replace(/industrial_refrigeration_hero_.*?\.png/g, '/industrial_refrigeration_hero.png')
        .replace(/cold_storage_warehouse_.*?\.png/g, '/cold_storage_warehouse.png')
        .replace(/flash_freezing_system_.*?\.png/g, '/flash_freezing_system.png')
        .replace(/industrial_refrigerator_display_.*?\.png/g, '/industrial_refrigerator_display.png');
      
      await client.query("UPDATE public.static_pages SET content = $1 WHERE slug = 'he-thong-lanh'", [newContent]);
      console.log('Corrected image paths in DB.');
    } else {
      console.log('Page not found.');
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();
