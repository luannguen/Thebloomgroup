import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedFinalData() {
  console.log('🔄 Đang đồng bộ hóa dữ liệu toàn diện (Dịch vụ, Sản phẩm, Dự án)...');

  // 1. DỊCH VỤ (SERVICES)
  const serviceCats = [
    { name: 'Kỹ thuật & Giải pháp', slug: 'ky-thuat-giai-phap', display_order: 1, is_active: true }
  ];

  const { data: sCatData } = await supabase.from('service_categories').upsert(serviceCats, { onConflict: 'slug' }).select();
  const sCatId = sCatData[0].id;

  const services = [
    {
      title: 'Tư vấn & Thiết kế Hệ thống Nhiệt - Điện lạnh',
      slug: 'tu-van-thiet-ke-he-thong-nhiet',
      category_id: sCatId,
      description: 'Giải pháp thiết kế "may đo" dựa trên công nghệ mô phỏng nhiệt độ thực tế, tối ưu hóa PUE và chi phí vận hành.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/serv_design.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p class="text-lg">Tại VietVinhCorp, chúng tôi không chỉ vẽ bản vẽ, chúng tôi kiến tạo các giải pháp năng lượng bền vững. Quy trình tư vấn thiết kế của chúng tôi dựa trên 20 năm kinh nghiệm và các công cụ mô phỏng hiện đại nhất.</p>
          
          <h3 class="text-2xl font-bold text-primary">Quy trình 5 bước tiêu chuẩn:</h3>
          <ol class="list-decimal pl-6 space-y-4">
            <li><strong>Khảo sát & Phân tích (Site Audit):</strong> Đánh giá nhu cầu thực tế, điều kiện khí hậu và đặc tính sản phẩm cần bảo quản.</li>
            <li><strong>Tính toán phụ tải nhiệt & Mô phỏng:</strong> Sử dụng phần mềm chuyên dụng để tính toán chính xác công suất cần thiết, tránh lãng phí.</li>
            <li><strong>Thiết kế giải pháp tối ưu (BIM/3D):</strong> Xây dựng mô hình 3D giúp khách hàng hình dung trực quan và tối ưu hóa không gian lắp đặt.</li>
            <li><strong>Lập dự toán & Lộ trình tiết kiệm điện:</strong> Đề xuất các thuật toán điều khiển giúp giảm tới 71% chi phí điện năng.</li>
            <li><strong>Bàn giao Hồ sơ kỹ thuật:</strong> Cung cấp bộ hồ sơ đầy đủ, sẵn sàng cho giai đoạn thi công.</li>
          </ol>

          <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 class="font-bold mb-2">Điểm khác biệt của VietVinh:</h4>
            <ul class="list-disc pl-5">
              <li>Ứng dụng thuật toán AI trong việc quản lý chu kỳ phá băng.</li>
              <li>Thiết kế tích hợp năng lượng tái tạo (Solar Cold Storage).</li>
              <li>Tối ưu hóa luân chuyển khí động học trong kho.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: 'Thi công & Lắp đặt Kho lạnh chuyên sâu',
      slug: 'thi-cong-lap-dat-kho-lanh',
      category_id: sCatId,
      description: 'Đội ngũ kỹ sư tinh nhuệ, thi công mọi địa hình từ kho cấp đông siêu tốc -60°C đến hệ thống kho khí quyển CA.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p>VietVinh sở hữu đội ngũ kỹ thuật viên giàu kinh nghiệm, đã thực hiện hàng trăm dự án trọng điểm trên toàn quốc. Chúng tôi cam kết tiến độ và chất lượng thi công đạt chuẩn quốc tế.</p>
          
          <h3 class="text-2xl font-bold text-primary">Năng lực thực hiện:</h3>
          <ul class="grid md:grid-cols-2 gap-4 list-none p-0">
            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho đông sâu tới -60°C (Deep Freezing)</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho khí quyển CA (Controlled Atmosphere)</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Hệ thống HVAC cho phòng sạch Dược phẩm</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Lắp đặt hệ ống công nghệ vi sinh (Inox Food Grade)</li>
          </ul>

          <h3 class="text-xl font-bold">Cam kết chất lượng:</h3>
          <p>Mọi dự án đều tuân thủ nghiêm ngặt tiêu chuẩn 5S và an toàn lao động. Chúng tôi sử dụng các vật liệu cách nhiệt (Panel) có khả năng chống cháy lan B2 và phụ kiện Inox 304 bền bỉ.</p>
        </div>
      `
    },
    {
      title: 'Dịch vụ Bảo trì & Giám sát Cloud 24/7',
      slug: 'bao-tri-giam-sat-cloud',
      category_id: sCatId,
      description: 'Hệ thống giám sát trực tuyến qua Smartphone, cảnh báo sớm sự cố và đội ngũ phản ứng nhanh trong vòng 2 giờ.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p>Dịch vụ hậu mãi là niềm tự hào của VietVinhCorp. Chúng tôi không bao giờ để khách hàng cô đơn sau khi bàn giao dự án.</p>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h4 class="font-bold text-lg">Giám sát Cloud thông minh:</h4>
              <p>Hệ thống của bạn được kết nối với trung tâm dữ liệu VietVinh. Mọi biến động nhiệt độ đều được ghi lại và gửi cảnh báo tức thì qua Smartphone.</p>
            </div>
            <div class="space-y-4">
              <h4 class="font-bold text-lg">Phản ứng nhanh 2h:</h4>
              <p>Chúng tôi cam kết có mặt trong vòng 2 giờ (nội thành) và tối đa 12 giờ (tỉnh) để xử lý mọi sự cố, bảo vệ hàng hóa của bạn.</p>
            </div>
          </div>

          <h3 class="text-xl font-bold">Gói bảo trì định kỳ:</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Kiểm tra nồng độ gas và rò rỉ môi chất.</li>
            <li>Vệ sinh dàn trao đổi nhiệt bằng hóa chất chuyên dụng.</li>
            <li>Cân chỉnh các thông số vận hành của máy nén.</li>
            <li>Nâng cấp phần mềm điều khiển tiết kiệm điện.</li>
          </ul>
        </div>
      `
    }
  ];

  const { error: sError } = await supabase.from('services').upsert(services, { onConflict: 'slug' });
  if (sError) console.error('❌ Lỗi tạo Services:', sError.message);
  else console.log('✅ Đã tạo Services.');

  // 2. BỔ SUNG SẢN PHẨM (PRODUCTS)
  const pCatData = await supabase.from('categories').select('id, slug').eq('type', 'product');
  const pCatMap = Object.fromEntries(pCatData.data.map(c => [c.slug, c.id]));

  const products = [
    {
      name: 'Dàn lạnh công nghiệp - Frost Free Design',
      slug: 'dan-lanh-cong-nghiep-frost-free',
      category_id: pCatMap['thiet-bi-lam-lanh'],
      description: 'Hệ thống dàn lạnh hiệu suất cao, thiết kế chống đóng tuyết, tối ưu lưu lượng gió xuyên suốt kho.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png', // Thay tạm
      features: ['Chống đóng tuyết', 'Vỏ inox 304', 'Quạt tiết kiệm điện EC'],
      specifications: { 'Lưu lượng gió': '5.000 - 50.000 m3/h', 'Khoảng cách thổi': 'Tới 30m', 'Môi chất': 'NH3/Freon/Glycol' }
    },
    {
      name: 'Hệ thống tủ điều khiển iBMS thông minh',
      slug: 'tu-dieu-khien-ibms-thong-minh',
      category_id: pCatMap['phu-kien-vat-tu'],
      description: 'Tích hợp màn hình cảm ứng HMI, thuật toán AI dự đoán phụ tải nhiệt, giúp hệ thống vận hành trơn tru.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png', // Thay tạm
      features: ['Màn hình HMI 10 inch', 'Giám sát qua Wifi/4G', 'Thuật toán AI tiết kiệm 71%'],
      specifications: { 'Điện áp': '380V/3P/50Hz', 'Kết nối': 'RS485/Modbus/Ethernet', 'Tiêu chuẩn': 'IP65' }
    }
  ];

  await supabase.from('products').upsert(products, { onConflict: 'slug' });
  console.log('✅ Đã bổ sung Sản phẩm.');

  // 3. BỔ SUNG DỰ ÁN (PROJECTS)
  const projectCatData = await supabase.from('categories').select('id, slug').eq('type', 'project');
  const prCatMap = Object.fromEntries(projectCatData.data.map(c => [pr.slug, pr.id])); // Lỗi typo pr.slug ở đây, sửa thành c.slug

  // Oops, check code lại...
}

// Sửa lại đoạn map
async function seedFinalDataFixed() {
  console.log('🔄 Đang đồng bộ hóa dữ liệu toàn diện (V2)...');
  
  // Reuse code from above but fixed
  const { data: sCatData } = await supabase.from('service_categories').select('id').eq('slug', 'ky-thuat-giai-phap').single();
  let sCatId = sCatData?.id;
  if (!sCatId) {
    const { data } = await supabase.from('service_categories').insert([{ name: 'Kỹ thuật & Giải pháp', slug: 'ky-thuat-giai-phap', display_order: 1, is_active: true }]).select().single();
    sCatId = data.id;
  }

  // SERVICES
  const services = [
    {
      title: 'Tư vấn & Thiết kế Hệ thống Nhiệt - Điện lạnh',
      slug: 'tu-van-thiet-ke-he-thong-nhiet',
      category_id: sCatId,
      description: 'Giải pháp thiết kế "may đo" dựa trên công nghệ mô phỏng nhiệt độ thực tế, tối ưu hóa PUE và chi phí vận hành.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/serv_design.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p class="text-lg">Tại VietVinhCorp, chúng tôi không chỉ vẽ bản vẽ, chúng tôi kiến tạo các giải pháp năng lượng bền vững. Quy trình tư vấn thiết kế của chúng tôi dựa trên 20 năm kinh nghiệm và các công cụ mô phỏng hiện đại nhất.</p>
          
          <h3 class="text-2xl font-bold text-blue-800">Quy trình 5 bước tiêu chuẩn:</h3>
          <ol class="list-decimal pl-6 space-y-4">
            <li><strong>Khảo sát & Phân tích (Site Audit):</strong> Đánh giá nhu cầu thực tế, điều kiện khí hậu và đặc tính sản phẩm cần bảo quản.</li>
            <li><strong>Tính toán phụ tải nhiệt & Mô phỏng:</strong> Sử dụng phần mềm chuyên dụng để tính toán chính xác công suất cần thiết, tránh lãng phí.</li>
            <li><strong>Thiết kế giải pháp tối ưu (BIM/3D):</strong> Xây dựng mô hình 3D giúp khách hàng hình dung trực quan và tối ưu hóa không gian lắp đặt.</li>
            <li><strong>Lập dự toán & Lộ trình tiết kiệm điện:</strong> Đề xuất các thuật toán điều khiển giúp giảm tới 71% chi phí điện năng.</li>
            <li><strong>Bàn giao Hồ sơ kỹ thuật:</strong> Cung cấp bộ hồ sơ đầy đủ, sẵn sàng cho giai đoạn thi công.</li>
          </ol>

          <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
            <h4 class="font-bold mb-2">Điểm khác biệt của VietVinh:</h4>
            <ul class="list-disc pl-5">
              <li>Ứng dụng thuật toán AI trong việc quản lý chu kỳ phá băng.</li>
              <li>Thiết kế tích hợp năng lượng tái tạo (Solar Cold Storage).</li>
              <li>Tối ưu hóa luân chuyển khí động học trong kho.</li>
            </ul>
          </div>
        </div>
      `
    },
    {
      title: 'Thi công & Lắp đặt Kho lạnh chuyên sâu',
      slug: 'thi-cong-lap-dat-kho-lanh',
      category_id: sCatId,
      description: 'Đội ngũ kỹ sư tinh nhuệ, thi công mọi địa hình từ kho cấp đông siêu tốc -60°C đến hệ thống kho khí quyển CA.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p>VietVinh sở hữu đội ngũ kỹ thuật viên giàu kinh nghiệm, đã thực hiện hàng trăm dự án trọng điểm trên toàn quốc. Chúng tôi cam kết tiến độ và chất lượng thi công đạt chuẩn quốc tế.</p>
          
          <h3 class="text-2xl font-bold text-blue-800">Năng lực thực hiện:</h3>
          <ul class="grid md:grid-cols-2 gap-4 list-none p-0">
            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho đông sâu tới -60°C (Deep Freezing)</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Kho khí quyển CA (Controlled Atmosphere)</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Hệ thống HVAC cho phòng sạch Dược phẩm</li>
            <li class="bg-white p-4 shadow-sm rounded border">✅ Lắp đặt hệ ống công nghệ vi sinh (Inox Food Grade)</li>
          </ul>

          <h3 class="text-xl font-bold">Cam kết chất lượng:</h3>
          <p>Mọi dự án đều tuân thủ nghiêm ngặt tiêu chuẩn 5S và an toàn lao động. Chúng tôi sử dụng các vật liệu cách nhiệt (Panel) có khả năng chống cháy lan B2 và phụ kiện Inox 304 bền bỉ.</p>
        </div>
      `
    },
    {
      title: 'Dịch vụ Bảo trì & Giám sát Cloud 24/7',
      slug: 'bao-tri-giam-sat-cloud',
      category_id: sCatId,
      description: 'Hệ thống giám sát trực tuyến qua Smartphone, cảnh báo sớm sự cố và đội ngũ phản ứng nhanh trong vòng 2 giờ.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png',
      is_active: true,
      content: `
        <div class="space-y-6">
          <p>Dịch vụ hậu mãi là niềm tự hào của VietVinhCorp. Chúng tôi không bao giờ để khách hàng cô đơn sau khi bàn giao dự án.</p>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <h4 class="font-bold text-lg">Giám sát Cloud thông minh:</h4>
              <p>Hệ thống của bạn được kết nối với trung tâm dữ liệu VietVinh. Mọi biến động nhiệt độ đều được ghi lại và gửi cảnh báo tức thì qua Smartphone.</p>
            </div>
            <div class="space-y-4">
              <h4 class="font-bold text-lg">Phản ứng nhanh 2h:</h4>
              <p>Chúng tôi cam kết có mặt trong vòng 2 giờ (nội thành) và tối đa 12 giờ (tỉnh) để xử lý mọi sự cố, bảo vệ hàng hóa của bạn.</p>
            </div>
          </div>

          <h3 class="text-xl font-bold">Gói bảo trì định kỳ:</h3>
          <ul class="list-disc pl-5 space-y-2">
            <li>Kiểm tra nồng độ gas và rò rỉ môi chất.</li>
            <li>Vệ sinh dàn trao đổi nhiệt bằng hóa chất chuyên dụng.</li>
            <li>Cân chỉnh các thông số vận hành của máy nén.</li>
            <li>Nâng cấp phần mềm điều khiển tiết kiệm điện.</li>
          </ul>
        </div>
      `
    }
  ];

  await supabase.from('services').upsert(services, { onConflict: 'slug' });
  
  // PRODUCTS
  const { data: pCatData } = await supabase.from('categories').select('id, slug').eq('type', 'product');
  const pCatMap = Object.fromEntries(pCatData.map(c => [c.slug, c.id]));

  const products = [
    {
      name: 'Dàn lạnh công nghiệp - Frost Free Design',
      slug: 'dan-lanh-cong-nghiep-frost-free',
      category_id: pCatMap['thiet-bi-lam-lanh'],
      description: 'Hệ thống dàn lạnh hiệu suất cao, thiết kế chống đóng tuyết, tối ưu lưu lượng gió xuyên suốt kho.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png',
      is_new: true,
      is_bestseller: false,
      features: ['Chống đóng tuyết', 'Vỏ inox 304', 'Quạt tiết kiệm điện EC'],
      specifications: { 'Lưu lượng gió': '5.000 - 50.000 m3/h', 'Khoảng cách thổi': 'Tới 30m', 'Môi chất': 'NH3/Freon/Glycol' }
    },
    {
      name: 'Hệ thống tủ điều khiển iBMS thông minh',
      slug: 'tu-dieu-khien-ibms-thong-minh',
      category_id: pCatMap['phu-kien-vat-tu'],
      description: 'Tích hợp màn hình cảm ứng HMI, thuật toán AI dự đoán phụ tải nhiệt, giúp hệ thống vận hành trơn tru.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png',
      is_new: true,
      is_bestseller: true,
      features: ['Màn hình HMI 10 inch', 'Giám sát qua Wifi/4G', 'Thuật toán AI tiết kiệm 71%'],
      specifications: { 'Điện áp': '380V/3P/50Hz', 'Kết nối': 'RS485/Modbus/Ethernet', 'Tiêu chuẩn': 'IP65' }
    }
  ];
  await supabase.from('products').upsert(products, { onConflict: 'slug' });

  // PROJECTS
  const { data: prCatData } = await supabase.from('categories').select('id, slug').eq('type', 'project');
  const prCatMap = Object.fromEntries(prCatData.map(c => [c.slug, c.id]));

  const projects = [
    {
      name: 'Hệ thống kho siêu lạnh âm sâu -60°C cho thực phẩm cao cấp',
      slug: 'du-an-kho-am-sau-60-do',
      category_id: prCatMap['che-bien-thuy-hai-san'],
      description: 'Thiết kế và lắp đặt trọn gói hệ thống kho âm sâu, sử dụng máy nén đa cấp (Cascade) công nghệ Nhật Bản.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png',
      client: 'Tập đoàn Chế biến Thực phẩm xuất khẩu',
      completion_date: '2024-03-01',
      is_featured: true
    },
    {
      name: 'Nhà máy Sản xuất Dược phẩm đạt chuẩn GMP-WHO',
      slug: 'du-an-nha-may-duoc-pham-gmp',
      category_id: prCatMap['cong-nghiep-dien-tu'],
      description: 'Triển khai hệ thống điều hòa chính xác (Precision Cooling) và hệ thống xử lý không khí AHU chuyên dụng.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png',
      client: 'Công ty Cổ phần Dược phẩm quy mô lớn',
      completion_date: '2024-01-20',
      is_featured: true
    }
  ];
  await supabase.from('projects').upsert(projects, { onConflict: 'slug' });

  console.log('🎉 HOÀN TẤT ĐỒNG BỘ TOÀN DIỆN V2!');
}

seedFinalDataFixed();
