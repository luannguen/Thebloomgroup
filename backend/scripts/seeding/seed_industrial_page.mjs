import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env from backend matching the VITE_ prefixed keys if needed 
// or run this with node --env-file
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const industrialPageData = {
  slug: 'products-industrial',
  title: 'Sản Phẩm Điều Hòa Công Nghiệp',
  excerpt: 'Giải pháp HVAC toàn diện, hiệu suất cao dành riêng cho nhà máy, khu công nghiệp và công trình quy mô lớn.',
  is_active: true,
  content: JSON.stringify({
    sections: [
      {
        id: "hero_industrial",
        type: "hero",
        props: {
          title: "Giải Pháp Điều Hòa Công Nghiệp",
          description: "Hệ thống làm mát công suất siêu lớn chuyên dụng cho nhà máy, kho xưởng và trung tâm thương mại theo tiêu chuẩn quốc tế ISO 9001.",
          backgroundImage: "https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_hvac.png",
          alignment: "center",
          badge: "Công Suất Siêu Lớn"
        }
      },
      {
        id: "media_industrial_1",
        type: "media_section",
        props: {
          title: "Khả năng vận hành mạnh mẽ, tối ưu",
          description: "Việt Vinh tự hào là nhà cung cấp giải pháp điều hòa trung tâm với công suất lên đến 3000RT. Công nghệ máy nén tích hợp biến tần toàn phần giúp đạt hiệu suất làm mát xuất sắc, đồng thời tiết kiệm đáng kể chi phí điện năng.\n\n<ul><li class='mb-2'>✅ <b>Làm lạnh siêu tốc:</b> Đáp ứng mọi yêu cầu khắt khe về nhiệt độ.</li><li class='mb-2'>✅ <b>Tiết kiệm điện 40%:</b> Nhờ công nghệ từ tĩnh và môi chất lạnh thế hệ mới (R134a/R1234ze).</li><li class='mb-2'>✅ <b>Độ ổn định cao:</b> Vận hành bền bỉ liên tục 24/7 trong nhiều năm.</li></ul>",
          image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          layout: "image-left",
          imageWidth: 50,
          mediaType: "image"
        }
      },
      {
        id: "tech_industrial_1",
        type: "technical_detail",
        props: {
          title: "Đặc tính kỹ thuật vượt trội",
          description: "Chiller và AHU công nghiệp tại Việt VinhCorp không chỉ làm lạnh, mà còn thanh lọc không khí, kiểm soát độ ẩm chặt chẽ dùng cho các công trình đẳng cấp cao như Dược Phẩm, Điện Tử.\n\n- Dải công suất: 50RT - 3.000RT\n- Chuẩn màng lọc vệ sinh: HEPA H13/H14\n- Lưu lượng gió (AHU): Lên đến 120.000 CFM\n- Công nghệ điều khiển: iBMS/PLC tự động hóa toàn phần",
          image: "https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/prod_compressor.png",
          layout: "image-right"
        }
      },
      {
        id: "feat_projects_idx",
        type: "featured_projects",
        props: {
          title: "Dự Án Công Nghiệp Thực Tế",
          description: "Các đối tác đã tin tưởng và ứng dụng hệ thống điều hòa công nghiệp của chúng tôi."
        }
      },
      {
        id: "feat_products_idx",
        type: "product_categories",
        props: {
          title: "Thiết Bị Lưu Trữ & Phụ Trợ",
          description: "Khám phá thêm hệ sinh thái sản phẩm toàn diện cho HVAC & Lạnh Công Nghiệp."
        }
      }
    ]
  })
};

async function seed() {
  console.log('Seeding industrial page...');
  
  // Check if exists
  const { data: existing } = await supabase.from('static_pages').select('id').eq('slug', industrialPageData.slug).single();
  
  if (existing) {
    const { error } = await supabase.from('static_pages').update(industrialPageData).eq('id', existing.id);
    if (error) console.error("Error updating:", error);
    else console.log(`Updated page: ${industrialPageData.slug}`);
  } else {
    const { error } = await supabase.from('static_pages').insert([industrialPageData]);
    if (error) console.error("Error inserting:", error);
    else console.log(`Inserted page: ${industrialPageData.slug}`);
  }
}

seed().catch(console.error);
