
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAboutPage() {
  console.log('Checking about-us-v2 page content...');
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'about-us-v2')
    .single();

  if (error) {
    console.error('Error fetching page:', error);
    return;
  }

  console.log('Page found:', data.title);
  console.log('Content JSON:', data.content);
  
  if (data.content) {
    try {
      const content = JSON.parse(data.content);
      console.log('Parsed Sections:', JSON.stringify(content.sections, null, 2));
    } catch (e) {
      console.error('Failed to parse content JSON');
    }
  }
}

checkAboutPage();
