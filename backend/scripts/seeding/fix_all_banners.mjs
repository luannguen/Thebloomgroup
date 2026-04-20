import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const DEFAULT_BANNER = "/assets/about-v2/about-banner.jpg";

const pagesToFix = [
  { slug: 'about-us', title: 'Giới thiệu' },
  { slug: 'he-thong-lanh', title: 'Hệ thống lạnh' },
  { slug: 'technologies', title: 'Công nghệ' },
  { slug: 'products', title: 'Sản phẩm' },
  { slug: 'services', title: 'Dịch vụ' },
  { slug: 'news', title: 'Tin tức' },
  { slug: 'capability-profile', title: 'Hồ sơ năng lực' },
  { slug: 'career', title: 'Tuyển dụng' }
];

async function fixAllBanners() {
  console.log('🚀 Starting Universal Banner Fix...');

  for (const page of pagesToFix) {
    // Check if page exists first
    const { data: existingPage } = await supabase
      .from('static_pages')
      .select('content')
      .eq('slug', page.slug)
      .single();

    let content = { sections: [] };
    if (existingPage && existingPage.content) {
      try {
        content = JSON.parse(existingPage.content);
      } catch (e) {
        console.log(`Page ${page.slug} content is not valid JSON, creating new.`);
      }
    }

    // Find or Create Hero Section
    let heroSection = content.sections.find(s => s.type === 'hero' || s.type === 'about_hero' || s.type === 'about_v2_hero');
    
    if (heroSection) {
      heroSection.props = { 
        ...heroSection.props, 
        backgroundImage: DEFAULT_BANNER 
      };
    } else {
      // Add a hero section at the beginning
      content.sections.unshift({
        id: 'hero-' + Date.now(),
        type: 'hero',
        props: {
          title: page.title,
          description: page.title + " - THE BLOOM GROUP",
          backgroundImage: DEFAULT_BANNER,
          alignment: 'center'
        }
      });
    }

    const { error } = await supabase
      .from('static_pages')
      .upsert({
        slug: page.slug,
        title: page.title,
        content: JSON.stringify(content),
        is_active: true,
        updated_at: new Date()
      }, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error fixing banner for ${page.slug}:`, error);
    } else {
      console.log(`✅ Fixed banner for ${page.slug} successfully`);
    }
  }

  console.log('🏁 Universal Banner Fix completed!');
}

fixAllBanners();
