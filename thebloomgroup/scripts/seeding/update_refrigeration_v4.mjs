import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const PAGE_ID = 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb';

async function forceUpdate() {
    console.log('--- FORCE UPDATE ---');
    const { data: page } = await supabase.from('static_pages').select('content').eq('id', PAGE_ID).single();
    let content = page.content;
    if (typeof content === 'string') content = JSON.parse(content);

    // Apply changes
    content.sections = content.sections.map(section => {
        if (section.id === 'hero') {
            section.props.backgroundImage = 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/images/industrial_refrigeration_hero_1775261841650.png';
        }
        if (section.id === 'intro') {
            section.props.items = section.props.items.map(item => {
                if (item.id === 'f1') item.icon_image = '/images/feature_efficiency.png';
                if (item.id === 'f2') item.icon_image = '/images/feature_durable.png';
                if (item.id === 'f3') item.icon_image = '/images/feature_smart.png';
                return item;
            });
        }
        if (section.id === 'tu-lanh') section.props.image = 'product_refrigerator.png';
        if (section.id === 'kho-lanh') section.props.image = 'product_cold_storage.png';
        if (section.id === 'cap-dong') section.props.image = 'product_iqf_system.png';
        return section;
    });

    const stringifiedContent = JSON.stringify(content);
    console.log('Sending stringified content...');

    const { data, error } = await supabase
        .from('static_pages')
        .update({ content: stringifiedContent })
        .eq('id', PAGE_ID)
        .select();

    if (error) {
        console.error('Update Error:', error);
    } else {
        console.log('Update Success!');
        let returnedContent = data[0].content;
        if (typeof returnedContent === 'string') returnedContent = JSON.parse(returnedContent);
        console.log('Verified Hero in DB:', returnedContent.sections.find(s => s.id === 'hero')?.props.image);
    }
}

forceUpdate();
