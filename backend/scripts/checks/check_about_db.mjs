import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAboutPage() {
    const { data, error } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', 'about-us')
        .single();
    
    if (error) {
        console.error('Error fetching about-us page:', error);
        return;
    }
    
    console.log('Current About Us Content:');
    console.log(JSON.stringify(data.content_json, null, 2));
}

checkAboutPage();
