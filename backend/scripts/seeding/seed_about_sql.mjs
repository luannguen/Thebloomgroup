import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const aboutContent = {
  sections: [
    {
      id: 'hero-' + Date.now(),
      type: 'about_hero',
      props: { 
        title: "Giới thiệu", 
        description: "Tổng công ty Kỹ thuật lạnh Việt Nam (VVC) - Đơn vị tiên phong trong giải pháp kỹ thuật lạnh công nghiệp bền vững và tiết kiệm năng lượng." 
      }
    },
    {
      id: 'history-' + Date.now(),
      type: 'about_history',
      props: {
        title: "Lịch sử phát triển",
        p1: 'Được thành lập vào năm 2003, VVC đã trải qua chặng đường hơn 20 năm phát triển bền vững, không ngừng đổi mới để trở thành Tổng công ty kỹ thuật lạnh hàng đầu Việt Nam.',
        p2: 'Sự kết hợp giữa đội ngũ kỹ sư chuyên môn cao và quy trình quản trị hiện đại đã giúp VVC khẳng định vị thế trong các lĩnh vực: kho lạnh công nghiệp, hệ thống điều hòa không khí và vật tư kỹ thuật lạnh.',
        image: '/vvc-hero.png',
        expYears: '20+',
        expText: 'Năm kinh nghiệm'
      }
    },
    {
      id: 'vision-' + Date.now(),
      type: 'about_vision',
      props: {
        visionTitle: "Tầm nhìn",
        visionDesc1: 'Trở thành biểu tượng uy tín hàng đầu trong ngành kỹ thuật lạnh tại Việt Nam và vươn tầm khu vực Đông Nam Á.',
        missionTitle: "Sứ mệnh",
        missionDesc1: 'Cung cấp hệ sinh thái giải pháp kỹ thuật lạnh bền vững, tiết kiệm năng lượng, góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường.'
      }
    },
    {
      id: 'values-' + Date.now(),
      type: 'about_values',
      props: { title: "Giá trị cốt lõi" }
    },
    { 
      id: 'partners-' + Date.now(), 
      type: 'about_partners', 
      props: { title: "Đối tác & Khách hàng" } 
    }
  ]
};

async function seedAboutPage() {
    try {
        await client.connect();
        
        const query = {
            text: 'UPDATE static_pages SET content = $1, title = $2, updated_at = NOW() WHERE slug = $3',
            values: [JSON.stringify(aboutContent), 'About Us', 'about-us'],
        };
        
        const res = await client.query(query);
        console.log(`Successfully updated ${res.rowCount} row(s).`);
        
    } catch (err) {
        console.error('Error seeding about-us page via SQL:', err);
    } finally {
        await client.end();
    }
}

seedAboutPage();
