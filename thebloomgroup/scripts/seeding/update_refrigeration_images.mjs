import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function updatePageImages() {
  console.log('Fetching page he-thong-lanh...');
  const { data, error } = await supabase
    .from('static_pages')
    .select('content')
    .eq('slug', 'he-thong-lanh')
    .single();

  if (error || !data) {
    console.error('Error fetching page:', error);
    return;
  }

  let content = data.content;
  if (typeof content === 'string') content = JSON.parse(content);

  // Update image paths for MediaSections
  content.sections = content.sections.map(section => {
    if (section.id === 'hero' && section.type === 'hero') {
        section.props.image_url = '/images/hero_industrial.png';
    }
    
    if (section.id === 'intro' && section.type === 'features') {
        section.props.items = section.props.items.map(item => {
            if (item.id === 'f1') item.icon_image = '/images/icon_eco.png';
            if (item.id === 'f2') item.icon_image = '/images/icon_durable.png';
            if (item.id === 'f3') item.icon_image = '/images/icon_smart.png';
            return item;
        });
    }

    if (section.type === 'media_section') {
        if (section.id === 'tu-lanh') section.props.image = '/images/refrigerator_display.png';
        if (section.id === 'kho-lanh') section.props.image = '/images/cold_warehouse.png';
        if (section.id === 'cap-dong') section.props.image = '/images/iqf_system.png';
    }

    return section;
  });

  console.log('Update page in database...');
  const { data: result, error: updateError } = await supabase
    .from('static_pages')
    .update({ content: content })
    .eq('slug', 'he-thong-lanh')
    .select();

  if (updateError) {
    console.error('Error updating page:', updateError);
  } else {
    console.log('SUCCESS: Page updated!', JSON.stringify(result?.[0]?.content?.sections?.map(s => ({id: s.id, img: s.props.image || s.props.image_url})), null, 2));
  }
}

updatePageImages();
