import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;

// Use DATABASE_URL from .env
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL in .env');
  process.exit(1);
}

const client = new Client({
  connectionString: connectionString,
});

const PAGES = [
  {
    slug: 'he-thong-lanh',
    title: 'Hệ Thống Lạnh Công Nghiệp',
    title_en: 'Industrial Refrigeration Systems',
    content: {
      sections: [
        { id: 'refrig_hero', type: 'refrigeration', props: { 
            image: "/assets/images/industry/ca_tech.png",
            title: "Công Nghệ Làm Lạnh Công Nghiệp",
            description: "Giải pháp làm lạnh tiên tiến cho chuỗi cung ứng thực phẩm, tối ưu chất lượng và năng lượng."
        } },
        { id: 'refrig_catalog', type: 'cold_storage_catalog', props: {} },
        { id: 'refrig_tech', type: 'advanced_tech_showcase', props: {
            title: "Công Nghệ Bảo Quản & Cấp Đông Chuyên Sâu",
            subtitle: "VIETVINH tiên phong ứng dụng các giải pháp bảo quản tiên tiến nhất thế giới.",
            badge: "Specialized Solutions",
            items: [
                { title: "Công nghệ Bảo quản CA", desc: "Kiểm soát khí quyển cho phép lưu trữ trái cây trên 12 tháng.", link: "/cong-nghe-bao-quan-ca" },
                { title: "Cấp đông nhanh IQF", desc: "Cấp đông từng cá thể giữ nguyên dinh dưỡng.", link: "/cap-dong-nhanh-iqf" },
                { title: "Phòng chín chuối", desc: "Quy trình chín nhân tạo chuẩn khoa học.", link: "/phong-chin-chuoi-tieu-chuan" },
                { title: "Hầm đông gió", desc: "Hạ nhiệt độ cực nhanh xuống -35°C.", link: "/ham-dong-gio-cong-suat-lon" }
            ]
        } },
        { id: 'refrig_expertise', type: 'industrial_expertise', props: {} },
        { id: 'refrig_contact', type: 'contact_form', props: {} }
      ]
    }
  },
  {
    slug: 'cong-nghe-bao-quan-ca',
    title: 'Công nghệ Bảo quản CA',
    title_en: 'CA Storage Technology',
    content: {
      sections: [
        { id: 'tech_ca', type: 'technical_detail', props: { 
            techType: 'ca',
            accent: 'blue',
            image: "/assets/images/industry/ca_tech.png",
            title: "Công nghệ Khí quyển Kiểm soát (CA)",
            description: "Hệ thống Controlled Atmosphere (CA) là công nghệ bảo quản rau quả tiên tiến nhất hiện nay, hoạt động bằng cách thay đổi thành phần không khí bên trong kho lạnh để làm chậm quá trình chín và hô hấp của nông sản.",
            features: [
                "Kiểm soát chính xác tỷ lệ O2 và CO2",
                "Kéo dài thời gian bảo quản gấp 2-4 lần",
                "Giữ nguyên độ giòn và hương vị tự nhiên",
                "Giảm thiểu hao hụt trọng lượng sản phẩm"
            ]
        } },
        { id: 'tech_ca_contact', type: 'contact_form', props: {} }
      ]
    }
  },
  {
    slug: 'cap-dong-nhanh-iqf',
    title: 'Cấp đông nhanh IQF',
    title_en: 'IQF Fast Freezing',
    content: {
      sections: [
        { id: 'tech_iqf', type: 'technical_detail', props: { 
            techType: 'iqf',
            accent: 'cyan',
            image: "/assets/images/industry/iqf_tech.png",
            title: "Hệ thống Cấp đông Nhanh IQF",
            description: "Công nghệ IQF (Individual Quick Freezing) cho phép cấp đông nhanh từng cá thể sơ chế, đảm bảo sản phẩm không bị dính vào nhau và giữ nguyên cấu trúc tế bào sau khi rã đông.",
            features: [
                "Tốc độ cấp đông cực nhanh",
                "Giữ trọn vẹn giá trị dinh dưỡng",
                "Công nghệ Fluidized Bed tiên tiến",
                "Tiết kiệm nước và hóa chất vệ sinh"
            ]
        } },
        { id: 'tech_iqf_contact', type: 'contact_form', props: {} }
      ]
    }
  },
  {
    slug: 'phong-chin-chuoi-tieu-chuan',
    title: 'Phòng chín chuối tiêu chuẩn',
    title_en: 'Banana Ripening Room',
    content: {
      sections: [
        { id: 'tech_ripening', type: 'technical_detail', props: { 
            techType: 'ripening',
            accent: 'amber',
            image: "/assets/images/industry/ripening_tech.png",
            title: "Phòng Chín Chuối Tiêu Chuẩn Quốc Tế",
            description: "Hệ thống làm chín bằng khí Ethylene trong môi trường kiểm soát nhiệt độ và độ ẩm tuyệt đối, giúp trái cây chín đồng đều về màu sắc và đạt hương vị thơm ngon nhất.",
            features: [
                "Kiểm soát nồng độ Ethylene tự động",
                "Hệ thống quạt đối lưu áp suất cao",
                "Màu sắc trái chín vàng đều và đẹp",
                "Tối ưu hóa thời gian và chi phí vận hành"
            ]
        } },
        { id: 'tech_ripening_contact', type: 'contact_form', props: {} }
      ]
    }
  },
  {
    slug: 'ham-dong-gio-cong-suat-lon',
    title: 'Hầm đông gió (Blast Freezer)',
    title_en: 'Blast Freezer Technology',
    content: {
      sections: [
        { id: 'tech_blast', type: 'technical_detail', props: { 
            techType: 'blast',
            accent: 'indigo',
            image: "/assets/images/industry/blast_tech.png",
            title: "Hầm Đông Gió Công Suất Lớn",
            description: "Giải pháp cấp đông tập trung cho lượng lớn sản phẩm như thịt, thủy sản. Hầm đông gió sử dụng luồng khí lạnh áp lực cao để hạ nhiệt độ tâm sản phẩm xuống -35°C trong thời gian ngắn nhất.",
            features: [
                "Công suất cấp đông mạnh mẽ",
                "Dàn lạnh hiệu suất giải nhiệt cao",
                "Cách nhiệt panel mật độ cao (PIR/PU)",
                "Ngăn chặn sự phát triển của vi khuẩn"
            ]
        } },
        { id: 'tech_blast_contact', type: 'contact_form', props: {} }
      ]
    }
  }
];

async function seed() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    for (const page of PAGES) {
      console.log(`Processing page: ${page.slug}...`);
      
      const query = `
        INSERT INTO static_pages (slug, title, title_en, content, is_active, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        ON CONFLICT (slug) 
        DO UPDATE SET 
          title = EXCLUDED.title,
          title_en = EXCLUDED.title_en,
          content = EXCLUDED.content,
          is_active = EXCLUDED.is_active,
          updated_at = NOW();
      `;

      const values = [
        page.slug,
        page.title,
        page.title_en,
        JSON.stringify(page.content),
        true
      ];

      await client.query(query, values);
      console.log(`✓ Successfully synced ${page.slug}`);
    }

    console.log('All pages synced successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await client.end();
  }
}

seed();
