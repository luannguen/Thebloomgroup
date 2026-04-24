import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const HOME_V1_CONTENT = {
  sections: [
    { id: 'banner-' + Date.now(), type: 'home_banner_slider', props: {} },
    { id: 'refrigeration-' + Date.now(), type: 'refrigeration', props: {} },
    { id: 'me_systems-' + Date.now(), type: 'me_systems', props: {} },
    { id: 'data_center-' + Date.now(), type: 'data_center', props: {} },
    { id: 'products-' + Date.now(), type: 'product_categories', props: {} },
    { id: 'projects-' + Date.now(), type: 'featured_projects', props: {} },
    { id: 'service_lifecycle-' + Date.now(), type: 'service_lifecycle', props: {} },
    { id: 'news_events-' + Date.now(), type: 'news_events', props: {} },
    { id: 'contact-' + Date.now(), type: 'contact_form', props: {} }
  ]
};

const HOME_V2_CONTENT = {
  sections: [
    { id: 'v2-banner-' + Date.now(), type: 'home_banner_slider', props: {} },
    { id: 'v2-partnership-' + Date.now(), type: 'home_v2_partnership', props: {} },
    { id: 'v2-sectors-' + Date.now(), type: 'home_v2_sectors', props: {} },
    { id: 'v2-solutions-' + Date.now(), type: 'home_v2_solutions', props: {} },
    { id: 'v2-stats-' + Date.now(), type: 'home_v2_stats', props: {} },
    { id: 'v2-featured_projects-' + Date.now(), type: 'featured_projects', props: {} },
    { id: 'v2-news-' + Date.now(), type: 'news_events', props: {} },
    { id: 'v2-contact-' + Date.now(), type: 'contact_form', props: {} }
  ]
};

async function seedHomeVersions() {
    console.log('🚀 Starting Home versions seeding...');

    const pages = [
        {
            slug: 'home',
            title: 'Trang chủ (Mặc định)',
            content: JSON.stringify(HOME_V1_CONTENT),
            is_active: true,
            updated_at: new Date()
        },
        {
            slug: 'home_v2',
            title: 'Trang chủ V2 (Hệ thống mới)',
            content: JSON.stringify(HOME_V2_CONTENT),
            is_active: true,
            updated_at: new Date()
        }
    ];

    for (const page of pages) {
        console.log(`📝 Checking page: ${page.slug}...`);
        
        // Check if page already exists
        const { data: existingPage } = await supabase
            .from('static_pages')
            .select('id')
            .eq('slug', page.slug)
            .single();

        if (existingPage) {
            console.log(`⏭️ Skipping ${page.slug} as it already exists in database.`);
            continue;
        }

        console.log(`✨ Creating new page: ${page.slug}...`);
        const { error } = await supabase
            .from('static_pages')
            .insert(page);

        if (error) {
            console.error(`❌ Error seeding ${page.slug}:`, error);
        } else {
            console.log(`✅ Successfully seeded ${page.slug}`);
        }
    }

    // Also ensure site_settings has a default primary_home_slug if missing
    const { data: settingData } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'primary_home_slug')
        .single();

    if (!settingData) {
        console.log('ℹ️ Setting default primary_home_slug to "home"...');
        await supabase.from('site_settings').insert({
            key: 'primary_home_slug',
            value: 'home'
        });
    }

    console.log('🏁 Seeding finished!');
}

seedHomeVersions();
