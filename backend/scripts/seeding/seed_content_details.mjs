import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedContentDetails() {
  console.log('🔄 Bổ sung nội dung chi tiết cho Dự án & Sản phẩm...');

  // =====================================================================
  // 1. CẬP NHẬT NỘI DUNG CHI TIẾT CHO DỰ ÁN (content HTML)
  // =====================================================================

  const projectContentMap = {
    'du-an-logistics-mien-tay': `
      <div class="space-y-8">
        <h3>Tổng quan dự án</h3>
        <p>Dự án xây dựng trọn gói cụm kho lạnh trung tâm với tổng sức chứa 5.000 tấn hàng hóa, phục vụ mảng logistics chuỗi lạnh (Cold Chain) cho khu vực Đồng bằng sông Cửu Long. Hệ thống được thiết kế theo tiêu chuẩn quốc tế, đáp ứng yêu cầu bảo quản đa nhiệt độ.</p>

        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Thiết kế và thi công 8 kho lạnh với 3 dải nhiệt độ: +2°C đến +8°C (mát), -18°C đến -25°C (đông), -35°C đến -45°C (cấp đông nhanh).</li>
          <li>Lắp đặt hệ thống máy nén đa cấp (Cascade) với công suất tổng 500 HP.</li>
          <li>Thi công hệ thống Panel PU Cam-lock dày 150mm, đạt chuẩn chống cháy B2.</li>
          <li>Triển khai hệ thống giám sát nhiệt độ Cloud thời gian thực qua ứng dụng di động.</li>
        </ul>

        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">5.000</div>
            <div class="text-sm text-gray-600">Tấn sức chứa</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">35%</div>
            <div class="text-sm text-gray-600">Tiết kiệm điện năng</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">6</div>
            <div class="text-sm text-gray-600">Tháng thi công</div>
          </div>
        </div>

        <h3>Công nghệ áp dụng</h3>
        <p>Dự án ứng dụng thuật toán điều khiển thông minh (Learning Algorithm) để tự động tối ưu chu kỳ phá băng, giúp giảm 35% chi phí điện năng so với thiết kế truyền thống. Hệ thống quản lý kho thông minh WMS được tích hợp giúp vận hành trơn tru.</p>
      </div>
    `,
    'du-an-nha-may-thuy-san-tieu-chuan-eu': `
      <div class="space-y-8">
        <h3>Tổng quan dự án</h3>
        <p>Cung cấp giải pháp hệ thống cấp đông và bảo quản toàn diện cho nhà máy chế biến thủy hải sản quy mô lớn, đáp ứng tiêu chuẩn xuất khẩu EU/HACCP. Dự án bao gồm cả hệ thống IQF (Individual Quick Freezing) và kho bảo quản dài hạn.</p>

        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống cấp đông IQF công suất 5 tấn/giờ cho tôm và cá phi lê.</li>
          <li>Kho bảo quản -25°C với sức chứa 3.000 tấn.</li>
          <li>Hệ thống điều hòa khu vực sản xuất duy trì 18°C ± 1°C.</li>
          <li>Hệ thống ống công nghệ vi sinh (Sanitary Piping) bằng Inox 316L Food Grade.</li>
        </ul>

        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">5T/h</div>
            <div class="text-sm text-gray-600">Công suất IQF</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">EU</div>
            <div class="text-sm text-gray-600">Đạt chuẩn xuất khẩu</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">3.000</div>
            <div class="text-sm text-gray-600">Tấn kho bảo quản</div>
          </div>
        </div>

        <h3>Điểm nổi bật</h3>
        <p>Hệ thống IQF được thiết kế theo dạng băng chuyền (belt tunnel), đảm bảo sản phẩm đóng băng riêng lẻ, giữ nguyên hình dáng và chất lượng dinh dưỡng. Toàn bộ hệ thống được giám sát và ghi lại dữ liệu nhiệt độ liên tục 24/7 để phục vụ truy xuất nguồn gốc.</p>
      </div>
    `,
    'du-an-mep-phong-sach-dien-tu': `
      <div class="space-y-8">
        <h3>Tổng quan dự án</h3>
        <p>Triển khai hệ thống MEP (Cơ Điện) tổng thể và phòng sạch tiêu chuẩn ISO Class 5 cho nhà máy sản xuất linh kiện điện tử của nhà đầu tư FDI công nghệ cao. Dự án yêu cầu độ chính xác cao về nhiệt độ, độ ẩm và mật độ hạt bụi.</p>

        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống HVAC chính xác (Precision Cooling) duy trì 22°C ± 0.5°C, độ ẩm 45% ± 5%.</li>
          <li>Hệ thống xử lý không khí AHU với bộ lọc HEPA H14 (hiệu suất lọc 99.995%).</li>
          <li>Hệ thống điện hạ thế và UPS dự phòng đảm bảo vận hành liên tục.</li>
          <li>Hệ thống phòng cháy chữa cháy bằng khí FM200 cho khu vực nhạy cảm.</li>
        </ul>

        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">ISO 5</div>
            <div class="text-sm text-gray-600">Cấp sạch đạt được</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">±0.5°C</div>
            <div class="text-sm text-gray-600">Độ chính xác nhiệt</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">99.99%</div>
            <div class="text-sm text-gray-600">Uptime hệ thống</div>
          </div>
        </div>

        <h3>Công nghệ áp dụng</h3>
        <p>Hệ thống BMS (Building Management System) được tích hợp để giám sát và điều khiển tập trung toàn bộ hệ thống MEP, bao gồm HVAC, chiếu sáng, PCCC và an ninh. Giao diện điều khiển trực quan trên màn hình cảm ứng giúp vận hành viên quản lý hiệu quả.</p>
      </div>
    `,
    'du-an-kho-am-sau-60-do': `
      <div class="space-y-8">
        <h3>Tổng quan dự án</h3>
        <p>Thiết kế và lắp đặt hệ thống kho âm sâu -60°C sử dụng công nghệ máy nén đa cấp (Cascade System), phục vụ bảo quản dài hạn các loại thực phẩm cao cấp như sashimi cá ngừ đại dương và các sản phẩm thủy sản giá trị cao.</p>

        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống Cascade 2 cấp: CO2 (cấp thấp) kết hợp NH3 (cấp cao).</li>
          <li>Kho bảo quản -60°C với Panel dày 200mm, gioăng kép chống thất thoát nhiệt.</li>
          <li>Hệ thống sàn sưởi (Floor Heating) chống phồng rộp nền do nhiệt độ cực thấp.</li>
          <li>Hệ thống kiểm soát ra vào và airlock kép ngăn ngừng sốc nhiệt.</li>
        </ul>

        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">-60°C</div>
            <div class="text-sm text-gray-600">Nhiệt độ bảo quản</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">CO2</div>
            <div class="text-sm text-gray-600">Môi chất tự nhiên</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">24/7</div>
            <div class="text-sm text-gray-600">Giám sát liên tục</div>
          </div>
        </div>

        <h3>Điểm nổi bật</h3>
        <p>Công nghệ Cascade sử dụng môi chất tự nhiên CO2/NH3 giúp giảm thiểu tác động môi trường so với các hệ thống truyền thống sử dụng gas Freon. Hệ thống đạt chứng nhận an toàn thực phẩm và truy xuất nguồn gốc cho thị trường Nhật Bản.</p>
      </div>
    `,
    'du-an-nha-may-duoc-pham-gmp': `
      <div class="space-y-8">
        <h3>Tổng quan dự án</h3>
        <p>Triển khai hệ thống điều hòa chính xác và xử lý không khí cho nhà máy sản xuất dược phẩm đạt chuẩn GMP-WHO. Dự án yêu cầu kiểm soát nghiêm ngặt về nhiệt độ, độ ẩm, áp suất vi sai giữa các phòng và nồng độ hạt bụi.</p>

        <h3>Phạm vi công việc</h3>
        <ul>
          <li>Hệ thống AHU (Air Handling Unit) với bộ lọc Pre-filter, Medium filter và HEPA.</li>
          <li>Kiểm soát áp suất vi sai (Differential Pressure) giữa các khu vực: Hành lang > Sạch > Siêu sạch.</li>
          <li>Hệ thống BMS giám sát các thông số: nhiệt độ, độ ẩm, áp suất, particle count.</li>
          <li>Hệ thống nước tinh khiết (Purified Water) và nước cất (WFI).</li>
        </ul>

        <h3>Kết quả đạt được</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-blue-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-blue-600">GMP</div>
            <div class="text-sm text-gray-600">Đạt chứng nhận WHO</div>
          </div>
          <div class="bg-green-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-green-600">Class D</div>
            <div class="text-sm text-gray-600">Cấp sạch phòng sản xuất</div>
          </div>
          <div class="bg-amber-50 p-4 rounded-lg text-center">
            <div class="text-3xl font-bold text-amber-600">100%</div>
            <div class="text-sm text-gray-600">Đạt IQ/OQ/PQ</div>
          </div>
        </div>

        <h3>Công nghệ áp dụng</h3>
        <p>Hệ thống điều hòa sử dụng công nghệ biến tần (Inverter) kết hợp bộ gia nhiệt (Re-heater) để kiểm soát chính xác nhiệt độ và độ ẩm. Toàn bộ hệ thống được validation (IQ/OQ/PQ) theo quy trình chuẩn GMP trước khi bàn giao.</p>
      </div>
    `
  };

  // Update mỗi dự án với nội dung chi tiết
  for (const [slug, content] of Object.entries(projectContentMap)) {
    const { error } = await supabase
      .from('projects')
      .update({ content })
      .eq('slug', slug);
    
    if (error) {
      console.error(`❌ Lỗi cập nhật dự án ${slug}:`, error.message);
    } else {
      console.log(`✅ Đã cập nhật nội dung chi tiết: ${slug}`);
    }
  }

  // =====================================================================
  // 2. BỔ SUNG SẢN PHẨM MỚI
  // =====================================================================
  const { data: pCatData } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('type', 'product');
  
  if (!pCatData || pCatData.length === 0) {
    console.error('❌ Không tìm thấy danh mục sản phẩm');
    return;
  }
  const pCatMap = Object.fromEntries(pCatData.map(c => [c.slug, c.id]));

  const newProducts = [
    {
      name: 'Dàn ngưng giải nhiệt gió Evaporative Condenser',
      slug: 'dan-ngung-giai-nhiet-gio-evaporative',
      category_id: pCatMap['thiet-bi-lam-lanh'],
      description: 'Dàn ngưng kết hợp bay hơi nước, giảm công suất điện tiêu thụ so với dàn ngưng gió thông thường. Phù hợp cho các nhà máy quy mô lớn.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png',
      is_new: false,
      is_bestseller: true,
      features: ['Tiết kiệm 40% điện năng', 'Giảm tiếng ồn đáng kể', 'Bảo trì dễ dàng', 'Tuổi thọ trên 15 năm'],
      specifications: { 'Công suất tản nhiệt': '100 - 2.000 kW', 'Vỏ': 'Tôn mạ kẽm / Inox 304', 'Motor quạt': 'Tiết kiệm EC', 'Ứng dụng': 'Nhà máy, Kho lạnh lớn' }
    },
    {
      name: 'Panel PIR chống cháy chuẩn FM Global',
      slug: 'panel-pir-chong-chay-fm-global',
      category_id: pCatMap['tam-cach-nhiet-panel'],
      description: 'Tấm cách nhiệt Polyisocyanurate (PIR) đạt tiêu chuẩn chống cháy FM Global Approval cho các công trình bảo hiểm quốc tế yêu cầu.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png',
      is_new: true,
      is_bestseller: false,
      features: ['FM Global Approved', 'Chống cháy B1/B-s1,d0', 'Tỉ trọng 45kg/m3', 'Bề mặt Inox Food Grade'],
      specifications: { 'Độ dày': '50, 75, 100, 125, 150mm', 'Bề mặt': 'Inox 304BA / Tôn màu PVDF', 'Khóa': 'Cam-lock bước nối cam', 'Chứng nhận': 'FM, CE, ISO 9001' }
    },
    {
      name: 'Cửa kho khí quyển CA (Controlled Atmosphere)',
      slug: 'cua-kho-khi-quyen-ca',
      category_id: pCatMap['cua-kho-lanh'],
      description: 'Cửa chuyên dụng cho kho bảo quản khí quyển điều chỉnh (CA Storage), đảm bảo kín khí tuyệt đối để duy trì tỷ lệ O2/CO2.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png',
      is_new: true,
      is_bestseller: false,
      features: ['Kín khí tuyệt đối', 'Gioăng nén 3 lớp', 'Cửa sổ quan sát', 'Van cân áp tích hợp'],
      specifications: { 'Kích thước': 'Tùy chọn', 'Rò rỉ khí': '< 0.05 m3/h', 'Gioăng': 'EPDM chịu nhiệt', 'Áp dụng': 'Kho bảo quản trái cây, rau củ' }
    },
    {
      name: 'Van tiết lưu điện tử EEV - Tối ưu bằng AI',
      slug: 'van-tiet-luu-dien-tu-eev',
      category_id: pCatMap['phu-kien-vat-tu'],
      description: 'Van tiết lưu điện tử (Electronic Expansion Valve) được điều khiển bởi thuật toán AI, tự động tối ưu lưu lượng môi chất lạnh theo phụ tải thực tế.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png',
      is_new: true,
      is_bestseller: true,
      features: ['Điều khiển bằng AI', 'Phản ứng nhanh 0.5 giây', 'Tiết kiệm 15% năng lượng', 'Bảo vệ máy nén tối ưu'],
      specifications: { 'Dải công suất': '1 - 200 kW', 'Tín hiệu điều khiển': '4-20mA / PWM', 'Nhiệt độ vận hành': '-40°C đến +70°C', 'Môi chất': 'R404A, R507, R134a, NH3' }
    }
  ];

  const { error: prodError } = await supabase.from('products').upsert(newProducts, { onConflict: 'slug' });
  if (prodError) console.error('❌ Lỗi bổ sung sản phẩm:', prodError.message);
  else console.log('✅ Đã bổ sung sản phẩm mới.');

  // =====================================================================
  // 3. BỔ SUNG THÊM DỰ ÁN
  // =====================================================================
  const { data: prCatData } = await supabase
    .from('categories')
    .select('id, slug')
    .eq('type', 'project');
  
  if (!prCatData || prCatData.length === 0) {
    console.error('❌ Không tìm thấy danh mục dự án');
    return;
  }
  const prCatMap = Object.fromEntries(prCatData.map(c => [c.slug, c.id]));

  const newProjects = [
    {
      name: 'Chuỗi kho lạnh Mini cho Trung tâm Phân phối Bán lẻ',
      slug: 'du-an-kho-lanh-mini-ban-le',
      category_id: prCatMap['logistics-ban-le'],
      description: 'Triển khai hệ thống 12 kho lạnh mini (20-50m2) cho chuỗi trung tâm phân phối thực phẩm sạch, tối ưu không gian và chi phí vận hành.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png',
      client: 'Chuỗi bán lẻ Thực phẩm sạch',
      completion_date: '2023-08-15',
      is_featured: false,
      content: `
        <div class="space-y-6">
          <h3>Tổng quan</h3>
          <p>Thiết kế và lắp đặt hệ thống 12 kho lạnh mini cho chuỗi trung tâm phân phối thực phẩm sạch. Mỗi kho lạnh được tối ưu hóa cho không gian từ 20-50m2, phù hợp với mô hình bán lẻ hiện đại.</p>
          <h3>Điểm nổi bật</h3>
          <ul>
            <li>Thiết kế module hóa, lắp đặt nhanh trong 3-5 ngày/kho.</li>
            <li>Hệ thống điều khiển tập trung từ xa qua Cloud.</li>
            <li>Tiết kiệm 25% chi phí điện so với giải pháp truyền thống.</li>
          </ul>
        </div>
      `
    },
    {
      name: 'Hệ thống làm lạnh Nhà máy Nước giải khát - Dây chuyền tự động',
      slug: 'du-an-nha-may-nuoc-giai-khat',
      category_id: prCatMap['cong-nghiep-dien-tu'],
      description: 'Cung cấp hệ thống chiller làm mát nước cho dây chuyền sản xuất nước giải khát công suất 500.000 lít/ngày.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png',
      client: 'Tập đoàn FMCG hàng đầu',
      completion_date: '2024-05-10',
      is_featured: false,
      content: `
        <div class="space-y-6">
          <h3>Tổng quan</h3>
          <p>Thiết kế và lắp đặt hệ thống chiller công suất lớn (tổng 2.000 RT) để làm mát nước phục vụ dây chuyền sản xuất nước giải khát tự động công suất 500.000 lít/ngày.</p>
          <h3>Phạm vi</h3>
          <ul>
            <li>Hệ thống chiller screw giải nhiệt nước, công suất 2.000 RT.</li>
            <li>Hệ thống bơm nước lạnh và đường ống cách nhiệt.</li>
            <li>Tích hợp hệ thống BMS giám sát COP và năng lượng tiêu thụ.</li>
          </ul>
        </div>
      `
    }
  ];

  const { error: projError } = await supabase.from('projects').upsert(newProjects, { onConflict: 'slug' });
  if (projError) console.error('❌ Lỗi bổ sung dự án:', projError.message);
  else console.log('✅ Đã bổ sung dự án mới.');

  console.log('\n🎉 HOÀN TẤT: Nội dung chi tiết cho Dự án, Sản phẩm đã sẵn sàng!');
}

seedContentDetails();
