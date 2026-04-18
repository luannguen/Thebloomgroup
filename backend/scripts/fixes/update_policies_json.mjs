import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

async function migrate() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        
        const slugs = ['chinh-sach-bao-mat', 'chinh-sach-cookie', 'dieu-khoan-su-dung'];
        
        for (const slug of slugs) {
            console.log(`Migrating ${slug}...`);
            const res = await client.query("SELECT content FROM static_pages WHERE slug = $1", [slug]);
            
            if (res.rows.length === 0) {
                console.log(`- Slug ${slug} not found.`);
                continue;
            }
            
            const rawContent = res.rows[0].content;
            
            // Check if already in JSON format
            try {
                const parsed = JSON.parse(rawContent);
                if (parsed.sections) {
                    console.log(`- Slug ${slug} already has sections. Skipping.`);
                    continue;
                }
            } catch (e) {
                // Not JSON, continue with migration
            }
            
            // Wrap in JSON section
            const newContent = JSON.stringify({
                sections: [
                    {
                        id: `rich-text-${Date.now()}`,
                        type: "rich_text",
                        props: {
                            content: rawContent || `<h1>${slug}</h1><p>Nội dung đang cập nhật...</p>`
                        }
                    }
                ]
            });
            
            await client.query("UPDATE static_pages SET content = $1 WHERE slug = $2", [newContent, slug]);
            console.log(`- Updated ${slug} successfully.`);
        }
        
    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await client.end();
    }
}

migrate();
