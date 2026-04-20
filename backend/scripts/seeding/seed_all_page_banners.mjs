import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const pageConfigs = [
  {
    slug: 'about-us',
    title: 'Về chúng tôi',
    description: 'Hơn 20 năm khẳng định vị thế dẫn đầu trong lĩnh vực HVAC và Cơ điện lạnh.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000'
  },
  {
    slug: 'products',
    title: 'Hệ thống Sản phẩm',
    description: 'Giải pháp thiết bị vật tư lạnh công nghiệp tiêu chuẩn quốc tế.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000'
  },
  {
    slug: 'news',
    title: 'Tin tức & Sự kiện',
    description: 'Cập nhật các hoạt động và công nghệ mới nhất từ Viet Vinh Corp.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2000'
  },
  {
    slug: 'technologies',
    title: 'Giải pháp Công nghệ',
    description: 'Ứng dụng các giải pháp kỹ thuật lạnh bền vững và tối ưu hiệu suất năng lượng.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000'
  },
  {
    slug: 'ho-so-nang-luc',
    title: 'Hồ sơ năng lực',
    description: 'Tổng quan về năng lực thiết kế, thi công và vận hành hệ thống điện lạnh quy mô lớn của VVC.',
    image: 'https://images.unsplash.com/photo-1454165833772-d996d49513d7?auto=format&fit=crop&q=80&w=2000'
  },
  {
      slug: 'services',
      title: 'Dịch vụ Chuyên nghiệp',
      description: 'Hệ sinh thái dịch vụ kỹ thuật lạnh toàn diện từ tư vấn đến vận hành.',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000'
  }
];

async function seedBanners() {
  console.log('🚀 Starting banner seeding...');

  for (const config of pageConfigs) {
    const heroSection = {
      id: `hero-${config.slug}`,
      type: 'hero',
      props: {
        title: config.title,
        description: config.description,
        backgroundImage: config.image,
        alignment: 'center'
      }
    };

    // First check if page exists
    const { data: page, error: fetchError } = await supabase
      .from('static_pages')
      .select('id, content')
      .eq('slug', config.slug)
      .maybeSingle();

    if (fetchError) {
      console.error(`❌ Error fetching page ${config.slug}:`, fetchError);
      continue;
    }

    let updatedContent = { sections: [heroSection] };

    if (page) {
      // If page exists, try to preserve existing sections but ensure hero is at top
      try {
        const existingData = page.content ? JSON.parse(page.content) : { sections: [] };
        const otherSections = (existingData.sections || []).filter(s => s.type !== 'hero' && s.id !== `hero-${config.slug}`);
        updatedContent = { sections: [heroSection, ...otherSections] };
      } catch (e) {
        console.warn(`⚠️ Could not parse existing content for ${config.slug}, overwriting.`);
      }

      const { error: updateError } = await supabase
        .from('static_pages')
        .update({ 
          content: JSON.stringify(updatedContent),
          title: config.title 
        })
        .eq('slug', config.slug);

      if (updateError) console.error(`❌ Error updating ${config.slug}:`, updateError);
      else console.log(`✅ Updated ${config.slug}`);

    } else {
      // Insert new page
      const { error: insertError } = await supabase
        .from('static_pages')
        .insert({
          slug: config.slug,
          title: config.title,
          content: JSON.stringify(updatedContent),
          is_active: true
        });

      if (insertError) console.error(`❌ Error inserting ${config.slug}:`, insertError);
      else console.log(`✅ Inserted ${config.slug}`);
    }
  }

  console.log('✨ Banner seeding finished.');
}

seedBanners();
