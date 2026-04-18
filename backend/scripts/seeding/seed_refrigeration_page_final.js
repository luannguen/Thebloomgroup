import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

const pageContent = {
  sections: [
    {
      id: 'hero',
      type: 'hero',
      props: { 
        title: 'HỆ THỐNG LẠNH CÔNG NGHIỆP', 
        description: 'Giải pháp tối ưu cho bảo quản thực phẩm, dược phẩm và nguyên liệu công nghiệp với công nghệ làm lạnh tiên tiến từ VVC.',
        alignment: 'center',
        image: 'industrial_refrigeration_hero_1775261841650.png'
      }
    },
    {
      id: 'intro',
      type: 'features',
      props: {
        title: 'GIẢI PHÁP TOÀN DIỆN',
        subtitle: 'VVC cung cấp dải sản phẩm và dịch vụ rộng lớn trong lĩnh vực kỹ thuật lạnh, đáp ứng mọi quy mô từ hộ kinh doanh đến nhà máy công nghiệp.',
        items: [
          { id: '1', title: 'Hiệu Suất Cao', description: 'Tiết kiệm điện năng tối đa với công nghệ Inverter.' },
          { id: '2', title: 'Độ Bền Vượt Trội', description: 'Linh kiện chính hãng từ Nhật Bản, Đức, Ý.' },
          { id: '3', title: 'Điều Khiển Thông Minh', description: 'Giám sát nhiệt độ và vận hành từ xa qua Internet.' }
        ]
      }
    },
    {
      id: 'tu-lanh',
      type: 'rich_text',
      props: {
        content: `
          <h2 style="color: #0c4a6e; font-size: 2.25rem; font-weight: bold; margin-bottom: 1.5rem;">HỆ THỐNG TỦ LẠNH CÔNG NGHIỆP</h2>
          <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; margin-bottom: 3rem;">
            <img src="industrial_refrigerator_display_1775261885220.png" alt="Tủ lạnh công nghiệp" style="width: 100%; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);" />
            <div>
              <p style="font-size: 1.125rem; line-height: 1.75; color: #4b5563; margin-bottom: 1rem;">
                Hệ thống tủ lạnh công nghiệp của VVC được thiết kế dành riêng cho các chuỗi siêu thị, nhà hàng và khách sạn lớn. Chúng tôi tập trung vào việc duy trì nhiệt độ ổn định tuyệt đối để đảm bảo độ tươi ngon của thực phẩm.
              </p>
              <ul style="list-style-type: disc; margin-left: 1.5rem; color: #4b5563; font-size: 1.125rem;">
                <li>Tủ trưng bày thực phẩm tươi sống với kính cường lực chống đọng sương.</li>
                <li>Tủ đông đứng mặt kính, tủ đông đảo cho siêu thị.</li>
                <li>Hệ thống máy nén trung tâm vận hành êm ái, độ ồn thấp.</li>
                <li>Thiết kế sang trọng, tối ưu hóa không gian trưng bày.</li>
              </ul>
            </div>
          </div>
        `
      }
    },
    {
      id: 'kho-lanh',
      type: 'rich_text',
      props: {
        content: `
          <h2 style="color: #0c4a6e; font-size: 2.25rem; font-weight: bold; margin-bottom: 1.5rem;">HỆ THỐNG KHO LẠNH CHUYÊN DỤNG</h2>
          <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; margin-bottom: 3rem;">
            <img src="cold_storage_warehouse_1775261855807.png" alt="Kho lạnh công nghiệp" style="width: 100%; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);" />
            <div>
              <p style="font-size: 1.125rem; line-height: 1.75; color: #4b5563; margin-bottom: 1rem;">
                VVC là chuyên gia hàng đầu trong việc xây dựng các kho lạnh quy mô lớn từ 10 đến 10.000 tấn. Chúng tôi áp dụng các tiêu chuẩn quốc tế trong cách nhiệt và vận hành máy móc.
              </p>
              <ul style="list-style-type: disc; margin-left: 1.5rem; color: #4b5563; font-size: 1.125rem;">
                <li>Kho bảo quản nông sản, trái cây xuất khẩu (nhiệt độ dương).</li>
                <li>Kho trữ đông thủy hải sản, thịt gia súc (nhiệt độ âm sâu -18°C đến -25°C).</li>
                <li>Kho lạnh dược phẩm đạt chuẩn GSP.</li>
                <li>Panel cách nhiệt PIR chống cháy, khóa camlock hiện đại.</li>
              </ul>
            </div>
          </div>
        `
      }
    },
    {
      id: 'cap-dong',
      type: 'rich_text',
      props: {
        content: `
          <h2 style="color: #0c4a6e; font-size: 2.25rem; font-weight: bold; margin-bottom: 1.5rem;">HỆ THỐNG CẤP ĐÔNG NHANH (IQF & AIR BLAST)</h2>
          <div style="display: flex; flex-direction: column; gap: 2rem; align-items: center; margin-bottom: 3rem;">
            <img src="flash_freezing_system_1775261870309.png" alt="Hệ thống cấp đông nhanh" style="width: 100%; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);" />
            <div>
              <p style="font-size: 1.125rem; line-height: 1.75; color: #4b5563; margin-bottom: 1rem;">
                Công nghệ cấp đông nhanh của VVC giúp giữ trọn vẹn giá trị dinh dưỡng và màu sắc tự nhiên của sản phẩm. Đây là yếu tố then chốt cho các doanh nghiệp xuất khẩu thực phẩm cao cấp.
              </p>
              <ul style="list-style-type: disc; margin-left: 1.5rem; color: #4b5563; font-size: 1.125rem;">
                <li>Hệ thống băng chuyền IQF cho tôm, cá, trái cây cắt miếng.</li>
                <li>Hầm đông gió (Air Blast Freezer) công suất lớn.</li>
                <li>Tốc độ hạ nhiệt cực nhanh, ngăn chặn sự hình thành tinh thể đá lớn.</li>
                <li>Sử dụng gas NH3 hoặc Freon tùy theo quy mô và yêu cầu kỹ thuật.</li>
              </ul>
            </div>
          </div>
        `
      }
    }
  ]
};

async function seed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB');
    
    // 1. Seed Static Page
    const pageQuery = `
      INSERT INTO public.static_pages (slug, title, content, is_active, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (slug) 
      DO UPDATE SET 
        content = EXCLUDED.content,
        title = EXCLUDED.title,
        updated_at = NOW();
    `;
    
    await client.query(pageQuery, ['he-thong-lanh', 'Hệ Thống Lạnh', JSON.stringify(pageContent), true]);
    console.log('Page "he-thong-lanh" seeded successfully.');

    // 2. Adjust existing navigation order to make space for "Hệ Thống Lạnh" at index 3
    await client.query('UPDATE public.navigation SET order_index = order_index + 1 WHERE position = \'header\' AND parent_id IS NULL AND order_index >= 3');
    
    // 3. Upsert Parent Menu
    const navQuery = `
      INSERT INTO public.navigation (label, path, position, type, order_index, is_active)
      VALUES ('HỆ THỐNG LẠNH', '/page/he-thong-lanh', 'header', 'internal', 3, true)
      ON CONFLICT (label) DO UPDATE SET 
        path = EXCLUDED.path,
        order_index = 3
      RETURNING id;
    `;
    
    // Note: Temporary hack - ensuring unique label for root items to simplify seeding
    const parentRes = await client.query(navQuery);
    const parentId = parentRes.rows[0].id;
    console.log('Parent navigation item created/updated with ID:', parentId);

    // 4. Upsert Child Menus
    const children = [
      { label: 'Hệ thống tủ lạnh', path: '/page/he-thong-lanh#tu-lanh', order: 0 },
      { label: 'Hệ thống kho lạnh', path: '/page/he-thong-lanh#kho-lanh', order: 1 },
      { label: 'Hệ thống cấp đông nhanh', path: '/page/he-thong-lanh#cap-dong', order: 2 }
    ];

    for (const child of children) {
      await client.query(`
        INSERT INTO public.navigation (label, path, parent_id, order_index, position, type, is_active)
        VALUES ($1, $2, $3, $4, 'header', 'internal', true)
        ON CONFLICT (label) WHERE parent_id IS NOT NULL DO UPDATE SET
          path = EXCLUDED.path,
          order_index = EXCLUDED.order_index;
      `, [child.label, child.path, parentId, child.order]);
    }
    
    console.log('Child navigation items seeded successfully.');
    console.log('Seeding successful!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.end();
  }
}

seed();
