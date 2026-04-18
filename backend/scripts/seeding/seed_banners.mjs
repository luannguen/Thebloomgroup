import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';

const client = new pg.Client({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

const banners = [
  {
    title: 'Hệ Thống Lạnh Công Nghiệp Tiêu Chuẩn Quốc Tế',
    description: 'VVC cung cấp các giải pháp làm lạnh chuyên sâu cho nhà kho, trung tâm chế biến và logistics.',
    image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000',
    link: '/products/industrial',
    position: 'home_main',
    order_index: 1,
    is_active: true
  },
  {
    title: 'Tổng Thầu Cơ Điện (M&E) Chuyên Nghiệp',
    description: 'Thiết kế và thi công hệ thống điện lực, cấp thoát nước và HVAC cho các dự án quy mô lớn.',
    image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2000',
    link: '/services',
    position: 'home_main',
    order_index: 2,
    is_active: true
  },
  {
    title: 'Hạ Tầng Trung Tâm Dữ Liệu (Data Center)',
    description: 'Đảm bảo sự ổn định tuyệt đối cho hạ tầng số với giải pháp làm mát và nguồn điện dự phòng.',
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010924915e?auto=format&fit=crop&q=80&w=2000',
    link: '/technologies',
    position: 'home_main',
    order_index: 3,
    is_active: true
  }
];

async function seed() {
  try {
    await client.connect();
    
    // Clear existing main banners
    console.log('🗑  Clearing existing home banners...');
    await client.query("DELETE FROM banners WHERE position = 'home_main'");
    
    console.log('🌱  Seeding new banners...');
    for (const banner of banners) {
      await client.query(`
        INSERT INTO banners (title, description, image_url, link, position, order_index, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [banner.title, banner.description, banner.image_url, banner.link, banner.position, banner.order_index, banner.is_active]);
      console.log(`  ✅ Inserted: ${banner.title}`);
    }
    
    console.log('🎉  Banner seeding complete!');
  } catch (err) {
    console.error('❌ Error seeding banners:', err.message);
  } finally {
    await client.end();
  }
}

seed();
