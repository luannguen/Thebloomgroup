import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const PAGE_ID = 'e543f587-4e93-4c0c-bc2a-1dd2ef3a7feb';

async function fetchPage() {
    const { data, error } = await supabase
        .from('static_pages')
        .select('content')
        .eq('id', PAGE_ID)
        .single();
    
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    fs.writeFileSync('refrigeration_content.json', JSON.stringify(data.content, null, 2));
    console.log('Saved to refrigeration_content.json');
}

fetchPage();
