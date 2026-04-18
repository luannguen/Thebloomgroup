// 10_sync_me_to_visual_editor.mjs
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

const pageContent = {
  sections: [
    {
      id: 'hero',
      type: 'hero',
      props: { 
        badge: 'Kỹ Thuật Cơ Điện Vượt Trội',
        title: 'HỆ THỐNG CƠ ĐIỆN (M&E) TOÀN DIỆN', 
        description: 'VietVinhCorp tự hào là đối tác tin cậy trong việc cung cấp giải pháp M&E tổng thể, từ tư vấn thiết kế, thi công đến vận hành và bảo trì trọn gói. Chúng tôi cam kết đưa công nghệ xanh, tiết kiệm năng lượng và tính ổn định tuyệt đối vào mọi công trình.',
        alignment: 'left',
        backgroundImage: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80',
        buttonText: 'Tư vấn giải pháp',
        buttonLink: '/contact',
        button2Text: 'Năng lực thi công',
        button2Link: '/about-us'
      }
    },
    {
      id: 'systems-title',
      type: 'rich_text',
      props: {
        content: `
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-[#0c4a6e] mb-4">Giải Pháp Hệ Thống Cốt Lõi</h2>
            <div class="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            <p class="text-gray-500 mt-4 max-w-2xl mx-auto">VietVinhCorp làm chủ toàn bộ các công nghệ cơ điện hiện đại nhất để phục vụ đa dạng nhu cầu từ dân dụng đến công nghiệp nặng.</p>
          </div>
        `
      }
    },
    {
      id: 'systems-grid',
      type: 'rich_text',
      props: {
        content: `
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <!-- Electrical -->
            <div class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-blue-100 transition-colors"></div>
              <h3 class="text-xl font-bold text-[#0c4a6e] mb-4 relative">HỆ THỐNG ĐIỆN</h3>
              <p class="text-gray-600 mb-6 text-sm relative">Giải pháp nguồn điện ổn định cho trạm biến áp, tủ trung thế, hạ thế MSB và hệ thống chiếu sáng thông minh.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li>• Trạm biến áp & Tủ điện MSB/DB</li>
                <li>• Hệ thống nguồn dự phòng (Generator/UPS)</li>
                <li>• Chống sét & Tiếp địa chuyên dụng</li>
              </ul>
            </div>

            <!-- Clean Room -->
            <div class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-green-100 transition-colors"></div>
              <h3 class="text-xl font-bold text-[#0c4a6e] mb-4 relative">HỆ THỐNG PHÒNG SẠCH</h3>
              <p class="text-gray-600 mb-6 text-sm relative">Kiểm soát hạt bụi, áp suất và nhiệt độ đạt chuẩn ISO, GMP cho dược phẩm, y tế và nhà máy linh kiện điện tử.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li>• Thi công Panel EPS/PU/Rockwool</li>
                <li>• Hệ thống lọc bụi HEPA/ULPA tiêu chuẩn</li>
                <li>• Sàn Vinyl chống tĩnh điện & Kháng khuẩn</li>
              </ul>
            </div>

            <!-- Process Piping -->
            <div class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-cyan-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-cyan-100 transition-colors"></div>
              <h3 class="text-xl font-bold text-[#0c4a6e] mb-4 relative">HỆ THỐNG ỐNG CÔNG NGHỆ</h3>
              <p class="text-gray-600 mb-6 text-sm relative">Thi công đường ống vi sinh cho thực phẩm, hóa chất, lò hơi và hệ thống máy nén khí cho sản xuất công nghiệp.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li>• Đường ống Inox vi sinh (Sanitary Piping)</li>
                <li>• Hệ thống lò hơi (Steam) & Nước nóng</li>
                <li>• Đường ống khí nén (Air Compressor)</li>
              </ul>
            </div>

            <!-- HVAC -->
            <div class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-yellow-100 transition-colors"></div>
              <h3 class="text-xl font-bold text-[#0c4a6e] mb-4 relative">HỆ THỐNG HVAC</h3>
              <p class="text-gray-600 mb-6 text-sm relative">Điều hòa trung tâm Chiller/VRV kết hợp hệ thống thông gió khử mùi, cấp khí tươi tối ưu khí hậu nhà xưởng.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li>• Hệ thống HVAC Chiller & Tháp giải nhiệt</li>
                <li>• Điều hòa VRV/VRF biến tần tiết kiệm điện</li>
                <li>• Thông gió hút khí thải (Exhaust Fan)</li>
              </ul>
            </div>

            <!-- BMS -->
            <div class="group p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 group-hover:bg-indigo-100 transition-colors"></div>
              <h3 class="text-xl font-bold text-[#0c4a6e] mb-4 relative">HỆ THỐNG QUẢN LÝ TÒA NHÀ</h3>
              <p class="text-gray-600 mb-6 text-sm relative">Tự động hóa toàn bộ công trình (BMS/iBMS) cho phép giám sát tập trung và điều khiển thông minh các hệ thống kỹ thuật.</p>
              <ul class="space-y-2 text-sm text-gray-500">
                <li>• Điều khiển chiếu sáng & HVAC tập trung</li>
                <li>• Giám sát tiêu thụ năng lượng thông minh</li>
                <li>• Tích hợp hệ thống báo cháy & An ninh</li>
              </ul>
            </div>
          </div>
        `
      }
    },
    {
      id: 'deployment-process',
      type: 'rich_text',
      props: {
        content: `
          <div class="bg-gray-50 py-16 -mx-8 px-8 rounded-[3rem]">
            <div class="text-center mb-12">
              <h2 class="text-3xl font-bold text-[#0c4a6e]">Quy Trình Triển Khai 5 Bước</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div class="text-center">
                <div class="w-12 h-12 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">01</div>
                <h4 class="font-bold mb-2">Khảo sát</h4>
                <p class="text-xs text-gray-500">Tư vấn và khảo sát hiện trạng dự án</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">02</div>
                <h4 class="font-bold mb-2">Thiết kế</h4>
                <p class="text-xs text-gray-500">Thiết kế bản vẽ Shopdrawing & Bóc tách</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">03</div>
                <h4 class="font-bold mb-2">Cung ứng</h4>
                <p class="text-xs text-gray-500">Mua sắm vật tư thiết bị đạt chuẩn</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">04</div>
                <h4 class="font-bold mb-2">Thi công</h4>
                <p class="text-xs text-gray-500">Lắp đặt và giám sát chất lượng</p>
              </div>
              <div class="text-center">
                <div class="w-12 h-12 bg-[#0c4a6e] text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">05</div>
                <h4 class="font-bold mb-2">Bàn giao</h4>
                <p class="text-xs text-gray-500">Vận hành thử nghiệm và bàn giao</p>
              </div>
            </div>
          </div>
        `
      }
    },
    {
      id: 'technical-standards',
      type: 'rich_text',
      props: {
        content: `
          <div class="py-12 border-t border-gray-100 mt-12">
            <h3 class="text-2xl font-bold text-[#0c4a6e] text-center mb-8">Tiêu Chuẩn Kỹ Thuật Áp Dụng</h3>
            <div class="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
              <div class="flex items-center gap-2">
                <span class="font-bold border-2 border-[#0c4a6e] px-2 py-1 rounded">ASME</span>
                <span class="text-xs">Piping & Vessels</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold border-2 border-[#0c4a6e] px-2 py-1 rounded">ASHRAE</span>
                <span class="text-xs">HVAC standards</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold border-2 border-[#0c4a6e] px-2 py-1 rounded">IEC</span>
                <span class="text-xs">Electrical Safety</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-bold border-2 border-[#0c4a6e] px-2 py-1 rounded">GMP</span>
                <span class="text-xs">Clean Room Standard</span>
              </div>
            </div>
          </div>
        `
      }
    },
    {
      id: 'cta',
      type: 'hero',
      props: {
        title: 'Bạn đang tìm kiếm giải pháp M&E chuyên nghiệp?',
        description: 'VietVinhCorp sở hữu hơn 10 năm kinh nghiệm trong lĩnh vực Cơ điện và Lạnh công nghiệp. Liên hệ ngay để nhận giải pháp kỹ thuật tối ưu nhất.',
        alignment: 'center',
        buttonText: 'Gửi yêu cầu báo giá',
        buttonLink: '/contact',
        button2Text: 'Hotline: 028 3833 3333',
        button2Link: 'tel:02838333333'
      }
    }
  ]
};

async function seed() {
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('🔄 Đang đồng bộ trang he-thong-co-dien...');
    
    const query = `
      INSERT INTO public.static_pages (slug, title, content, is_active)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) 
      DO UPDATE SET 
        content = EXCLUDED.content,
        title = EXCLUDED.title,
        updated_at = NOW();
    `;
    
    await client.query(query, ['he-thong-co-dien', 'Hệ Thống Cơ Điện (M&E)', JSON.stringify(pageContent), true]);
    console.log('✅ Đồng bộ thành công!');
  } catch (err) {
    console.error('❌ Thất bại:', err.message);
  } finally {
    await client.end();
  }
}

seed();
