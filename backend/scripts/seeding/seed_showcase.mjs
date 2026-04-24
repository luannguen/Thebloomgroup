import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('🔄 Đang đồng bộ hóa Sản phẩm & Dự án thực tế...');

  // 1. CLEAR OLD DATA (Optional, but good for clean seed)
  // await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  // await supabase.from('categories').delete().in('type', ['product', 'project']);

  // 2. CREATE CATEGORIES
  const productCats = [
    { name: 'Thiết bị làm lạnh', slug: 'thiet-bi-lam-lanh', type: 'product', description: 'Các cụm máy nén và dàn trao đổi nhiệt công nghiệp.' },
    { name: 'Tấm cách nhiệt (Panel)', slug: 'tam-cach-nhiet-panel', type: 'product', description: 'Panel PU/PIR tỉ trọng cao cho kho lạnh và phòng sạch.' },
    { name: 'Cửa kho lạnh chuyên dụng', slug: 'cua-kho-lanh', type: 'product', description: 'Cửa trượt, cửa bản lề và cửa kho khí quyển CA.' },
    { name: 'Phụ kiện & Vật tư', slug: 'phu-kien-vat-tu', type: 'product', description: 'Van, tủ điện điều khiển và linh kiện thay thê.' }
  ];

  const projectCats = [
    { name: 'Chế biến Thủy hải sản', slug: 'che-bien-thuy-hai-san', type: 'project', description: 'Hệ thống cấp đông và kho bảo quản cho nhà máy thủy sản.' },
    { name: 'Công nghiệp & Điện tử', slug: 'cong-nghiep-dien-tu', type: 'project', description: 'Hệ thống MEP và phòng sạch cho các nhà máy sản xuất linh kiện.' },
    { name: 'Logistics & Bán lẻ', slug: 'logistics-ban-le', type: 'project', description: 'Kho lạnh trung tâm và hệ thống lạnh cho siêu thị.' }
  ];

  // Upsert categories (slug is unique, we check existence)
  for (const cat of [...productCats, ...projectCats]) {
    const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).single();
    if (!existing) {
        await supabase.from('categories').insert(cat);
    }
  }

  const { data: catData, error: catError } = await supabase
    .from('categories')
    .select();

  if (catError) {
    console.error('❌ Lỗi tạo danh mục:', catError.message);
    return;
  }
  console.log('✅ Đã tạo danh mục.');

  const catMap = Object.fromEntries(catData.map(c => [c.slug, c.id]));

  // 3. CREATE PRODUCTS
  const products = [
    {
      name: 'Cụm máy nén giải nhiệt gió - Thế hệ mới',
      slug: 'cum-may-nen-giai-nhiet-gio',
      category_id: catMap['thiet-bi-lam-lanh'],
      description: 'Sử dụng máy nén Bitzer (Đức), tối ưu hóa hiệu suất làm lạnh và tiết kiệm điện năng lên đến 30%.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png',
      is_new: true,
      is_bestseller: true,
      features: ['Tiết kiệm điện 30%', 'Vận hành êm ái', 'Điều khiển qua App'],
      specifications: { 'Công suất': '10-150 HP', 'Môi chất': 'R404A/R507', 'Xuất xứ': 'Đức/VietVinh Assembly' }
    },
    {
      name: 'Panel PU Cam-lock tiêu chuẩn xuất khẩu',
      slug: 'panel-pu-cam-lock',
      category_id: catMap['tam-cach-nhiet-panel'],
      description: 'Tấm cách nhiệt Polyurethane tỉ trọng 42kg/m3, sử dụng khóa Cam-lock để đảm bảo kín khít tuyệt đối.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_panel.png',
      features: ['Khóa Cam-lock kín khí', 'Tỉ trọng 42kg/m3', 'Chống cháy lan B2'],
      specifications: { 'Độ dày': '50, 75, 100, 150mm', 'Bề mặt': 'Inox 304 / Tôn mạ màu', 'Khổ rộng': '1120mm' }
    },
    {
      name: 'Cửa trượt kho lạnh tự động công nghệ EU',
      slug: 'cua-truot-kho-lanh-tu-dong',
      category_id: catMap['cua-kho-lanh'],
      description: 'Khung inox 304 bền bỉ, hệ thống điện sưởi chống đóng băng gioăng cửa, tích hợp cảm biến radar.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_door.png',
      features: ['Cảm biến tự động', 'Inox 304 cao cấp', 'Chống đóng băng gioăng'],
      specifications: { 'Kích thước': 'Tùy chọn theo dự án', 'Điện áp sưởi': '220V', 'Tốc độ mở': '0.5 - 1.2m/s' }
    }
  ];

  // Insert products if not exist
  for (const prod of products) {
    const { data: existing } = await supabase.from('products').select('id').eq('slug', prod.slug).single();
    if (!existing) {
        const { error } = await supabase.from('products').insert(prod);
        if (error) console.error(`❌ Error creating product ${prod.slug}:`, error.message);
    }
  }
  if (prodError) console.error('❌ Lỗi tạo sản phẩm:', prodError.message);
  else console.log('✅ Đã tạo sản phẩm.');

  // 4. CREATE PROJECTS (Chung chung, chuyên nghiệp)
  const projects = [
    {
      name: 'Hệ thống kho lạnh trung tâm tại Khu Logistics Miền Tây',
      slug: 'du-an-logistics-mien-tay',
      category_id: catMap['logistics-ban-le'],
      description: 'Thi công trọn gói cụm kho lạnh 5.000 tấn, sử dụng công nghệ quản lý kho thông minh và máy nén hiệu suất cao.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_warehouse.png',
      client: 'Tập đoàn Logistics hàng đầu Việt Nam',
      completion_date: '2023-10-15',
      is_featured: true
    },
    {
      name: 'Nhà máy chế biến Thủy sản tiêu biểu - Tiêu chuẩn EU/HACCP',
      slug: 'du-an-nha-may-thuy-san-tieu-chuan-eu',
      category_id: catMap['che-bien-thuy-hai-san'],
      description: 'Cung cấp hệ thống cấp đông IQF, kho bảo quản -25 độ C và hệ thống điều hòa khu vực sản xuất.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png',
      client: 'Doanh nghiệp xuất khẩu Thủy sản xuất sắc',
      completion_date: '2024-02-20',
      is_featured: true
    },
    {
      name: 'Hệ thống MEP & Phòng sạch Nhà máy Linh kiện Điện tử',
      slug: 'du-an-mep-phong-sach-dien-tu',
      category_id: catMap['cong-nghiep-dien-tu'],
      description: 'Lắp đặt hệ thống điều hòa chính xác, xử lý bụi ISO Class 5 và hệ thống ống công nghệ kỹ thuật cao.',
      image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png',
      client: 'Nhà đầu tư FDI công nghệ cao',
      completion_date: '2024-01-10',
      is_featured: true
    }
  ];

  // Insert projects if not exist
  for (const proj of projects) {
    const { data: existing } = await supabase.from('projects').select('id').eq('slug', proj.slug).single();
    if (!existing) {
        const { error } = await supabase.from('projects').insert(proj);
        if (error) console.error(`❌ Error creating project ${proj.slug}:`, error.message);
    }
  }
  if (projError) console.error('❌ Lỗi tạo dự án:', projError.message);
  else console.log('✅ Đã tạo dự án.');

  console.log('\n🎉 HOÀN TẤT: Dữ liệu thực tế cho Sản phẩm & Dự án đã sẵn sàng!');
}

seedData();
