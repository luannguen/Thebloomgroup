import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const aboutContent = {
  sections: [
    {
      id: 'hero-' + Date.now(),
      type: 'about_hero',
      props: { 
        title: "Giới thiệu", 
        description: "Tổng công ty Kỹ thuật lạnh Việt Nam (VVC) - Đơn vị tiên phong trong giải pháp kỹ thuật lạnh công nghiệp bền vững và tiết kiệm năng lượng." 
      }
    },
    {
      id: 'history-' + Date.now(),
      type: 'about_history',
      props: {
        title: "Lịch sử phát triển",
        p1: 'Được thành lập vào năm 2003, VVC đã trải qua chặng đường hơn 20 năm phát triển bền vững, không ngừng đổi mới để trở thành Tổng công ty kỹ thuật lạnh hàng đầu Việt Nam.',
        p2: 'Sự kết hợp giữa đội ngũ kỹ sư chuyên môn cao và quy trình quản trị hiện đại đã giúp VVC khẳng định vị thế trong các lĩnh vực: kho lạnh công nghiệp, hệ thống điều hòa không khí và vật tư kỹ thuật lạnh.',
        image: '/vvc-hero.png',
        expYears: '20+',
        expText: 'Năm kinh nghiệm'
      }
    },
    {
      id: 'vision-' + Date.now(),
      type: 'about_vision',
      props: {
        visionTitle: "Tầm nhìn",
        visionDesc1: 'Trở thành biểu tượng uy tín hàng đầu trong ngành kỹ thuật lạnh tại Việt Nam và vươn tầm khu vực Đông Nam Á.',
        missionTitle: "Sứ mệnh",
        missionDesc1: 'Cung cấp hệ sinh thái giải pháp kỹ thuật lạnh bền vững, tiết kiệm năng lượng, góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường.'
      }
    },
    {
      id: 'values-' + Date.now(),
      type: 'about_values',
      props: { title: "Giá trị cốt lõi" }
    },
    { 
      id: 'partners-' + Date.now(), 
      type: 'about_partners', 
      props: { title: "Đối tác & Khách hàng" } 
    }
  ]
};

async function seedAboutPage() {
    const pageData = { 
        slug: 'about-us',
        content_json: aboutContent,
        title: 'About Us',
        is_active: true,
        updated_at: new Date()
    };

    // Check if exists
    const { data: existing } = await supabase
        .from('static_pages')
        .select('id')
        .eq('slug', pageData.slug)
        .single();

    if (existing) {
        console.log(`Page ${pageData.slug} already exists, skipping seed.`);
        return;
    }
    
    const { error } = await supabase.from('static_pages').insert([pageData]);
    if (error) {
        console.error('Error seeding About Us page:', error.message);
    } else {
        console.log('Successfully seeded About Us page.');
    }
}

seedAboutPage();
