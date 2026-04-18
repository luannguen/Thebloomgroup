import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, './.env') });

const { Pool } = pg;
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

async function seedCapabilityPage() {
  const client = await pool.connect();
  try {
    console.log('--- Seeding Hồ sơ năng lực Page via PostgreSQL ---');

    const content = {
      sections: [
        {
          id: 'cap-prof-hero',
          type: 'capability_profile',
          props: {
            title: 'Hồ sơ năng lực Viet Vinh Corp',
            description: 'Khám phá năng lực thiết kế, thi công và vận hành hệ thống điện lạnh hàng đầu của VVC. Cam kết chất lượng, tiến độ và giải pháp tối ưu bảo vệ môi trường.',
            previewImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
            pdfUrl: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/documents/VVC_Capability_Profile_2024.pdf',
            downloadText: 'Tải xuống Hồ sơ năng lực (PDF)'
          }
        },
        {
           id: 'cap-prof-contact',
           type: 'contact_form',
           props: {}
        }
      ]
    };

    // 1. Upsert Static Page
    const queryPage = `
      INSERT INTO static_pages (slug, title, content, excerpt)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) DO UPDATE
      SET title = EXCLUDED.title,
          content = EXCLUDED.content,
          excerpt = EXCLUDED.excerpt;
    `;
    
    await client.query(queryPage, [
      'ho-so-nang-luc',
      'Hồ sơ năng lực',
      JSON.stringify(content),
      'Tài liệu chi tiết về năng lực và kinh nghiệm triển khai dự án điện lạnh của Viet Vinh Corp.'
    ]);
    console.log('✅ Successfully upserted "ho-so-nang-luc" static page');

    // 2. Update Navigation Link
    // We target navigation items with label similar to "Hồ sơ năng lực"
    const queryNav = `
      UPDATE navigation 
      SET path = '/ho-so-nang-luc'
      WHERE label ILIKE '%Hồ sơ năng lực%'
    `;
    
    const navResult = await client.query(queryNav);
    console.log(`✅ Successfully updated ${navResult.rowCount} navigation link(s) for "Hồ sơ năng lực"`);

  } catch (err) {
    console.error('❌ Error seeding capability page:', err.message);
  } finally {
    client.release();
    pool.end();
  }
}

seedCapabilityPage();
