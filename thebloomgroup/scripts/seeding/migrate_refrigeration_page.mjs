import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('Fetching he-thong-lanh page content...');
  const { data: page, error: fetchError } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', 'he-thong-lanh')
    .single();

  if (fetchError) {
    console.error('Error fetching page:', fetchError);
    return;
  }

  let content = page.content;
  if (typeof content === 'string') {
    try {
      content = JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse content string:', e);
      return;
    }
  }

  if (!content || !content.sections) {
    console.log('No sections found to migrate. Content structure:', content);
    return;
  }

  const newSections = content.sections.map(section => {
    // If it's a rich_text block, check if it contains a large image
    if (section.type === 'rich_text' || section.type === 'rich-text') {
      const html = section.props?.content || '';
      
      // Look for <img> tags
      const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        const imgSrc = imgMatch[1];
        
        // Extract title (h2)
        const titleMatch = html.match(/<h2[^>]*>(.*?)<\/h2>/);
        const title = titleMatch ? titleMatch[1] : 'Hệ Thống Lạnh';
        
        // Remove <img> and <h2> from content to get description
        const description = html
          .replace(/<h2[^>]*>.*?<\/h2>/, '')
          .replace(/<div[^>]*class="[^"]*mb-10[^"]*"[^>]*>.*?<\/div>/s, '') // Remove image wrapper if any
          .replace(/<img[^>]*>/, '')
          .trim();

        console.log(`Migrating rich_text section "${title}" to media_section...`);
        
        return {
          ...section,
          type: 'media_section',
          props: {
            title: title,
            description: description,
            image: imgSrc,
            layout: 'image-top', // Default to top for these existing large images
            imageWidth: 100,
            bgColor: 'white',
            padding: 'medium'
          }
        };
      }
    }
    return section;
  });

  console.log('Updating page content with ID:', page.id);
  const updatedContent = { ...content, sections: newSections };
  
  // If the original was a string, maybe we should keep it as a string?
  // Actually, Supabase jsonb should take the object.
  
  const { data: updateData, error: updateError, count } = await supabase
    .from('static_pages')
    .update({ content: updatedContent })
    .eq('id', page.id)
    .select();

  if (updateError) {
    console.error('Error updating page:', updateError);
  } else if (!updateData || updateData.length === 0) {
    console.error('No rows updated. Check row-level security (RLS) or ID.');
  } else {
    console.log('Update result data:', JSON.stringify(updateData[0].content.sections.map(s => s.type)));
    console.log('Migration successful!');
  }
}

migrate();
