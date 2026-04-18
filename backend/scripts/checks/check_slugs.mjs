import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listSlugs() {
    const { data, error } = await supabase
        .from('static_pages')
        .select('slug, title');
    
    if (error) {
        console.error('Error fetching slugs:', error);
        return;
    }
    
    console.log('Available Static Pages Slugs:');
    console.table(data);
}

listSlugs();
