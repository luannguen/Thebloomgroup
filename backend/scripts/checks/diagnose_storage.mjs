import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://akryfqelpljvrydxftxc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorage() {
  console.log('--- Supabase Storage Health Check ---');
  
  // 1. List Buckets (Optional, might fail for anon key)
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
       console.log('⚠️ Could not list all buckets (expected for anon key):', bucketError.message);
    } else {
       console.log('✅ Buckets found:', buckets.map(b => b.name));
    }
  } catch (e) {
    console.log('⚠️ Error in listBuckets catch');
  }
  
  // 2. Try to list files in 'media' bucket directly
  console.log('Trying to list files in "media" bucket directly...');
  const { data: files, error: fileError } = await supabase.storage.from('media').list();
  if (fileError) {
    console.error('❌ Error listing files in "media":', fileError);
  } else {
    console.log(`✅ Files in "media" (${files.length}):`, files.slice(0, 5).map(f => f.name));
  }
}

checkStorage();
