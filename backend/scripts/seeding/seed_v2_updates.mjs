import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const aboutV2Content = {
  sections: [
    {
      id: 'v2-hero-' + Date.now(),
      type: 'about_v2_hero',
      props: { 
        title: "About Us", 
        backgroundImage: "/assets/about-v2/about-banner.jpg" 
      }
    },
    {
      id: 'v2-intro-' + Date.now(),
      type: 'about_v2_intro',
      props: {
        title: "Hơn 20 năm khẳng định vị thế",
        description: "Chúng tôi tự hào là đơn vị tiên phong mang đến những giải pháp kỹ thuật lạnh tối ưu cho doanh nghiệp. Với đội ngũ chuyên gia giàu kinh nghiệm, Việt Vinh (VVC) cam kết đồng hành cùng sự phát triển bền vững của khách hàng thông qua công nghệ hiện đại và dịch vụ tận tâm.",
        image: "/assets/about-v2/intro-logo.png"
      }
    },
    {
      id: 'v2-accordion-' + Date.now(),
      type: 'about_v2_accordion',
      props: {
        vTitle: "Tầm nhìn",
        vContent: "Trở thành tập đoàn kỹ thuật lạnh hàng đầu Đông Nam Á, dẫn dắt thị trường bằng những giải pháp công nghệ làm mát thông minh và bền vững.",
        mTitle: "Sứ mệnh",
        mContent: "Cung cấp hệ sinh thái giải pháp kỹ thuật lạnh tối ưu, tiết kiệm năng lượng, góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường toàn cầu.",
        cTitle: "Giá trị cốt lõi",
        cContent: "UY TÍN là nền móng - CHẤT LƯỢNG là cam kết - SÁNG TẠO là động lực - KHÁCH HÀNG là trọng tâm."
      }
    },
    {
      id: 'v2-timeline-' + Date.now(),
      type: 'about_v2_timeline',
      props: { title: "Chặng đường lịch sử" }
    },
    {
      id: 'v2-location-' + Date.now(),
      type: 'about_v2_location',
      props: { title: "Mạng lưới văn phòng" }
    }
  ]
};

async function seedV2Updates() {
    console.log('Starting V2 seeding...');

    // 1. Seed About Us V2 page
    const { data: pageData, error: pageError } = await supabase
        .from('static_pages')
        .upsert({ 
            slug: 'about-us-v2',
            title: 'About Us V2',
            content: JSON.stringify(aboutV2Content),
            is_active: true,
            updated_at: new Date()
        }, { onConflict: 'slug' });
    
    if (pageError) {
        console.error('Error seeding about-us-v2 page:', pageError);
    } else {
        console.log('Successfully seeded About Us V2 page.');
    }

    // 2. Update Footer Version & Logos in site_settings
    const settings = [
        { 
            key: 'footer_version',
            value: 'v2',
            updated_at: new Date()
        },
        {
            key: 'logo_url',
            value: '/assets/about-v2/logo-vvc.svg',
            updated_at: new Date()
        },
        {
            key: 'footer_logo_url',
            value: '/assets/footer/logo-footer.svg',
            updated_at: new Date()
        }
    ];

    for (const s of settings) {
        const { error: settingsError } = await supabase
            .from('site_settings')
            .upsert(s, { onConflict: 'key' });

        if (settingsError) {
            console.error(`Error updating setting ${s.key}:`, settingsError);
        } else {
            console.log(`Successfully updated setting ${s.key}.`);
        }
    }
}

seedV2Updates();
