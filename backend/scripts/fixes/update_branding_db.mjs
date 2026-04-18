import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function updateBranding() {
  const client = await pool.connect();
  try {
    console.log('--- Updating VRC to VVC in Database Content ---');
    
    const tables = [
      { name: 'products', columns: ['name', 'slug', 'description'] },
      { name: 'news', columns: ['title', 'slug', 'summary', 'content', 'author'] },
      { name: 'projects', columns: ['name', 'slug', 'description', 'content', 'client'] },
      { name: 'events', columns: ['title', 'slug', 'summary', 'content', 'location', 'organizer'] },
      { name: 'team_members', columns: ['name', 'bio', 'role'] },
      { name: 'banners', columns: ['title', 'description', 'link', 'position'] },
      { name: 'categories', columns: ['name', 'slug'] },
      { name: 'navigation', columns: ['label', 'path'] },
      { name: 'site_settings', columns: ['key', 'value', 'description'] },
      { name: 'static_pages', columns: ['title', 'slug', 'content', 'excerpt'] },
      { name: 'faqs', columns: ['question', 'answer'] },
      { name: 'resources', columns: ['title', 'slug', 'description', 'link'] }
    ];

    for (const table of tables) {
      console.log(`Updating table: ${table.name}...`);
      for (const col of table.columns) {
        // Case-sensitive replace for 'VRC' to 'VVC'
        const queryVRC = `
          UPDATE ${table.name} 
          SET ${col} = REPLACE(${col}, 'VRC', 'VVC')
          WHERE ${col} LIKE '%VRC%';
        `;
        const resVRC = await client.query(queryVRC);
        
        // Handle lowercase 'vrc' for slugs and text
        const queryvrc = `
          UPDATE ${table.name} 
          SET ${col} = REPLACE(${col}, 'vrc', 'vvc')
          WHERE ${col} LIKE '%vrc%';
        `;
        const resvrc = await client.query(queryvrc);

        const totalUpdated = (resVRC.rowCount || 0) + (resvrc.rowCount || 0);
        if (totalUpdated > 0) {
          console.log(`  Updated ${totalUpdated} occurrences in ${table.name}.${col}`);
        }
      }
    }

    console.log('✅ Database branding update complete.');
  } catch (err) {
    console.error('❌ Error updating database:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

updateBranding();
