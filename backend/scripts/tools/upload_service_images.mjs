import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imagesToUpload = [
  { name: 'serv_design.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\serv_design_consultancy_1775735511667.png' }
];

async function uploadImages() {
  console.log('🚀 Uploading additional service images...');
  for (const img of imagesToUpload) {
    try {
      if (!fs.existsSync(img.path)) continue;
      const fileBuffer = fs.readFileSync(img.path);
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`showcase/${img.name}`, fileBuffer, { contentType: 'image/png', upsert: true });
        
      if (error) {
        console.error(`❌ Lỗi ${img.name}:`, error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`showcase/${img.name}`);
        console.log(`✅ ${img.name} -> ${publicUrl}`);
      }
    } catch (err) { console.error(err.message); }
  }
}

uploadImages();
