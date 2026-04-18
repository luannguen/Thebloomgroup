import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres';

const PAGE_SLUG = 'he-thong-tich-hop';
const PAGE_TITLE = 'Giải Pháp Hệ Thống Tích Hợp';

const integratedContent = {
  sections: [
    {
      id: 'hero-integrated',
      type: 'hero',
      props: {
        badge: 'Hội tụ & Kết nối Công nghệ',
        title: 'GIẢI PHÁP HỆ THỐNG TÍCH HỢP (ELV & AUTOMATION)',
        description: 'VietVinhCorp tối ưu hóa vận hành công trình thông qua việc tích hợp các hệ thống điện nhẹ, tự động hóa và quản lý tập trung, mang lại sự thông minh và tiết kiệm năng lượng vượt trội.',
        buttonText: 'Tư vấn tích hợp',
        buttonLink: '/contact',
        button2Text: 'Giải pháp kỹ thuật',
        button2Link: '/services',
        alignment: 'left',
        backgroundImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80'
      }
    },
    {
      id: 'solutions-title',
      type: 'rich_text',
      props: {
        content: '<h2 class="text-3xl font-bold text-primary text-center my-12">Hệ Thống Tích Hợp Tiêu Biểu</h2>',
        padding: 'small'
      }
    },
    {
      id: 'solutions-grid',
      type: 'rich_text',
      props: {
        content: `
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 class="text-xl font-bold text-primary mb-4">Hệ thống ELV</h3>
              <p class="text-muted-foreground mb-4">Tích hợp Camera, CCTV, Âm thanh thông báo, và Kiểm soát ra vào trên một nền tảng quản lý duy nhất, đảm bảo tính bảo mật và dễ dàng điều hành.</p>
              <ul class="text-sm space-y-2">
                <li>✓ Camera giám sát IP thông minh</li>
                <li>✓ Kiểm soát vào ra sinh trắc học</li>
                <li>✓ Âm thanh thông báo đa vùng</li>
              </ul>
            </div>
            <div class="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 class="text-xl font-bold text-primary mb-4">SCADA & Automation</h3>
              <p class="text-muted-foreground mb-4">Giải pháp điều khiển giám sát và thu thập dữ liệu cho các dây chuyền công nghịêp, quản lý lưu lượng và thông số vận hành theo thời gian thực.</p>
              <ul class="text-sm space-y-2">
                <li>✓ Hệ thống PLC linh hoạt</li>
                <li>✓ Giao diện HMI trực quan</li>
                <li>✓ Phân tích dữ liệu vận hành</li>
              </ul>
            </div>
            <div class="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 class="text-xl font-bold text-primary mb-4">BMS / iBMS</h3>
              <p class="text-muted-foreground mb-4">Hệ thống quản lý tòa nhà thông minh, điều phối linh hoạt các hệ thống Điều hòa, Chiếu sáng và An ninh để tối ưu hóa năng lượng tiêu thụ.</p>
              <ul class="text-sm space-y-2">
                <li>✓ Tiết kiệm đến 30% năng lượng</li>
                <li>✓ Điều khiển tập trung Web-based</li>
                <li>✓ Kết nối đa giao thức (BACnet, Modbus)</li>
              </ul>
            </div>
          </div>
        `,
        padding: 'medium'
      }
    },
    {
      id: 'why-choose-integrated',
      type: 'features',
      props: {
        title: 'Sự Khác Biệt Của VietVinhCorp',
        subtitle: 'Chúng tôi mang lại giải pháp tích hợp chìa khóa trao tay với quy mô từ tòa nhà đến khu công nghiệp.',
        items: [
          { id: '1', title: 'Tương Thích Đa Nền Tảng', description: 'Tích hợp mượt mà các thiết bị từ nhiều nhà sản xuất khác nhau.', icon: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' },
          { id: '2', title: 'Khả năng Mở rộng', description: 'Hệ thống thiết kế theo module dễ dàng nâng cấp trong tương lai.', icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' },
          { id: '3', title: 'Đội ngũ Chuyên gia', description: 'Kỹ sư dày dặn kinh nghiệm triển khai các dự án quy mô lớn.', icon: 'https://images.unsplash.com/photo-1426927308491-6380b6a9936f?auto=format&fit=crop&q=80' }
        ]
      }
    },
    {
      id: 'cta-integrated',
      type: 'hero',
      props: {
        title: 'Bạn cần một giải pháp vận hành thông minh và hiệu quả?',
        description: 'Liên hệ với đội ngũ chuyên gia của chúng tôi để được khảo sát và tư vấn giải pháp tích hợp tối ưu nhất.',
        buttonText: 'Liên hệ chuyên gia ngay',
        buttonLink: '/contact',
        alignment: 'center',
        padding: 'small'
      }
    }
  ]
};

async function syncIntegratedPage() {
  const client = new Client({ connectionString });
  console.log(`🔄 Đang đồng bộ trang ${PAGE_SLUG} qua SQL...`);

  try {
    await client.connect();

    // Check if exists
    const checkRes = await client.query('SELECT id FROM static_pages WHERE slug = $1', [PAGE_SLUG]);

    if (checkRes.rows.length > 0) {
      await client.query(
        'UPDATE static_pages SET title = $1, content = $2, updated_at = NOW() WHERE slug = $3',
        [PAGE_TITLE, JSON.stringify(integratedContent), PAGE_SLUG]
      );
      console.log('✅ Cập nhật trang thành công!');
    } else {
      await client.query(
        'INSERT INTO static_pages (slug, title, content, is_active) VALUES ($1, $2, $3, $4)',
        [PAGE_SLUG, PAGE_TITLE, JSON.stringify(integratedContent), true]
      );
      console.log('✅ Tạo mới trang thành công!');
    }

    // Now update navigation menu
    // Check if already in navigation
    const navCheck = await client.query('SELECT id FROM navigation WHERE path = $1', [`/${PAGE_SLUG}`]);
    
    if (navCheck.rows.length === 0) {
      console.log('➕ Đang thêm vào Menu điều hướng...');
      // Make space at order_index 5
      await client.query('UPDATE navigation SET order_index = order_index + 1 WHERE order_index >= 5 AND position = \'header\'');
      
      await client.query(
        'INSERT INTO navigation (label, path, position, order_index, is_active, type) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Hệ thống tích hợp', `/${PAGE_SLUG}`, 'header', 5, true, 'internal']
      );
      console.log('✅ Đã thêm vào Menu (vị trí 5)!');
    } else {
      console.log('ℹ️ Trang đã tồn tại trong Menu.');
    }

    // Ensure "Khám phá" is at 6 and "Liên hệ" is at 7
    await client.query("UPDATE navigation SET order_index = 6 WHERE label = 'Khám phá' AND position = 'header'");
    await client.query("UPDATE navigation SET order_index = 7 WHERE label = 'Liên hệ' AND position = 'header'");
    console.log('✅ Đã cập nhập thứ tự menu Khám phá và Liên hệ.');

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

syncIntegratedPage();
