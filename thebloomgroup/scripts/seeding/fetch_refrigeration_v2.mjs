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
    
    let content = data.content;
    if (typeof content === 'string') {
        try {
            content = JSON.parse(content);
        } catch (e) {
            console.error('Failed to parse content as JSON');
        }
    }
    
    fs.writeFileSync('refrigeration_content_verified.json', JSON.stringify(content, null, 2));
    console.log('Saved to refrigeration_content_verified.json');
    console.log('Hero Image:', content.sections.find(s => s.id === 'hero')?.props.image);
}

fetchPage();
