import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const PAGE_ID = 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb';

async function updatePage() {
    console.log(`Fetching page ${PAGE_ID}...`);
    const { data, error } = await supabase
        .from('static_pages')
        .select('content')
        .eq('id', PAGE_ID)
        .single();

    if (error || !data) {
        console.error('Error fetching page:', error);
        return;
    }

    let content = data.content;
    if (typeof content === 'string') content = JSON.parse(content);

    content.sections = content.sections.map(section => {
        // Hero Section
        if (section.id === 'hero' || section.type === 'hero') {
            section.props.image = 'refrigeration_hero.png';
            // Also update image_url just in case
            section.props.image_url = '/images/refrigeration_hero.png';
        }

        // Intro (Features) Section
        if (section.id === 'intro' || section.type === 'features') {
            if (section.props && Array.isArray(section.props.items)) {
                section.props.items = section.props.items.map(item => {
                    if (item.id === 'f1') item.icon_image = '/images/feature_efficiency.png';
                    if (item.id === 'f2') item.icon_image = '/images/feature_durable.png';
                    if (item.id === 'f3') item.icon_image = '/images/feature_smart.png';
                    return item;
                });
            }
        }

        // Product sections (media_section)
        if (section.type === 'media_section') {
            if (section.id === 'tu-lanh') section.props.image = 'product_refrigerator.png';
            if (section.id === 'kho-lanh') section.props.image = 'product_cold_storage.png';
            if (section.id === 'cap-dong') section.props.image = 'product_iqf_system.png';
        }

        return section;
    });

    console.log('Updating database...');
    const { error: updateError } = await supabase
        .from('static_pages')
        .update({ content: content })
        .eq('id', PAGE_ID);

    if (updateError) {
        console.error('Error updating:', updateError);
    } else {
        console.log('SUCCESS: Page updated with new images!');
    }
}

updatePage();
