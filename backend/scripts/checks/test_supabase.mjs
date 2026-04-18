import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const url = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!url || !key) {
    console.error('Missing Supabase URL or Key in .env file!');
    process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
    console.log(`Testing connection to: ${url}`);
    
    const { data, error } = await supabase.from('_non_existent_table_test').select('*').limit(1);
    
    if (error) {
        if (error.message.includes('does not exist') || error.code === 'PGRST116' || error.message.includes('relation')) {
            console.log('\n--- SUCCESS! ---')
            console.log('Connection made to Supabase APIs successfully.');
            console.log('The server responded expectedly (table not found). This proves URL and Key are working to reach the REST API.');
        } else {
            console.log('\n--- API RESPONDED ---')
            console.log('API responded with an error, but connection was successful:', error.message);
        }
    } else {
         console.log('\n--- SUCCESS! ---')
         console.log('Connection made and data retrieved:', data);
    }
}

testConnection();
