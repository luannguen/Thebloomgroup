import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const PAGE_ID = 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb';

async function verifyAndUpdate() {
    console.log(`Fetching page ${PAGE_ID}...`);
    const { data: page, error: fetchError } = await supabase
        .from('static_pages')
        .select('*')
        .eq('id', PAGE_ID)
        .single();

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    let content = page.content;
    if (typeof content === 'string') content = JSON.parse(content);

    console.log('Original Hero image:', content.sections.find(s => s.id === 'hero')?.props.image);

    content.sections = content.sections.map(section => {
        if (section.id === 'hero' || section.type === 'hero') {
            section.props.image = 'refrigeration_hero.png';
            section.props.image_url = '/images/refrigeration_hero.png';
        }
        if (section.id === 'intro' || section.type === 'features') {
            section.props.items = section.props.items.map(item => {
                if (item.id === 'f1') item.icon_image = '/images/feature_efficiency.png';
                if (item.id === 'f2') item.icon_image = '/images/feature_durable.png';
                if (item.id === 'f3') item.icon_image = '/images/feature_smart.png';
                return item;
            });
        }
        if (section.type === 'media_section') {
            if (section.id === 'tu-lanh') section.props.image = 'product_refrigerator.png';
            if (section.id === 'kho-lanh') section.props.image = 'product_cold_storage.png';
            if (section.id === 'cap-dong') section.props.image = 'product_iqf_system.png';
        }
        return section;
    });

    console.log('New Hero image:', content.sections.find(s => s.id === 'hero')?.props.image);

    console.log('Updating database...');
    const { data: updatedData, error: updateError } = await supabase
        .from('static_pages')
        .update({ content: content, updated_at: new Date().toISOString() })
        .eq('id', PAGE_ID)
        .select();

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('Update success! Verified Hero image in response:', updatedData[0]?.content?.sections?.find(s => s.id === 'hero')?.props.image);
    }
}

verifyAndUpdate();
