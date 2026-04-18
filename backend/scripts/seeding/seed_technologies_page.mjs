import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const getSvg = (path) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;

const techPageData = {
  slug: 'technologies',
  title: 'Công Nghệ & Thiết Bị',
  excerpt: 'Khám phá các tiến bộ công nghệ cốt lõi giúp VVC thiết lập tiêu chuẩn mới trong làm lạnh công nghiệp.',
  is_active: true,
  content: JSON.stringify({
    sections: [
      {
        id: "hero_tech_main",
        type: "hero",
        props: {
          title: "Công Nghệ & Thiết Bị",
          description: "Tiên phong ứng dụng AI điều khiển vòng kín và các công nghệ xanh tiên tiến nhất trong kỹ thuật Nhiệt Lạnh / Điệu Hòa Không Khí.",
          backgroundImage: "https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png",
          alignment: "center",
          badge: "Innovation"
        }
      },
      {
        id: "media_opt_1",
        type: "media_section",
        props: {
          title: "Tối Ưu Hóa Năng Lượng Bằng AI & BMS",
          description: "Tại Việt VinhCorp, hệ thống quản lý năng lượng (BMS/EMS) không chỉ dừng lại ở việc đọc chỉ số. Chúng tôi tích hợp AI để tiến hành **Machine Learning** trên dữ liệu lịch sử vận hành, tự động kiểm soát tải tĩnh, điều chỉnh góc mở của van tiết lưu EEV và công suất máy nén.\n\nKết quả mang lại là **hiệu năng tiết kiệm điện năng chạm mốc 35 - 40%**, giảm thiểu đáng kể khí thải Carbon, đáp ứng tiêu chí LEED/LOTUS cho công trình kiến trúc xanh bền vững.",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          layout: "image-left"
        }
      },
      {
        id: "cards_tech",
        type: "cards",
        props: {
          title: "Nền Tảng Kỹ Thuật Đỉnh Cao",
          columns: 3,
          style: "elevated",
          items: [
            { 
              id: "c1", 
              title: "Máy Nén Từ Tĩnh Biến Tần", 
              description: "Vận hành không dùng dầu bôi trơn, triệt tiêu ma sát cơ học, gia tăng tuổi thọ và giảm độ ồn xuống dưới 65dB.",
              icon: getSvg('<circle cx="12" cy="12" r="10"/><path d="M12 2v20 M2 12h20"/>') // Simple circle with cross
            },
            { 
              id: "c2", 
              title: "Môi Chất Lạnh Xanh", 
              description: "Sử dụng HFO (R-1234ze) và tự nhiên với chỉ số GWP siêu thấp, vượt xa chuẩn tiêu chuẩn Quốc tế.",
              icon: getSvg('<path d="M11 20A7 7 0 0 1 14 6v0a7 7 0 0 1 4 11v0a7 7 0 0 1-7 3v0z"/>') // Leaf-like shape
            },
            { 
              id: "c3", 
              title: "Đường Hầm Cấp Đông IQF", 
              description: "Bề mặt sản phẩm bị đông lạnh tức thì, khóa chặt tinh thể nước, giữ cấu trúc dinh dưỡng không suy suyển.",
              icon: getSvg('<path d="M12 2v20 M2 12h20 M4.9 4.9l14.2 14.2 M19.1 4.9L4.9 19.1"/>') // Snowflake idea
            },
            { 
              id: "c4", 
              title: "Giám Sát Đám Mây Cloud Server", 
              description: "Cảnh báo tải hệ thống và áp suất ngay lập tức được gửi đến mobile/web của đội kĩ sư duy trì 24/7.",
              icon: getSvg('<path d="M17.5 19H9a7 7 0 1 1 6.7-9h.8a4 4 0 1 1 1 8"/>') // Cloud
            },
            { 
              id: "c5", 
              title: "Kháng Khuẩn Nano Bạc", 
              description: "Sử dụng vật liệu bảo ôn lõi Nano kháng khuẩn, tự động vô hiệu hóa sinh vật, xuất sắc đạt chuẩn GMP.",
              icon: getSvg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>') // Shield
            },
            { 
              id: "c6", 
              title: "Kho Khí Quyển CA", 
              description: "Làm chậm quá trình rữa bằng việc kiểm soát O2, CO2, Ni-tơ và Ethylene một cách tinh chỉnh tự động hóa.",
              icon: getSvg('<path d="M12 2v20 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>') // Flow/Air
            }
          ]
        }
      },
      {
        id: "products_tech",
        type: "product_categories",
        props: {
          title: "Công Nghệ Tích Hợp Ở Thiết Bị Tiêu Chuẩn",
          subtitle: "Các dòng sản phẩm phân phối được ứng dụng các tinh hoa công nghệ hàng đầu."
        }
      },
      {
        id: "projects_tech",
        type: "featured_projects",
        props: {
          title: "Thực Chiến Công Nghệ Trên Công Trình",
          subtitle: "Những dự án tiêu biểu minh chứng cho khả năng triển khai công nghệ cao của Việt VinhCorp."
        }
      },
      {
        id: "partners_tech",
        type: "about_partners",
        props: {
          title: "Mạng Lưới Đối Tác Chuyển Giao Công Nghệ Toàn Cầu"
        }
      }
    ]
  })
};

async function seed() {
  console.log('Seeding technologies page (fixed card icons)...');
  
  const { data: existing } = await supabase.from('static_pages').select('id').eq('slug', techPageData.slug).single();
  
  if (existing) {
    const { error } = await supabase.from('static_pages').update(techPageData).eq('id', existing.id);
    if (error) console.error("Error updating:", error);
    else console.log(`Updated page: ${techPageData.slug}`);
  } else {
    const { error } = await supabase.from('static_pages').insert([techPageData]);
    if (error) console.error("Error inserting:", error);
    else console.log(`Inserted page: ${techPageData.slug}`);
  }
}

seed().catch(console.error);
