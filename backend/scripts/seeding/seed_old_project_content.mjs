import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const updates = [
  {
    slug: 'vvc-aeon-mall-ha-dong',
    content: `
      <div class="space-y-6">
        <h3>Tổng quan dự án</h3>
        <p>Triển khai hệ thống VRV/VRF toàn diện cho trung tâm thương mại quốc tế quy mô 50.000m2. Hệ thống bao gồm 120 dàn nóng và hơn 500 dàn lạnh, phục vụ đa dạng không gian từ khu mua sắm, rạp chiếu phim đến khu ẩm thực.</p>
        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Thiết kế hệ thống VRV/VRF đa tầng cho toàn bộ tòa nhà 5 tầng + 2 tầng hầm.</li>
          <li>Lắp đặt hệ thống thông gió tươi (Fresh Air) và hệ thống hút khói tầng hầm.</li>
          <li>Tích hợp BMS giám sát năng lượng và điều khiển tập trung từ phòng kỹ thuật.</li>
          <li>Hệ thống quạt tăng áp cầu thang bộ theo tiêu chuẩn PCCC.</li>
        </ul>
        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">50.000</div>
            <div class="text-sm text-gray-600">m2 diện tích phục vụ</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">500+</div>
            <div class="text-sm text-gray-600">Dàn lạnh lắp đặt</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">8</div>
            <div class="text-sm text-gray-600">Tháng thi công</div>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'vvc-samsung-hcmc-hvac',
    content: `
      <div class="space-y-6">
        <h3>Tổng quan dự án</h3>
        <p>Lắp đặt hệ thống điều hòa chính xác cho nhà máy sản xuất điện tử công nghệ cao, yêu cầu kiểm soát nhiệt độ ±0.5°C và độ ẩm ±3% trong toàn bộ khu vực sản xuất.</p>
        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống Chiller giải nhiệt nước công suất 1.500 RT.</li>
          <li>AHU với bộ lọc HEPA H13 cho khu vực phòng sạch ISO Class 7.</li>
          <li>Hệ thống ống gió cách âm và chống rung cho khu văn phòng.</li>
          <li>Hệ thống điện và UPS dự phòng cho các thiết bị quan trọng.</li>
        </ul>
        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">1.500 RT</div>
            <div class="text-sm text-gray-600">Công suất Chiller</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">ISO 7</div>
            <div class="text-sm text-gray-600">Cấp sạch đạt được</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">±0.5°C</div>
            <div class="text-sm text-gray-600">Độ chính xác nhiệt</div>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'vvc-vissan-cold-storage',
    content: `
      <div class="space-y-6">
        <h3>Tổng quan dự án</h3>
        <p>Thiết kế và thi công kho lạnh bảo quản 2.000 tấn cho nhà máy chế biến thực phẩm. Hệ thống sử dụng máy nén Screw hiệu suất cao và Panel PU 150mm đạt tiêu chuẩn vệ sinh an toàn thực phẩm.</p>
        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Kho mát +2°C đến +8°C với sức chứa 1.000 tấn.</li>
          <li>Kho đông -25°C với sức chứa 1.000 tấn.</li>
          <li>Hệ thống giám sát nhiệt độ CloudBased 24/7.</li>
          <li>Panel PU 150mm với khóa Cam-lock và bề mặt Inox Food Grade.</li>
        </ul>
        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">2.000</div>
            <div class="text-sm text-gray-600">Tấn sức chứa</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">HACCP</div>
            <div class="text-sm text-gray-600">Đạt tiêu chuẩn</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">30%</div>
            <div class="text-sm text-gray-600">Tiết kiệm điện</div>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'vvc-vinmec-hospital',
    content: `
      <div class="space-y-6">
        <h3>Tổng quan dự án</h3>
        <p>Triển khai hệ thống HVAC chuyên dụng cho bệnh viện đa khoa quốc tế, bao gồm hệ thống điều hòa phòng mổ (áp suất dương), phòng cách ly (áp suất âm) và hệ thống xử lý không khí tươi.</p>
        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống AHU với bộ lọc HEPA cho 12 phòng mổ tiêu chuẩn.</li>
          <li>Hệ thống Chiller 800 RT phục vụ toàn bệnh viện 500 giường.</li>
          <li>Hệ thống khí y tế (O2, N2O, Vacuum, Air compressor).</li>
          <li>Hệ thống xử lý nước thải y tế theo tiêu chuẩn TCVN.</li>
        </ul>
        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">800 RT</div>
            <div class="text-sm text-gray-600">Công suất Chiller</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">12</div>
            <div class="text-sm text-gray-600">Phòng mổ HEPA</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">500</div>
            <div class="text-sm text-gray-600">Giường bệnh</div>
          </div>
        </div>
      </div>
    `
  }
];

async function updateOldProjects() {
  console.log('🔄 Bổ sung nội dung chi tiết cho dự án cũ...');
  for (const u of updates) {
    const { error } = await supabase
      .from('projects')
      .update({ content: u.content })
      .eq('slug', u.slug);
    if (error) console.error('❌', u.slug, error.message);
    else console.log('✅', u.slug);
  }
  console.log('🎉 Hoàn tất!');
}

updateOldProjects();
