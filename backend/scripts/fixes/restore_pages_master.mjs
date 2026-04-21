import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

// Force load env from backend/.env
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IMAGES = {
  aboutHero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
  techHero: "https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/showcase/proj_factory.png",
  refrigHero: "/assets/images/industry/ca_tech.png",
  capHero: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
  servicesHero: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80",
  productsHero: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80",
  newsHero: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
  careerHero: "https://images.unsplash.com/photo-1521737706645-510300225112?auto=format&fit=crop&q=80&w=2000",
  teamHero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000",
  contactHero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000",
  projectsHero: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80",
  logoLight: "/logo-vvc.png", // Verify this path
  logoDark: "/logo-vvc.png"
};

const MASTER_DATA = [
  {
    slug: 'about-us',
    title: 'Giới thiệu',
    content: {
      sections: [
        {
          id: 'about-hero',
          type: 'hero',
          props: {
            title: "Về Việt Vinh Corp",
            description: "Đơn vị tiên phong trong giải pháp kỹ thuật lạnh công nghiệp bền vững và tiết kiệm năng lượng.",
            backgroundImage: IMAGES.aboutHero,
            alignment: "left",
            badge: "VVC Journey"
          }
        },
        {
          id: 'about-history',
          type: 'about_history',
          props: {
            title: "20 Năm Vững Bước",
            p1: 'Được thành lập vào năm 2003, VVC đã vượt qua chặng đường dài để khẳng định vị thế dẫn đầu trong ngành kỹ thuật lạnh Việt Nam.',
            p2: 'Sứ mệnh của chúng tôi là mang lại giải pháp tối ưu cho chuỗi cung ứng thực phẩm và dược phẩm.',
            image: IMAGES.aboutHero,
            expYears: '20+',
            expText: 'Năm kinh nghiệm'
          }
        },
        {
          id: 'about-vision',
          type: 'about_vision',
          props: {
            visionTitle: "Tầm nhìn",
            missionTitle: "Sứ mệnh"
          }
        },
        { id: 'about-values', type: 'about_values', props: { title: "Giá trị cốt lõi" } },
        { id: 'about-partners', type: 'about_partners', props: { title: "Đối tác tin cậy" } }
      ]
    }
  },
  {
    slug: 'he-thong-lanh',
    title: 'Hệ Thống Lạnh',
    content: {
      sections: [
        {
          id: 'refrig-hero-main',
          type: 'hero',
          props: {
            title: "Hệ Thống Lạnh Công Nghiệp",
            description: "Giải pháp làm lạnh tiên tiến cho chuỗi cung ứng thực phẩm, tối ưu chất lượng và năng lượng.",
            backgroundImage: IMAGES.refrigHero,
            alignment: "center",
            badge: "Core Systems"
          }
        },
        { id: 'refrig_catalog', type: 'cold_storage_catalog', props: {} },
        { 
          id: 'refrig_tech', 
          type: 'advanced_tech_showcase', 
          props: {
            title: "Công Nghệ Bảo Quản & Cấp Đông Chuyên Sâu",
            subtitle: "VIETVINH tiên phong ứng dụng các giải pháp bảo quản tiên tiến nhất thế giới.",
            badge: "Specialized Solutions",
            items: [
                { title: "Công nghệ Bảo quản CA", desc: "Kiểm soát khí quyển cho phép lưu trữ trái cây trên 12 tháng.", link: "/cong-nghe-bao-quan-ca" },
                { title: "Cấp đông nhanh IQF", desc: "Cấp đông từng cá thể giữ nguyên dinh dưỡng.", link: "/cap-dong-nhanh-iqf" },
                { title: "Phòng chín chuối", desc: "Quy trình chín nhân tạo chuẩn khoa học.", link: "/phong-chin-chuoi-tieu-chuan" },
                { title: "Hầm đông gió", desc: "Hạ nhiệt độ cực nhanh xuống -35°C.", link: "/ham-dong-gio-cong-suat-lon" }
            ]
          } 
        },
        { id: 'refrig_expertise', type: 'industrial_expertise', props: {} },
        { id: 'refrig_contact', type: 'contact_form', props: {} }
      ]
    }
  },
  {
    slug: 'technologies',
    title: 'Công Nghệ',
    content: {
      sections: [
        {
          id: "hero_tech_main",
          type: "hero",
          props: {
            title: "Công Nghệ & Thiết Bị",
            description: "Tiên phong ứng dụng AI điều khiển vòng kín và các công nghệ xanh tiên tiến nhất.",
            backgroundImage: IMAGES.techHero,
            alignment: "center",
            badge: "Innovation"
          }
        },
        {
          id: "media_opt_1",
          type: "media_section",
          props: {
            title: "Tối Ưu Hóa Năng Lượng Bằng AI & BMS",
            description: "Chúng tôi tích hợp AI để tiến hành Machine Learning trên dữ liệu lịch sử vận hành, tự động kiểm soát tải tĩnh.",
            image: IMAGES.techHero,
            layout: "image-left"
          }
        },
        { id: "cards_tech", type: "cards", props: { title: "Nền Tảng Kỹ Thuật Đỉnh Cao", columns: 3 } },
        { id: "products_tech", type: "product_categories", props: { title: "Sản phẩm tích hợp công nghệ" } },
        { id: "projects_tech", type: "featured_projects", props: { title: "Dự án thực tế" } }
      ]
    }
  },
  {
    slug: 'capability-profile',
    title: 'Hồ sơ năng lực',
    content: {
      sections: [
        {
          id: 'cap-hero',
          type: 'hero',
          props: {
            title: "Hồ Sơ Năng Lực",
            description: "Khám phá năng lực thiết kế, thi công và vận hành của VietVinhCorp.",
            backgroundImage: IMAGES.capHero,
            alignment: "center",
            badge: "Professionalism"
          }
        },
        {
          id: 'capability-main',
          type: 'capability_profile',
          props: {
            title: 'Năng Lực Việt Vinh Corp',
            description: 'Tài liệu chi tiết về kinh nghiệm và giải pháp.',
            pdfUrl: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/documents/VVC_Capability_Profile_2024.pdf'
          }
        }
      ]
    }
  },
  {
    slug: 'services',
    title: 'Dịch vụ Chuyên nghiệp',
    content: {
      sections: [
        {
          id: 'services-hero',
          type: 'hero',
          props: {
            title: "Dịch Vụ Kỹ Thuật Lạnh",
            description: "Chuỗi dịch vụ trọn vòng đời: từ tư vấn, thiết kế đến bảo trì 24/7.",
            backgroundImage: IMAGES.servicesHero,
            alignment: "left"
          }
        },
        { id: 'services-grid', type: 'service_grid', props: { title: "Dịch vụ của chúng tôi" } },
        { id: 'services-cta', type: 'cta_section', props: { title: "Bạn cần tư vấn giải pháp?" } }
      ]
    }
  },
  {
    slug: 'products',
    title: 'Hệ thống Sản phẩm',
    content: {
      sections: [
        {
          id: 'products-hero',
          type: 'hero',
          props: {
            title: "Vật Tư & Thiết Bị Lạnh",
            description: "Phân phối chính hãng các sản phẩm từ những đối tác hàng đầu thế giới.",
            backgroundImage: IMAGES.productsHero,
            alignment: "center"
          }
        },
        { id: 'products-catalog', type: 'product_categories', props: { title: "Danh mục sản phẩm" } }
      ]
    }
  },
  {
    slug: 'career',
    title: 'Cơ hội nghề nghiệp',
    content: {
      sections: [
        {
          id: 'career-hero',
          type: 'hero',
          props: {
            title: "Gia Nhập Việt Vinh Corp",
            description: "Cơ hội phát triển sự nghiệp trong môi trường kỹ thuật chuyên nghiệp và năng động.",
            backgroundImage: IMAGES.careerHero,
            alignment: "center",
            badge: "Talent"
          }
        },
        { id: 'career-jobs', type: 'jobs_list', props: { title: "Vị trí tuyển dụng" } },
        { id: 'career-form', type: 'contact_form', props: { title: "Nộp hồ sơ trực tuyến" } }
      ]
    }
  },
  {
    slug: 'news',
    title: 'Tin tức & Sự kiện',
    content: {
      sections: [
        {
          id: 'news-hero',
          type: 'hero',
          props: {
            title: "Tin Tức & Sự Kiện",
            description: "Cập nhật hoạt động mới nhất, dự án tiêu biểu và xu hướng công nghệ từ VietVinhCorp.",
            backgroundImage: IMAGES.newsHero,
            alignment: "center",
            badge: "VVC News"
          }
        },
        { id: 'news-list', type: 'news_events', props: { title: "Hoạt động doanh nghiệp" } }
      ]
    }
  },
  {
    slug: 'team',
    title: 'Đội ngũ chuyên gia',
    content: {
      sections: [
        {
          id: 'team-hero-img',
          type: 'hero',
          props: {
            title: "ĐỘI NGŨ CHUYÊN GIA VVC",
            description: "Hội tụ những tinh hoa trong ngành kỹ thuật lạnh, tâm huyết với từng giải pháp của khách hàng.",
            backgroundImage: IMAGES.teamHero,
            alignment: "center",
            badge: "Expertise"
          }
        },
        {
          id: 'team-grid',
          type: 'team_grid',
          props: {
            title: 'GẶP GỠ ĐỘI NGŨ CỦA CHÚNG TÔI',
            description: 'Đội ngũ kỹ sư và chuyên viên dày dặn kinh nghiệm, luôn sẵn sàng đồng hành cùng dự án của bạn.'
          }
        }
      ]
    }
  },
  {
    slug: 'contact',
    title: 'Liên hệ với chúng tôi',
    content: {
      sections: [
        {
          id: 'contact-hero-img',
          type: 'hero',
          props: {
            title: "KẾT NỐI VỚI CHÚNG TÔI",
            description: "VietVinhCorp luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của quý khách hàng.",
            backgroundImage: IMAGES.contactHero,
            alignment: "center",
            badge: "Get in touch"
          }
        },
        { id: 'contact-info-cards', type: 'contact_info', props: {} },
        { id: 'contact-map', type: 'google_map', props: {} },
        { id: 'contact-form-main', type: 'contact_form', props: { title: "Gửi tin nhắn cho chúng tôi" } }
      ]
    }
  },
  {
    slug: 'projects',
    title: 'Dự án tiêu biểu',
    content: {
      sections: [
        {
          id: 'projects-hero',
          type: 'hero',
          props: {
            title: "CÔNG TRÌNH TIÊU BIỂU",
            description: "Hàng trăm dự án thành công trên khắp cả nước khẳng định uy tín và năng lực kỹ thuật vượt trội của VietVinhCorp.",
            backgroundImage: IMAGES.projectsHero,
            alignment: "center",
            badge: "Success Stories"
          }
        },
        {
          id: 'projects-overview',
          type: 'project_overview',
          props: {
            title: "Năng lực & Kinh nghiệm thi công",
            description: "Với hơn 20 năm kinh nghiệm, Việt Vinh Corporation đã thực hiện hàng trăm dự án lớn nhỏ trong lĩnh vực điện lạnh công nghiệp. Chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn và doanh nghiệp hàng đầu.",
            item1: "Hơn 500 dự án lớn nhỏ đã hoàn thành",
            item2: "Đối tác của các tập đoàn đa quốc gia",
            item3: "Đội ngũ kỹ sư giàu kinh nghiệm thực tế",
            item4: "Cam kết chất lượng và tiến độ khắt khe"
          }
        },
        { id: 'projects-categories', type: 'project_categories', props: { title: "Lĩnh vực hoạt động" } },
        { id: 'projects-featured', type: 'featured_projects', props: { title: "Dự án nổi bật" } },
        { id: 'projects-achievements', type: 'achievements', props: { title: "Thành tựu chúng tôi đạt được" } },
        { id: 'projects-cta', type: 'cta_section', props: { title: "Bạn có dự án cần tư vấn kỹ thuật?" } }
      ]
    }
  }
];

async function restorePages() {
  console.log('🚀 Starting Master Restoration of corrupted pages...');

  for (const pageData of MASTER_DATA) {
    console.log(`Processing: ${pageData.slug} (${pageData.title})...`);
    
    // Attempt upsert (Insert or Update if slug exists)
    const { error } = await supabase
      .from('static_pages')
      .upsert({
        slug: pageData.slug,
        title: pageData.title,
        content: pageData.content,
        is_active: true,
        updated_at: new Date()
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ FAILED to restore ${pageData.slug}:`, error.message);
    } else {
      console.log(`✅ RESTORED ${pageData.slug} successfully.`);
    }
  }

  // Also handle aliases for capability profile
  const hoSoData = MASTER_DATA.find(p => p.slug === 'capability-profile');
  if (hoSoData) {
      const aliasSlugs = ['ho-so-nang-luc', 'company-profile'];
      for (const alias of aliasSlugs) {
          await supabase.from('static_pages').update({ content: hoSoData.content }).eq('slug', alias);
          console.log(`✅ SYNCED ${alias} alias.`);
      }
  }

  console.log('✨ Restoration complete.');
}

async function syncLogos() {
  console.log('🖼️ Synchronizing system logos...');
  
  const settings = [
    { key: 'logo_light', value: IMAGES.logoLight },
    { key: 'logo_dark', value: IMAGES.logoDark },
    { key: 'site_logo', value: IMAGES.logoLight }
  ];

  for (const s of settings) {
    const { error } = await supabase
      .from('site_settings')
      .upsert(s, { onConflict: 'key' });
    
    if (error) console.error(`❌ Failed to sync logo ${s.key}:`, error.message);
    else console.log(`✅ SYNCED logo: ${s.key}`);
  }
}

async function main() {
  await restorePages();
  await syncLogos();
  process.exit(0);
}

main().catch(err => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
