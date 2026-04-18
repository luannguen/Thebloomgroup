import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres';

const PAGE_SLUG = 'he-thong-dc-management';
const PAGE_TITLE = 'DC & Management System';

const dcContent = {
  sections: [
    {
      id: 'hero-dc',
      type: 'hero',
      props: {
        badge: 'Giải pháp Hạ tầng Thông minh',
        title: 'HỆ THỐNG TRUNG TÂM DỮ LIỆU & QUẢN LÝ',
        description: 'VietVinhCorp cung cấp giải pháp hạ tầng Data Center đạt chuẩn quốc tế, đảm bảo an toàn dữ liệu và hiệu suất vận hành 24/7 cho các hệ thống thông tin quan trọng.',
        buttonText: 'Nhận tư vấn giải pháp',
        buttonLink: '/contact',
        button2Text: 'Khám phá dự án',
        button2Link: '/projects',
        alignment: 'left',
        backgroundImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80'
      }
    },
    {
      id: 'solutions-title',
      type: 'rich_text',
      props: {
        content: '<h2 class="text-3xl font-bold text-primary text-center my-12">Giải Pháp DC & Management Tiêu Biểu</h2>',
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
              <h3 class="text-xl font-bold text-primary mb-4">Hệ thống UPS</h3>
              <p class="text-muted-foreground mb-4">Bộ lưu điện công suất lớn, đảm bảo nguồn điện sạch và liên tục cho các thiết bị quan trọng, ngăn ngừa rủi ro mất dữ liệu đột ngột.</p>
              <ul class="text-sm space-y-2">
                <li>✓ UPS Modular linh hoạt</li>
                <li>✓ Hệ thống ắc quy dự phòng</li>
                <li>✓ Giám sát nguồn điện 24/7</li>
              </ul>
            </div>
            <div class="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 class="text-xl font-bold text-primary mb-4">Lạnh chính xác</h3>
              <p class="text-muted-foreground mb-4">Giải pháp làm mát Precision Cooling kiểm soát độ ẩm và nhiệt độ chính xác cho phòng máy chủ, kéo dài tuổi thọ thiết bị phần cứng.</p>
              <ul class="text-sm space-y-2">
                <li>✓ Inrow Cooling hiệu suất cao</li>
                <li>✓ Kiểm soát độ ẩm thông minh</li>
                <li>✓ Tiết kiệm năng lượng chuẩn xanh</li>
              </ul>
            </div>
            <div class="p-6 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all">
              <h3 class="text-xl font-bold text-primary mb-4">Quản lý dữ liệu</h3>
              <p class="text-muted-foreground mb-4">Hệ thống DCIM giám sát hạ tầng và tối ưu hóa tài nguyên phần cứng, giúp ban quản trị ra quyết định dựa trên dữ liệu thực tế.</p>
              <ul class="text-sm space-y-2">
                <li>✓ Giám sát hạ tầng tập trung</li>
                <li>✓ Cảnh báo sự cố thời gian thực</li>
                <li>✓ Báo cáo hiệu năng tiêu thụ</li>
              </ul>
            </div>
          </div>
        `,
        padding: 'medium'
      }
    },
    {
      id: 'why-choose-dc',
      type: 'features',
      props: {
        title: 'Tại sao chọn giải pháp của chúng tôi?',
        subtitle: 'VietVinhCorp cam kết mang lại hạ tầng ổn định và khả năng mở rộng không giới hạn.',
        items: [
          { id: '1', title: 'Công nghệ Tiên tiến', description: 'Ứng dụng các giải pháp mới nhất từ Emerson, APC, Vertiv...', icon: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80' },
          { id: '2', title: 'Độ Tin cậy Cao', description: 'Đảm bảo uptime 99.99% cho mọi thiết bị trong trung tâm dữ liệu.', icon: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80' },
          { id: '3', title: 'Tối ưu Chi phí', description: 'Thiết kế hệ thống giúp giảm chỉ số PUE, tiết kiệm điện năng tối đa.', icon: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80' }
        ]
      }
    },
    {
      id: 'cta-dc',
      type: 'hero',
      props: {
        title: 'Sẵn sàng xây dựng Trung tâm dữ liệu của bạn?',
        description: 'Liên hệ với đội ngũ chuyên gia của chúng tôi để được khảo sát và tư vấn giải pháp hạ tầng tối ưu nhất.',
        buttonText: 'Yêu cầu khảo sát ngay',
        buttonLink: '/contact',
        alignment: 'center',
        padding: 'small'
      }
    }
  ]
};

async function syncDCPage() {
  const client = new Client({ connectionString });
  console.log(`🔄 Đang đồng bộ trang ${PAGE_SLUG} qua SQL...`);

  try {
    await client.connect();

    // Check if exists
    const checkRes = await client.query('SELECT id FROM static_pages WHERE slug = $1', [PAGE_SLUG]);

    if (checkRes.rows.length > 0) {
      await client.query(
        'UPDATE static_pages SET title = $1, content = $2, updated_at = NOW() WHERE slug = $3',
        [PAGE_TITLE, JSON.stringify(dcContent), PAGE_SLUG]
      );
      console.log('✅ Cập nhật trang thành công!');
    } else {
      await client.query(
        'INSERT INTO static_pages (slug, title, content, is_active) VALUES ($1, $2, $3, $4)',
        [PAGE_SLUG, PAGE_TITLE, JSON.stringify(dcContent), true]
      );
      console.log('✅ Tạo mới trang thành công!');
    }

    // Now update navigation menu
    // Check if already in navigation
    const navCheck = await client.query('SELECT id FROM navigation WHERE path = $1', [`/${PAGE_SLUG}`]);
    
    if (navCheck.rows.length === 0) {
      console.log('➕ Đang thêm vào Menu điều hướng...');
      // Reorder indexes 4 and above to make space at 4
      await client.query('UPDATE navigation SET order_index = order_index + 1 WHERE order_index >= 4 AND position = \'header\'');
      
      await client.query(
        'INSERT INTO navigation (label, path, position, order_index, is_active, type) VALUES ($1, $2, $3, $4, $5, $6)',
        ['Trung tâm dữ liệu', `/${PAGE_SLUG}`, 'header', 4, true, 'internal']
      );
      console.log('✅ Đã thêm vào Menu (vị trí 4)!');
    }

  } catch (err) {
    console.error('❌ Lỗi:', err.message);
  } finally {
    await client.end();
  }
}

syncDCPage();
