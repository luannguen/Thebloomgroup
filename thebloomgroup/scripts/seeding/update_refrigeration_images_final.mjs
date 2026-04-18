import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const PAGE_ID = 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb';

async function updatePageImages() {
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

  console.log('Original sections:', content.sections.map(s => s.id));

  content.sections = content.sections.map(section => {
    console.log(`Processing section: ${section.id} (${section.type})`);
    
    // Hero Section
    if (section.id === 'hero' || section.type === 'hero') {
        console.log('Update Hero Image');
        section.props.image_url = '/images/hero_industrial.png';
    }
    
    // Intro/Features Section
    if (section.id === 'intro' || section.type === 'features') {
        console.log('Update Feature Icons');
        if (section.props && Array.isArray(section.props.items)) {
            section.props.items = section.props.items.map(item => {
                if (item.id === 'f1') item.icon_image = '/images/icon_eco.png';
                if (item.id === 'f2') item.icon_image = '/images/icon_durable.png';
                if (item.id === 'f3') item.icon_image = '/images/icon_smart.png';
                return item;
            });
        } else {
            console.warn('Features section has no items array');
        }
    }

    // Media Sections for Products
    if (section.type === 'media_section') {
        if (section.id === 'tu-lanh') {
            console.log('Update Tủ Lạnh Image');
            section.props.image = '/images/refrigerator_display.png';
        }
        if (section.id === 'kho-lanh') {
            console.log('Update Kho Lạnh Image');
            section.props.image = '/images/cold_warehouse.png';
        }
        if (section.id === 'cap-dong') {
            console.log('Update Cấp Đông Image');
            section.props.image = '/images/iqf_system.png';
        }
    }

    return section;
  });

  console.log('Update page in database by ID...');
  const { data: result, error: updateError } = await supabase
    .from('static_pages')
    .update({ content: content })
    .eq('id', PAGE_ID)
    .select();

  if (updateError) {
    console.error('Error updating page:', updateError);
  } else {
    const updatedContent = result?.[0]?.content;
    const finalSections = typeof updatedContent === 'string' ? JSON.parse(updatedContent).sections : updatedContent.sections;
    console.log('VERIFY UPDATED CONTENT:');
    finalSections.forEach(s => {
        console.log(`- ${s.id}: ${s.props.image || s.props.image_url || 'NONE'}`);
    });
    console.log('SUCCESS: Page update verified!');
  }
}

updatePageImages();
