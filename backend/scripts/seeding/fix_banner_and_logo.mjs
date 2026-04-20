import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from frontend/.env for Supabase credentials
dotenv.config({ path: path.resolve(__dirname, '../../../thebloomgroup/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables in thebloomgroup/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixBannerAndLogo() {
  console.log('🚀 Starting Banner Fix & Logo Seeding...');

  // 1. Fix Technologies & He-thong-lanh Banners
  const techHero = {
    sections: [
      {
        id: 'hero-technologies',
        type: 'hero',
        props: {
          title: 'Hệ Thống Lạnh Công Nghiệp',
          description: 'Giải pháp làm lạnh tối ưu và tiết kiệm năng lượng cho mọi ngành công nghiệp, từ thực phẩm đến dược phẩm.',
          backgroundImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
          alignment: 'center',
          buttonText: 'Xem Giải Pháp',
          buttonLink: '/services'
        }
      }
    ]
  };

  const targetSlugs = ['technologies', 'he-thong-lanh'];

  for (const slug of targetSlugs) {
    const { error: techError } = await supabase
      .from('static_pages')
      .upsert({
        slug: slug,
        title: 'Hệ Thống Lạnh',
        content: JSON.stringify(techHero),
        is_active: true,
        updated_at: new Date()
      }, { onConflict: 'slug' });

    if (techError) {
      console.error(`❌ Error fixing banner for slug ${slug}:`, techError);
    } else {
      console.log(`✅ Fixed banner for slug "${slug}" successfully`);
    }
  }

  // 2. Seed Site Settings for Logo
  const settings = [
    { 
      key: 'logo_url', 
      value: '/images/logo-ttt.svg', // Assuming this is where it will be placed or already is
      description: 'Main Logo URL' 
    },
    { 
      key: 'logo_name', 
      value: 'THE BLOOM GROUP', 
      description: 'Company Name' 
    },
    { 
      key: 'site_name', 
      value: 'THE BLOOM GROUP', 
      description: 'Website Name' 
    },
    {
        key: 'footer_logo_url',
        value: '/images/logo-ttt.svg',
        description: 'Footer Logo URL'
    }
  ];

  for (const setting of settings) {
    const { error: settingError } = await supabase
      .from('site_settings')
      .upsert(setting, { onConflict: 'key' });

    if (settingError) {
      console.error(`❌ Error seeding setting ${setting.key}:`, settingError);
    } else {
      console.log(`✅ Seeded setting: ${setting.key}`);
    }
  }

  console.log('🏁 Banner fix and Logo seeding completed!');
}

fixBannerAndLogo();
