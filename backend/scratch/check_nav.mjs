import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), 'backend/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNav() {
  const { data, error } = await supabase
    .from('navigation')
    .select('*')
    .ilike('label', '%Lạnh%');

  if (error) console.error(error);
  else console.log('Navigation for "Lạnh":', JSON.stringify(data, null, 2));

  const { data: allPages } = await supabase.from('static_pages').select('slug, title');
  console.log('All static pages:', allPages);
}

checkNav();
