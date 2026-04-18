import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const client = await pool.connect();
  try {
    // Get categories for FK references
    const cats = await client.query("SELECT id, name, slug, type FROM categories ORDER BY type, name");
    console.log('=== CATEGORIES ===');
    for (const c of cats.rows) {
      console.log(`  [${c.type}] ${c.slug} (${c.name}) => ${c.id}`);
    }

    // =============================================
    // SEED PRODUCTS (6 products)
    // =============================================
    console.log('\n--- Seeding PRODUCTS ---');
    await client.query("DELETE FROM products WHERE slug LIKE 'vvc-%'");

    const industrialCat = cats.rows.find(c => c.slug === 'industrial');
    const commercialCat = cats.rows.find(c => c.slug === 'commercial');
    const residentialCat = cats.rows.find(c => c.slug === 'residential');
    const coldStorageCat = cats.rows.find(c => c.slug === 'cold-storage');

    await client.query(`
      INSERT INTO products (name, slug, description, category_id, price, is_new, is_bestseller, image_url, features, specifications)
      VALUES
      (
        'Hệ thống VRV/VRF công nghiệp',
        'vvc-vrv-vrf-industrial',
        'Hệ thống điều hòa trung tâm VRV/VRF công suất lớn, phù hợp cho các nhà máy, khu công nghiệp và tòa nhà thương mại quy mô lớn. Tiết kiệm năng lượng lên đến 30% so với hệ thống truyền thống.',
        $1, 'Liên hệ', false, true,
        'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800',
        '["Công suất từ 8HP đến 60HP", "Tiết kiệm năng lượng 30%", "Inverter thế hệ mới", "Điều khiển thông minh BMS"]'::jsonb,
        '{"cooling_capacity": "22.4kW - 168kW", "power_supply": "380V/3P/50Hz", "refrigerant": "R410A", "cop": "4.12"}'::jsonb
      ),
      (
        'Điều hòa Chiller giải nhiệt nước',
        'vvc-chiller-water-cooled',
        'Hệ thống Chiller giải nhiệt nước công suất lớn, thiết kế cho các tòa nhà cao tầng, trung tâm thương mại và bệnh viện. Vận hành ổn định, hiệu suất cao.',
        $1, 'Liên hệ', true, false,
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800',
        '["Công suất 100-2000 RT", "Hiệu suất COP > 6.0", "Máy nén trục vít/ly tâm", "Hệ thống giám sát từ xa"]'::jsonb,
        '{"cooling_capacity": "350kW - 7000kW", "power_supply": "380V/3P/50Hz", "refrigerant": "R134a/R513A", "cop": "6.1"}'::jsonb
      ),
      (
        'Hệ thống điều hòa thương mại',
        'vvc-commercial-hvac',
        'Giải pháp điều hòa toàn diện cho văn phòng, showroom, nhà hàng và cửa hàng. Thiết kế linh hoạt, lắp đặt nhanh chóng, vận hành êm ái.',
        $2, 'Liên hệ', false, true,
        'https://images.unsplash.com/photo-1631545806609-13e22e6b77ad?w=800',
        '["Công suất 2HP - 10HP", "Thiết kế âm trần cassette", "Gas R32 thân thiện môi trường", "Điều khiển wifi thông minh"]'::jsonb,
        '{"cooling_capacity": "5.6kW - 28kW", "power_supply": "220V/1P/50Hz", "refrigerant": "R32", "noise_level": "< 38dB"}'::jsonb
      ),
      (
        'Điều hòa dân dụng cao cấp',
        'vvc-residential-premium',
        'Dòng điều hòa dân dụng cao cấp với công nghệ lọc không khí tiên tiến, tiết kiệm điện tối ưu và thiết kế sang trọng phù hợp mọi không gian sống.',
        $3, '15,000,000 - 45,000,000 VNĐ', true, true,
        'https://images.unsplash.com/photo-1585338a0dca-3680?w=800',
        '["Công nghệ Nanoe-X khử khuẩn", "Inverter tiết kiệm 60% điện năng", "Cảm biến chuyển động thông minh", "Vận hành siêu êm 19dB"]'::jsonb,
        '{"cooling_capacity": "2.5kW - 7.1kW", "power_supply": "220V/1P/50Hz", "refrigerant": "R32", "energy_rating": "5 sao"}'::jsonb
      ),
      (
        'Kho lạnh bảo quản công nghiệp',
        'vvc-cold-storage-industrial',
        'Hệ thống kho lạnh công nghiệp chuyên dụng cho bảo quản thực phẩm, dược phẩm và hàng hóa nhạy cảm nhiệt độ. Đạt chuẩn HACCP và GMP.',
        $4, 'Liên hệ', false, true,
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
        '["Nhiệt độ -40°C đến +15°C", "Panel PU cách nhiệt 100-200mm", "Hệ thống giám sát nhiệt độ 24/7", "Đạt chuẩn HACCP, GMP"]'::jsonb,
        '{"temperature_range": "-40°C đến +15°C", "panel_thickness": "100-200mm", "compressor": "Bitzer/Copeland", "monitoring": "IoT 24/7"}'::jsonb
      ),
      (
        'Hệ thống AHU xử lý không khí',
        'vvc-ahu-air-handling',
        'Air Handling Unit (AHU) - Hệ thống xử lý không khí trung tâm cho phòng sạch, bệnh viện và nhà máy sản xuất. Đáp ứng tiêu chuẩn ISO 14644.',
        $1, 'Liên hệ', true, false,
        'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800',
        '["Lọc HEPA H13/H14", "Kiểm soát nhiệt độ ±0.5°C", "Kiểm soát độ ẩm ±3%RH", "Tiêu chuẩn phòng sạch ISO Class 5-8"]'::jsonb,
        '{"air_flow": "1000-50000 CMH", "filter_class": "HEPA H14", "temperature_control": "±0.5°C", "humidity_control": "±3%RH"}'::jsonb
      )
    `, [industrialCat?.id, commercialCat?.id, residentialCat?.id, coldStorageCat?.id]);
    console.log('✅ Products inserted (6 rows)');

    // =============================================
    // SEED NEWS (5 articles)
    // =============================================
    console.log('\n--- Seeding NEWS ---');
    await client.query("DELETE FROM news WHERE slug LIKE 'vvc-%'");

    const companyNewsCat = cats.rows.find(c => c.slug === 'company-news');
    const technologyCat = cats.rows.find(c => c.slug === 'technology');

    await client.query(`
      INSERT INTO news (title, slug, summary, content, image_url, publish_date, author, category_id, tags, views)
      VALUES
      (
        'VVC hoàn thành dự án hệ thống lạnh cho Vinamilk Factory',
        'vvc-hoan-thanh-du-an-vinamilk',
        'Tổng công ty VVC vừa hoàn thành lắp đặt hệ thống điều hòa trung tâm và kho lạnh cho nhà máy Vinamilk tại Bình Dương.',
        '<h2>Dự án tiêu biểu của VVC trong năm 2024</h2><p>VVC đã hoàn thành việc lắp đặt toàn bộ hệ thống điều hòa trung tâm và kho lạnh bảo quản sản phẩm cho nhà máy Vinamilk tại KCN VSIP II, Bình Dương. Đây là một trong những dự án lớn nhất mà VVC thực hiện trong năm 2024.</p><p>Hệ thống bao gồm 2 chiller giải nhiệt nước với tổng công suất 1000 RT, hệ thống AHU cho khu vực sản xuất và 3 kho lạnh bảo quản sản phẩm ở các mức nhiệt độ khác nhau.</p>',
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        NOW() - INTERVAL '5 days',
        'Ban biên tập VVC',
        $1, ARRAY['dự án', 'kho lạnh', 'công nghiệp'], 234
      ),
      (
        'Xu hướng công nghệ điều hòa không khí 2025',
        'vvc-xu-huong-cong-nghe-2025',
        'Các xu hướng công nghệ mới trong ngành HVAC năm 2025: AI, IoT, và giải pháp xanh.',
        '<h2>Công nghệ HVAC thế hệ mới</h2><p>Năm 2025 đánh dấu bước ngoặt lớn của ngành HVAC với sự tích hợp sâu của trí tuệ nhân tạo (AI) và Internet of Things (IoT). Các hệ thống điều hòa thông minh có khả năng tự học hành vi sử dụng và tối ưu hóa hiệu suất năng lượng.</p><p>VVC là một trong những đơn vị tiên phong trong việc áp dụng các công nghệ này vào các giải pháp cho khách hàng.</p>',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        NOW() - INTERVAL '12 days',
        'Phòng R&D VVC',
        $2, ARRAY['công nghệ', 'AI', 'IoT', 'HVAC'], 567
      ),
      (
        'VVC nhận giải thưởng Doanh nghiệp Xanh 2024',
        'vvc-giai-thuong-doanh-nghiep-xanh-2024',
        'VVC vinh dự nhận giải thưởng Doanh nghiệp Xanh 2024 vì những đóng góp trong lĩnh vực tiết kiệm năng lượng.',
        '<h2>Giải thưởng uy tín cho doanh nghiệp bền vững</h2><p>Ngày 15/11/2024, tại Hà Nội, VVC vinh dự nhận giải thưởng "Doanh nghiệp Xanh 2024" do Bộ Tài nguyên và Môi trường trao tặng. Giải thưởng ghi nhận những nỗ lực không ngừng của VVC trong việc cung cấp các giải pháp điện lạnh thân thiện với môi trường và tiết kiệm năng lượng.</p>',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        NOW() - INTERVAL '20 days',
        'Ban truyền thông VVC',
        $1, ARRAY['giải thưởng', 'xanh', 'bền vững'], 890
      ),
      (
        'Hướng dẫn bảo trì hệ thống điều hòa mùa hè',
        'vvc-huong-dan-bao-tri-mua-he',
        'Những lưu ý quan trọng để bảo trì hệ thống điều hòa trước mùa hè, giúp tiết kiệm điện và tăng tuổi thọ thiết bị.',
        '<h2>Bảo trì đúng cách - Tiết kiệm hơn 20% điện năng</h2><p>Mùa hè đến, nhu cầu sử dụng điều hòa tăng cao. Việc bảo trì định kỳ sẽ giúp hệ thống vận hành hiệu quả hơn, tiết kiệm đến 20% điện năng tiêu thụ.</p><p>VVC khuyến nghị thực hiện các bước bảo trì: Vệ sinh lưới lọc 2 tuần/lần, kiểm tra gas 6 tháng/lần, vệ sinh dàn nóng 3 tháng/lần...</p>',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800',
        NOW() - INTERVAL '30 days',
        'Phòng Kỹ thuật VVC',
        $2, ARRAY['bảo trì', 'tiết kiệm điện', 'mùa hè'], 1205
      ),
      (
        'VVC mở rộng chi nhánh tại Đà Nẵng',
        'vvc-mo-rong-chi-nhanh-da-nang',
        'VVC chính thức khai trương chi nhánh mới tại Đà Nẵng, phục vụ khách hàng khu vực miền Trung.',
        '<h2>Mở rộng mạng lưới phục vụ toàn quốc</h2><p>Ngày 01/10/2024, VVC chính thức khai trương chi nhánh mới tại 123 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng. Đây là bước đi quan trọng trong chiến lược mở rộng mạng lưới toàn quốc của VVC, nhằm phục vụ tốt hơn khách hàng khu vực miền Trung - Tây Nguyên.</p>',
        'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
        NOW() - INTERVAL '45 days',
        'Ban biên tập VVC',
        $1, ARRAY['chi nhánh', 'Đà Nẵng', 'mở rộng'], 432
      )
    `, [companyNewsCat?.id, technologyCat?.id]);
    console.log('✅ News inserted (5 rows)');

    // =============================================
    // SEED PROJECTS (4 projects)
    // =============================================
    console.log('\n--- Seeding PROJECTS ---');
    await client.query("DELETE FROM projects WHERE slug LIKE 'vvc-%'");

    const projIndustrialCat = cats.rows.find(c => c.slug === 'project-industrial');
    const projCommercialCat = cats.rows.find(c => c.slug === 'project-commercial');

    await client.query(`
      INSERT INTO projects (name, slug, description, content, image_url, client, completion_date, category_id, is_featured)
      VALUES
      (
        'Hệ thống HVAC Nhà máy Samsung HCMC',
        'vvc-samsung-hcmc-hvac',
        'Thiết kế và lắp đặt hệ thống HVAC hoàn chỉnh cho nhà máy Samsung tại KCN Saigon Hi-Tech Park, bao gồm phòng sạch Class 100 và hệ thống chiller 3000 RT.',
        '<p>Dự án bao gồm thiết kế, cung cấp và lắp đặt toàn bộ hệ thống HVAC cho nhà máy sản xuất linh kiện điện tử Samsung tại TP.HCM. Hệ thống phòng sạch đạt tiêu chuẩn ISO Class 5 (Class 100), với tổng công suất lạnh 3000 RT sử dụng chiller ly tâm hiệu suất cao.</p>',
        'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
        'Samsung Electronics Vietnam',
        '2024-06-15',
        $1, true
      ),
      (
        'Kho lạnh Vissan Bình Dương',
        'vvc-vissan-cold-storage',
        'Xây dựng hệ thống kho lạnh 5000m² cho Công ty Vissan tại Bình Dương with nhiệt độ bảo quản từ -25°C đến +5°C.',
        '<p>VVC thiết kế và thi công hệ thống kho lạnh bảo quản thực phẩm with tổng diện tích 5000m², bao gồm khu vực đông lạnh (-25°C), kho mát (+5°C) và khu vực xử lý nguyên liệu. Hệ thống đạt chuẩn HACCP và GMP quốc tế.</p>',
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        'Công ty CP Việt Nam Kỹ nghệ Súc sản (Vissan)',
        '2024-03-20',
        $1, true
      ),
      (
        'Trung tâm thương mại Aeon Mall Hà Đông',
        'vvc-aeon-mall-ha-dong',
        'Cung cấp và lắp đặt hệ thống điều hòa trung tâm cho TTTM Aeon Mall Hà Đông with tổng diện tích sàn 100,000m².',
        '<p>Dự án lắp đặt hệ thống điều hòa trung tâm cho toàn bộ khu trung tâm thương mại Aeon Mall Hà Đông. Hệ thống bao gồm 4 chiller giải nhiệt nước with tổng công suất 4000 RT, hệ thống AHU, FCU và hệ thống BMS giám sát tự động toàn bộ.</p>',
        'https://images.unsplash.com/photo-1567449303078-57ad995bd329?w=800',
        'Aeon Mall Vietnam',
        '2023-11-10',
        $2, true
      ),
      (
        'Bệnh viện Đa khoa Quốc tế Vinmec',
        'vvc-vinmec-hospital',
        'Lắp đặt hệ thống HVAC and phòng sạch cho khoa Phẫu thuật and ICU tại Bệnh viện Vinmec Central Park, TP.HCM.',
        '<p>VVC thực hiện lắp đặt hệ thống HVAC chuyên dụng cho bệnh viện, bao gồm hệ thống xử lý không khí cho 12 phòng phẫu thuật đạt chuẩn ISO Class 7, khu ICU with kiểm soát áp suất dương/âm, and hệ thống lọc HEPA H14 đảm bảo chất lượng không khí đạt tiêu chuẩn y tế quốc tế.</p>',
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        'Vingroup - Vinmec',
        '2024-01-25',
        $2, false
      )
    `, [projIndustrialCat?.id, projCommercialCat?.id]);
    console.log('✅ Projects inserted (4 rows)');

    // =============================================
    // SEED EVENTS (3 events)
    // =============================================
    console.log('\n--- Seeding EVENTS ---');
    await client.query("DELETE FROM events WHERE slug LIKE 'vvc-%'");

    const exhibitionCat = cats.rows.find(c => c.slug === 'exhibition');
    const workshopCat = cats.rows.find(c => c.slug === 'workshop');

    await client.query(`
      INSERT INTO events (title, slug, summary, content, image_url, start_date, end_date, location, organizer, status, category_id, participants_count, tags)
      VALUES
      (
        'Triển lãm Quốc tế HVACR Vietnam 2025',
        'vvc-hvacr-vietnam-2025',
        'VVC tham gia Triển lãm Quốc tế HVACR Vietnam 2025 tại SECC TP.HCM, giới thiệu các giải pháp điện lạnh mới nhất.',
        '<p>VVC tham gia với gian hàng 200m² tại Triển lãm Quốc tế HVACR Vietnam 2025, trưng bày các sản phẩm and giải pháp mới nhất trong lĩnh vực điều hòa không khí, kho lạnh and xử lý không khí.</p>',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
        NOW() + INTERVAL '30 days',
        NOW() + INTERVAL '33 days',
        'Trung tâm Hội chợ Triển lãm Sài Gòn (SECC), Q.7, TP.HCM',
        'HVACR Vietnam',
        'upcoming',
        $1, 0, ARRAY['triển lãm', 'HVAC', 'quốc tế']
      ),
      (
        'Hội thảo Tiết kiệm Năng lượng trong Công nghiệp',
        'vvc-hoi-thao-tiet-kiem-nang-luong',
        'Hội thảo chuyên đề về các giải pháp tiết kiệm năng lượng trong hệ thống điện lạnh công nghiệp.',
        '<p>VVC phối hợp tổ chức hội thảo chuyên đề "Giải pháp tiết kiệm năng lượng trong hệ thống điện lạnh công nghiệp" tại Khách sạn Rex, TP.HCM. Chương trình gồm các bài trình bày từ chuyên gia trong and ngoài nước.</p>',
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
        NOW() + INTERVAL '15 days',
        NOW() + INTERVAL '15 days',
        'Khách sạn Rex, 141 Nguyễn Huệ, Q.1, TP.HCM',
        'VVC & Hiệp hội Cơ điện lạnh Việt Nam',
        'upcoming',
        $2, 0, ARRAY['hội thảo', 'tiết kiệm năng lượng', 'công nghiệp']
      ),
      (
        'Khóa đào tạo Kỹ thuật viên HVAC nâng cao',
        'vvc-dao-tao-ky-thuat-vien-hvac',
        'Khóa đào tạo chuyên sâu dành cho kỹ thuật viên HVAC về vận hành and bảo trì hệ thống Chiller, VRV/VRF.',
        '<p>VVC tổ chức khóa đào tạo nâng cao dành cho kỹ thuật viên ngành HVAC with nội dung: Vận hành hệ thống Chiller, Bảo trì hệ thống VRV/VRF, Xử lý sự cố and tối ưu hóa hiệu suất. Giảng viên là các chuyên gia hàng đầu của VVC.</p>',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
        NOW() - INTERVAL '10 days',
        NOW() - INTERVAL '8 days',
        'Trụ sở VVC, 123 Nguyễn Văn Linh, Q.7, TP.HCM',
        'VVC Academy',
        'past',
        $2, 45, ARRAY['đào tạo', 'kỹ thuật viên', 'HVAC']
      )
    `, [exhibitionCat?.id, workshopCat?.id]);
    console.log('✅ Events inserted (3 rows)');

    // =============================================
    // FINAL VERIFICATION
    // =============================================
    console.log('\n=== FINAL VERIFICATION ===');
    const tables = ['products', 'news', 'projects', 'events', 'team_members', 'banners', 'categories'];
    for (const t of tables) {
      const res = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
      console.log(`  ${t}: ${res.rows[0].cnt} rows`);
    }

  } catch (err) {
    console.error('❌ Error:', err.message);
    console.error('Detail:', err.detail || '');
  } finally {
    client.release();
    pool.end();
  }
}

run();
