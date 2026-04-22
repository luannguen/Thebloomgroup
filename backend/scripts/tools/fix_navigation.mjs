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

async function fixNavigation() {
    console.log('Fixing navigation items...');
    
    // 1. Fix "Giới thiệu" slug in header
    const { error: err1 } = await supabase
        .from('navigation')
        .update({ path: '/about-us' })
        .eq('label', 'Giới thiệu')
        .eq('position', 'header');
    
    if (err1) console.error('Error updating Giới thiệu:', err1);
    else console.log('Updated Giới thiệu path to /about-us');

    // 2. Fix "Về VVC" label in footer
    const { error: err2 } = await supabase
        .from('navigation')
        .update({ label: 'Về Thebloomgroup' })
        .eq('label', 'Về VVC');
    
    if (err2) console.error('Error updating Về VVC:', err2);
    else console.log('Updated Về VVC to Về Thebloomgroup');

    // 3. Fix "Trang chủ" path
    const { error: err3 } = await supabase
        .from('navigation')
        .update({ path: '/' })
        .eq('label', 'Trang chủ')
        .eq('path', '/home_v2');
    
    if (err3) console.error('Error updating Trang chủ:', err3);
    else console.log('Updated Trang chủ path to /');

    console.log('Navigation fix completed.');
}

fixNavigation();
