import { createClient } from '@supabase/supabase-client';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkTables() {
    const { data, error } = await supabase.from('partners').select('*').limit(1);
    if (error) {
        console.log('Table "partners" does not exist or error:', error.message);
    } else {
        console.log('Table "partners" exists.');
    }
}

checkTables();
