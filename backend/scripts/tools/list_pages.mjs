import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../thebloomgroup/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function listPages() {
    try {
        console.log('--- Page Status Report ---');
        const { data: pages, error: pageError } = await supabase
            .from('static_pages')
            .select('slug, title, is_active, content')
            .order('slug');
        
        if (pageError) throw pageError;

        const pageSummary = pages.map(p => ({
            slug: p.slug,
            title: p.title,
            is_active: p.is_active,
            content_length: p.content ? p.content.length : 0,
            has_sections: p.content && p.content.includes('"sections":')
        }));
        
        console.table(pageSummary);
        
        console.log('\n--- Navigation Status Report ---');
        const { data: navItems, error: navError } = await supabase
            .from('navigation')
            .select('id, label, path, position, order_index')
            .order('position', { ascending: true })
            .order('order_index', { ascending: true });

        if (navError) throw navError;
        console.table(navItems);

    } catch (err) {
        console.error('Failed to list pages:', err);
    }
}

listPages();
