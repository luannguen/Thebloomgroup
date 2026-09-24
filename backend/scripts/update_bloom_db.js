import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres'
});

async function runMigration() {
  const client = await pool.connect();
  try {
    console.log('--- STARTING BLOOM GROUP DB UPDATE ---');
    await client.query('BEGIN');

    // 1. Update site_settings
    console.log('1. Updating site_settings...');
    const settingsUpdates = [
      ['contact_phone', '+84 963 415 369'],
      ['contact_hotline', '+84 963 415 369'],
      ['company_name', 'TheBloom Group'],
      ['site_name', 'TheBloom Group'],
      ['site_title', 'TheBloom Group - Kết Nối, Sản Xuất, Nâng Tầm Giá Trị'],
      ['site_description', 'TheBloom Group là doanh nghiệp hoạt động đa lĩnh vực trong sản xuất và cung ứng giải pháp công nghiệp – tiêu dùng, với trọng tâm gồm: Thiết bị giặt là công nghiệp, May gia công & thời trang, Sản xuất đồ gia dụng & giải pháp không gian sống.'],
      ['contact_address', 'Việt Nam'],
      ['footer_description', 'TheBloom Group - Đối tác chiến lược toàn diện cho doanh nghiệp và khách hàng trong nước & quốc tế.']
    ];

    for (const [key, value] of settingsUpdates) {
      await client.query(
        `INSERT INTO site_settings (key, value, updated_at) 
         VALUES ($1, $2, NOW()) 
         ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
        [key, value]
      );
    }

    // 2. Update navigation table
    console.log('2. Updating navigation...');
    // Deactivate existing header items
    await client.query("UPDATE navigation SET is_active = false WHERE position = 'header'");

    // Define 6 header items exactly as requested by user
    const headerItems = [
      { label: 'Giới thiệu', path: '/about-us', order_index: 1 },
      { label: 'Thiết bị giặt là', path: '/thiet-bi-giat-la', order_index: 2 },
      { label: 'Thời trang và may mặc', path: '/thoi-trang-may-mac', order_index: 3 },
      { label: 'Không gian sống', path: '/khong-gian-song', order_index: 4 },
      { label: 'Giải pháp dịch vụ', path: '/giai-phap-dich-vu', order_index: 5 },
      { label: 'Liên hệ', path: '/contact', order_index: 6 },
    ];

    for (const item of headerItems) {
      const existing = await client.query(
        "SELECT id FROM navigation WHERE position = 'header' AND path = $1",
        [item.path]
      );
      if (existing.rows.length > 0) {
        await client.query(
          "UPDATE navigation SET label = $1, order_index = $2, is_active = true, parent_id = null, children = null WHERE id = $3",
          [item.label, item.order_index, existing.rows[0].id]
        );
      } else {
        await client.query(
          `INSERT INTO navigation (label, path, position, order_index, is_active, type)
           VALUES ($1, $2, 'header', $3, true, 'internal')`,
          [item.label, item.path, item.order_index]
        );
      }
    }

    // 3. Deactivate old Viet Vinh static pages
    console.log('3. Deactivating old Viet Vinh static pages...');
    const oldSlugs = [
      'he-thong-lanh', 'he-thong-co-dien', 'he-thong-dc-management', 'he-thong-tich-hop',
      'he-thong-bms', 'he-thong-dien', 'he-thong-hvac', 'he-thong-ong-cong-nghe',
      'phong-sach', 'phong-chay-chua-chay', 'cap-dong-nhanh-iqf', 'ham-dong-gio-cong-suat-lon',
      'cong-nghe-bao-quan-ca', 'phong-chin-chuoi-tieu-chuan'
    ];
    await client.query(
      "UPDATE static_pages SET is_active = false WHERE slug = ANY($1)",
      [oldSlugs]
    );

    // 4. Update 'about-us' static page
    console.log('4. Updating about-us static page...');
    const aboutIntro = `TheBloom Group là doanh nghiệp hoạt động đa lĩnh vực trong sản xuất và cung ứng giải pháp công nghiệp – tiêu dùng, với trọng tâm gồm: Thiết bị giặt là công nghiệp, May gia công & thời trang, Sản xuất đồ gia dụng & giải pháp không gian sống.\n\nVới nền tảng năng lực sản xuất mạnh mẽ cùng tư duy phát triển bền vững, TheBloom Group hướng đến trở thành đối tác chiến lược toàn diện cho doanh nghiệp và khách hàng trong nước & quốc tế.`;

    const aboutContent = {
      sections: [
        {
          id: 'hero',
          type: 'about_hero',
          props: {
            title: 'GIỚI THIỆU VỀ THEBLOOM GROUP',
            title_en: 'ABOUT THEBLOOM GROUP',
            description: aboutIntro,
            description_en: 'TheBloom Group is a multi-sector enterprise specializing in manufacturing and supplying industrial & consumer solutions with focus on Industrial Laundry Equipment, Garment & Fashion Manufacturing, Household & Living Space Solutions.'
          }
        },
        {
          id: 'history',
          type: 'about_history',
          props: {
            title: 'Năng Lực & Tầm Vóc Doanh Nghiệp',
            title_en: 'Corporate Capability & Vision',
            p1: 'TheBloom Group phát triển dựa trên nền tảng sản xuất công nghiệp vững chắc, dây chuyền máy móc hiện đại và đội ngũ chuyên gia giàu kinh nghiệm.',
            p2: 'Chúng tôi cam kết chất lượng chuẩn quốc tế, đồng hành bền vững cùng các đối tác, khách hàng trong và ngoài nước trên hành trình kiến tạo giá trị thịnh vượng.',
            expYears: '10+',
            expText: 'Năm kinh nghiệm sản xuất',
            expText_en: 'Years of Experience',
            p3: 'TheBloom Group tự hào là đối tác tin cậy hàng đầu trong các lĩnh vực Thiết bị giặt là, May gia công thời trang và Sản xuất đồ gia dụng.'
          }
        },
        {
          id: 'pillars',
          type: 'about_facilities',
          props: {
            title: 'Các Trọng Tâm Lĩnh Vực Của TheBloom Group',
            description: '1. Thiết bị giặt là công nghiệp (UniMac, máy giặt - sấy - ủi công suất lớn)\n2. May gia công & Thời trang xuất khẩu (FOB, CMT chất lượng cao)\n3. Sản xuất đồ gia dụng & Tiện ích không gian sống\n4. Dịch vụ kỹ thuật công nghiệp 24/7 (Bảo trì, sửa chữa, tối ưu hóa)'
          }
        },
        {
          id: 'quality',
          type: 'about_quality',
          props: {
            title: 'Cam Kết Chất Lượng & Phát Triển Bền Vững',
            q1_title: 'Chất lượng vượt trội',
            q1_desc: 'Quy trình kiểm định chất lượng nghiêm ngặt ở mọi công đoạn sản xuất và cung ứng.',
            q2_title: 'Công nghệ tiên tiến',
            q2_desc: 'Ứng dụng tự động hóa, thiết bị tiên tiến tối ưu năng suất và bảo vệ môi trường.',
            q3_title: 'Đối tác chiến lược',
            q3_desc: 'Đồng hành dài hạn, xây dựng mối quan hệ tin cậy và bền vững với mọi khách hàng.',
            q4_title: 'Dịch vụ 24/7',
            q4_desc: 'Hỗ trợ kỹ thuật, tư vấn chuyên môn nhanh chóng và chuyên nghiệp bất kỳ lúc nào.'
          }
        }
      ]
    };

    await client.query(
      `INSERT INTO static_pages (slug, title, excerpt, content, is_active, updated_at)
       VALUES ($1, $2, $3, $4, true, NOW())
       ON CONFLICT (slug) DO UPDATE SET 
          title = EXCLUDED.title,
          excerpt = EXCLUDED.excerpt,
          content = EXCLUDED.content,
          is_active = true,
          updated_at = NOW()`,
      ['about-us', 'Giới thiệu về TheBloom Group', aboutIntro, JSON.stringify(aboutContent)]
    );

    // 5. Insert/Update Sector Pages in static_pages
    const sectors = [
      {
        slug: 'thiet-bi-giat-la',
        title: 'Thiết Bị Giặt Là Công Nghiệp',
        excerpt: 'Giải pháp toàn diện cho hệ thống giặt là công nghiệp. Hiệu suất vượt trội, tiêu chuẩn quốc tế, tiết kiệm năng lượng, hỗ trợ toàn diện 24/7.',
        image_url: '/images/bloom/thiet-bi-giat-la.jpg'
      },
      {
        slug: 'thoi-trang-may-mac',
        title: 'May Gia Công & Thời Trang',
        excerpt: 'Giải pháp may gia công toàn diện cho thương hiệu trong và ngoài nước. Năng lực sản xuất tối ưu, chất lượng vượt trội, thiết kế & phát triển linh hoạt.',
        image_url: '/images/bloom/thoi-trang-may-mac.jpg'
      },
      {
        slug: 'khong-gian-song',
        title: 'Không Gian Sống & Đồ Gia Dụng',
        excerpt: 'Giải pháp sản xuất toàn diện cho sản phẩm chất lượng & bền vững. Hệ thống sản xuất hiện đại, kiểm soát chất lượng chặt chẽ, đổi mới và bền vững.',
        image_url: '/images/bloom/do-gia-dung.jpg'
      },
      {
        slug: 'giai-phap-dich-vu',
        title: 'Giải Pháp Dịch Vụ & Kỹ Thuật',
        excerpt: 'Giải pháp kỹ thuật toàn diện - Vận hành ổn định - Hiệu suất tối ưu: Bảo trì định kỳ, sửa chữa chuyên nghiệp, nâng cấp & tối ưu 24/7.',
        image_url: '/images/bloom/dich-vu-ky-thuat.jpg'
      }
    ];

    for (const s of sectors) {
      await client.query(
        `INSERT INTO static_pages (slug, title, excerpt, is_active, image_url, updated_at)
         VALUES ($1, $2, $3, true, $4, NOW())
         ON CONFLICT (slug) DO UPDATE SET 
            title = EXCLUDED.title,
            excerpt = EXCLUDED.excerpt,
            is_active = true,
            image_url = EXCLUDED.image_url,
            updated_at = NOW()`,
        [s.slug, s.title, s.excerpt, s.image_url]
      );
    }

    await client.query('COMMIT');
    console.log('--- BLOOM GROUP DB UPDATE COMPLETED SUCCESSFULLY ---');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error in DB migration:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);
