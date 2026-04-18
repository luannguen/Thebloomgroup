import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const updates = [
  {
    slug: 'tu-van-giai-phap',
    content: `
      <div class="space-y-6">
        <p class="text-lg">Với kinh nghiệm hơn 20 năm trong ngành điện lạnh công nghiệp, đội ngũ kỹ sư của VietVinhCorp sẵn sàng tư vấn giải pháp toàn diện cho mọi nhu cầu của quý khách hàng.</p>
        <h3>Các lĩnh vực tư vấn chuyên sâu:</h3>
        <ul>
          <li><strong>Kho lạnh bảo quản:</strong> Từ kho mát +2°C đến kho siêu đông -60°C, đáp ứng mọi yêu cầu bảo quản thực phẩm, dược phẩm.</li>
          <li><strong>Hệ thống HVAC:</strong> Điều hòa trung tâm cho tòa nhà thương mại, nhà máy, bệnh viện.</li>
          <li><strong>Phòng sạch (Cleanroom):</strong> Thiết kế phòng sạch ISO Class 5-8 cho công nghiệp điện tử, dược phẩm.</li>
          <li><strong>Hệ thống MEP:</strong> Giải pháp cơ điện tổng thể cho các dự án xây dựng.</li>
        </ul>
        <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-bold mb-2">Cam kết từ VietVinh:</h4>
          <p>Tư vấn miễn phí, khảo sát tận nơi trong vòng 24h. Đề xuất giải pháp tối ưu chi phí đầu tư và vận hành.</p>
        </div>
      </div>
    `
  },
  {
    slug: 'thiet-ke-kho-lanh',
    content: `
      <div class="space-y-6">
        <p class="text-lg">VietVinhCorp chuyên thiết kế hệ thống kho lạnh công nghiệp theo tiêu chuẩn quốc tế, sử dụng phần mềm mô phỏng 3D/BIM hiện đại.</p>
        <h3>Quy trình thiết kế:</h3>
        <ol class="list-decimal pl-6 space-y-3">
          <li><strong>Khảo sát hiện trường:</strong> Đánh giá mặt bằng, điều kiện khí hậu, nhu cầu bảo quản.</li>
          <li><strong>Tính toán phụ tải nhiệt:</strong> Xác định chính xác công suất lạnh cần thiết.</li>
          <li><strong>Thiết kế 3D:</strong> Xây dựng mô hình không gian giúp hình dung trực quan.</li>
          <li><strong>Lập dự toán chi tiết:</strong> Minh bạch từng hạng mục, vật tư, nhân công.</li>
          <li><strong>Bàn giao hồ sơ:</strong> Bản vẽ kỹ thuật, hồ sơ P&ID, hướng dẫn vận hành.</li>
        </ol>
        <h3>Loại kho lạnh chúng tôi thiết kế:</h3>
        <ul class="grid md:grid-cols-2 gap-3 list-none p-0">
          <li class="bg-white p-4 shadow-sm rounded border">🧊 Kho mát +2°C đến +8°C</li>
          <li class="bg-white p-4 shadow-sm rounded border">❄️ Kho đông -18°C đến -25°C</li>
          <li class="bg-white p-4 shadow-sm rounded border">🌬️ Kho cấp đông nhanh -35°C</li>
          <li class="bg-white p-4 shadow-sm rounded border">🔬 Kho khí quyển CA</li>
        </ul>
      </div>
    `
  },
  {
    slug: 'lap-dat-dieu-hoa-trung-tam',
    content: `
      <div class="space-y-6">
        <p class="text-lg">Lắp đặt hệ thống điều hòa trung tâm cho mọi quy mô công trình: từ văn phòng, trường học đến trung tâm thương mại và nhà máy công nghiệp.</p>
        <h3>Các hệ thống chúng tôi triển khai:</h3>
        <ul>
          <li><strong>VRV/VRF:</strong> Hệ thống biến tần tiết kiệm điện, linh hoạt cho tòa nhà nhiều tầng.</li>
          <li><strong>Chiller (Water Cooled / Air Cooled):</strong> Hệ thống giải nhiệt nước/gió cho nhà máy và tòa nhà lớn.</li>
          <li><strong>AHU (Air Handling Unit):</strong> Xử lý không khí chuyên dụng cho phòng sạch, bệnh viện.</li>
          <li><strong>FCU (Fan Coil Unit):</strong> Giải pháp điều hòa cục bộ linh hoạt.</li>
        </ul>
        <h3>Cam kết chất lượng:</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-blue-600">ISO 9001</div>
            <div class="text-sm text-gray-600">Quy trình chuẩn</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-green-600">24 tháng</div>
            <div class="text-sm text-gray-600">Bảo hành thiết bị</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-2xl font-bold text-amber-600">An toàn</div>
            <div class="text-sm text-gray-600">Thi công 5S</div>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'bao-tri-dinh-ky',
    content: `
      <div class="space-y-6">
        <p class="text-lg">Dịch vụ bảo trì định kỳ giúp kéo dài tuổi thọ thiết bị, duy trì hiệu suất tối ưu và phát hiện sớm các sự cố tiềm ẩn trước khi chúng trở thành vấn đề nghiêm trọng.</p>
        <h3>Danh mục kiểm tra định kỳ:</h3>
        <ul>
          <li>Kiểm tra áp suất gas, bổ sung môi chất nếu cần.</li>
          <li>Vệ sinh dàn ngưng, dàn lạnh bằng hóa chất chuyên dụng.</li>
          <li>Kiểm tra và siết lại các đầu nối điện.</li>
          <li>Đo dòng điện, điện áp motor quạt và máy nén.</li>
          <li>Kiểm tra hệ thống điều khiển, cảm biến nhiệt.</li>
          <li>Vệ sinh bộ lọc gió, kiểm tra đường ống thoát nước ngưng.</li>
        </ul>
        <h3>Gói bảo trì linh hoạt:</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-5 shadow-sm rounded-lg border">
            <h4 class="font-bold text-blue-600 mb-2">Gói Cơ bản</h4>
            <p class="text-sm text-gray-600">Kiểm tra 2 lần/năm. Phù hợp hệ thống nhỏ, văn phòng.</p>
          </div>
          <div class="bg-white p-5 shadow-sm rounded-lg border border-blue-200">
            <h4 class="font-bold text-blue-600 mb-2">Gói Toàn diện</h4>
            <p class="text-sm text-gray-600">Kiểm tra 4 lần/năm + Hotline ưu tiên. Phù hợp nhà máy, kho lạnh.</p>
          </div>
        </div>
      </div>
    `
  },
  {
    slug: 'sua-chua-khan-cap',
    content: `
      <div class="space-y-6">
        <p class="text-lg">Khi hệ thống lạnh gặp sự cố, mỗi phút chậm trễ đều có thể gây thiệt hại lớn cho hàng hóa. VietVinhCorp cam kết phản ứng nhanh nhất có thể.</p>
        <h3>Cam kết thời gian phản hồi:</h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-red-50 p-5 rounded-lg border-l-4 border-red-500">
            <h4 class="font-bold text-red-700">Nội thành TP.HCM</h4>
            <p class="text-2xl font-bold text-red-600">2 giờ</p>
            <p class="text-sm text-gray-600">Kỹ thuật viên có mặt</p>
          </div>
          <div class="bg-amber-50 p-5 rounded-lg border-l-4 border-amber-500">
            <h4 class="font-bold text-amber-700">Khu vực lân cận</h4>
            <p class="text-2xl font-bold text-amber-600">4-12 giờ</p>
            <p class="text-sm text-gray-600">Tùy khoảng cách</p>
          </div>
        </div>
        <h3>Dịch vụ sửa chữa bao gồm:</h3>
        <ul>
          <li>Chẩn đoán và xử lý lỗi máy nén (quá tải, kẹt, cháy cuộn dây).</li>
          <li>Sửa chữa rò rỉ gas, hàn ống đồng/inox.</li>
          <li>Thay thế linh kiện: van tiết lưu, cảm biến, relay.</li>
          <li>Sửa chữa tủ điện điều khiển, PLC, biến tần.</li>
          <li>Xử lý sự cố Panel bị thấm, gioăng cửa bị hỏng.</li>
        </ul>
        <div class="bg-blue-50 p-6 rounded-lg">
          <p class="font-bold">📞 Hotline sửa chữa khẩn cấp: Liên hệ 24/7 qua số điện thoại trên website.</p>
        </div>
      </div>
    `
  }
];

async function updateEmptyServices() {
  console.log('🔄 Bổ sung nội dung cho 5 dịch vụ còn trống...');
  for (const u of updates) {
    const { error } = await supabase
      .from('services')
      .update({ content: u.content })
      .eq('slug', u.slug);
    if (error) console.error('❌', u.slug, error.message);
    else console.log('✅', u.slug);
  }
  console.log('🎉 Hoàn tất!');
}

updateEmptyServices();
