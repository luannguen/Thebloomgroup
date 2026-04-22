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

const companyName = "Thebloomgroup";
const siteAcronym = "THEBLOOM";
const contactEmail = "info@thebloomgroup.vn";
const contactPhone = "+84 775 842 789";

async function rebrand() {
    console.log('--- Starting Global Rebranding ---');

    // 1. Update site_settings
    console.log('Updating site_settings...');
    const settings = [
        { key: 'site_name', value: companyName },
        { key: 'site_acronym', value: siteAcronym },
        { key: 'company_name', value: companyName },
        { key: 'contact_email', value: contactEmail },
        { key: 'contact_phone', value: contactPhone },
        { key: 'copyright_text', value: `© 2026 ${companyName}. Bảo lưu mọi quyền.` },
        { key: 'copyright_text_en', value: `© 2026 ${companyName}. All rights reserved.` }
    ];

    for (const s of settings) {
        await supabase
            .from('site_settings')
            .upsert({ key: s.key, value: s.value }, { onConflict: 'key' });
    }

    // 2. Rebrand static_pages content
    console.log('Rebranding static_pages content...');
    const { data: pages } = await supabase.from('static_pages').select('id, content, slug');
    
    const legacyNames = [
        "VIETVINH CORPORATION",
        "VIETVINH INDUSTRIES CORPORATION",
        "Viet Vinh Corporation",
        "Việt Vinh Corp",
        "VVC"
    ];

    for (const page of pages) {
        if (!page.content) continue;
        let newContent = page.content;
        let changed = false;

        for (const oldName of legacyNames) {
            if (newContent.includes(oldName)) {
                newContent = newContent.split(oldName).join(companyName);
                changed = true;
            }
        }

        if (changed) {
            console.log(`- Updating page: ${page.slug}`);
            await supabase.from('static_pages').update({ content: newContent }).eq('id', page.id);
        }
    }

    // 3. Fix navigation (again to be sure)
    console.log('Cleaning up navigation...');
    await supabase.from('navigation').update({ path: '/about-us' }).eq('path', '/about-us-v2');
    await supabase.from('navigation').update({ label: 'Về Thebloomgroup' }).eq('label', 'Về VVC');
    await supabase.from('navigation').update({ label: 'Giới thiệu Thebloomgroup' }).eq('label', 'Giới thiệu VVC');

    console.log('--- Rebranding Completed ---');
}

rebrand();
