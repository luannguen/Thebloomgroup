import pg from 'pg';
const { Client } = pg;
const connectionString = 'postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres';

async function checkContent() {
    const client = new Client({ connectionString });
    await client.connect();
    const res = await client.query('SELECT content FROM static_pages WHERE slug = $1', ['he-thong-co-dien']);
    let content = res.rows[0].content;
    if (typeof content === 'string') {
        content = JSON.parse(content);
    }
    const heroSection = content.sections.find(s => s.id === 'hero');
    console.log(JSON.stringify(heroSection, null, 2));
    await client.end();
}
checkContent();
