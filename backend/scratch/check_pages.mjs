import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkPages() {
    const { data, error } = await supabase
        .from('static_pages')
        .select('slug, title, content');
    
    if (error) {
        console.error(error);
        return;
    }

    console.log('--- Static Pages ---');
    data.forEach(p => {
        console.log(`Slug: ${p.slug}`);
        console.log(`Title: ${p.title}`);
        try {
            const content = JSON.parse(p.content);
            console.log(`Sections count: ${content.sections?.length || 0}`);
            console.log(`Section types: ${content.sections?.map(s => s.type).join(', ')}`);
        } catch (e) {
            console.log(`Content is NOT JSON: ${p.content?.substring(0, 50)}...`);
        }
        console.log('-------------------');
    });
}

checkPages();
