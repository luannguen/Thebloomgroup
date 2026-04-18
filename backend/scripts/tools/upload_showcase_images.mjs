import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imagesToUpload = [
  { name: 'prod_compressor.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\prod_industrial_compressor_rack_1775734666642.png' },
  { name: 'prod_panel.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\prod_pu_sandwich_panel_detail_1775734682941.png' },
  { name: 'prod_door.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\prod_cold_storage_sliding_door_1775734696069.png' },
  { name: 'proj_factory.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\proj_seafood_factory_exterior_1775734709264.png' },
  { name: 'proj_hvac.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\proj_industrial_hvac_installation_1775734721666.png' },
  { name: 'proj_warehouse.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\proj_logistics_cold_storage_interior_1775734736781.png' }
];

async function uploadImages() {
  console.log('🚀 Uploading Product & Project images...');
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
