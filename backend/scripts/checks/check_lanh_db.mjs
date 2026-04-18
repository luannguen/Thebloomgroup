import pg from 'pg';
const { Client } = pg;
const connectionString = 'postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres';

async function checkLanh() {
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query('SELECT content FROM static_pages WHERE slug = $1', ['he-thong-lanh']);
    const content = res.rows[0].content;
    console.log(JSON.stringify(content.sections[0].props, null, 2));
    await client.end();
}
checkLanh();
