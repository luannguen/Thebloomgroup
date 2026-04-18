import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase env vars');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const imagesToUpload = [
  { name: 'mep_electrical.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_electrical_substation_1775733041424.png' },
  { name: 'mep_hvac.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_hvac_chiller_1775733055223.png' },
  { name: 'mep_utility.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_process_utility_1775733070901.png' },
  { name: 'mep_firefighting.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_firefighting_plumbing_1775733088175.png' },
  { name: 'mep_cleanroom.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_cleanroom_iso_1775733101997.png' },
  { name: 'mep_bms.png', path: 'C:\\Users\\09125\\.gemini\\antigravity\\brain\\d02d9720-eb4f-456d-93af-ee531fc6ebf4\\mep_bms_dashboard_control_1775733115935.png' }
];

async function uploadImages() {
  console.log('🚀 Khởi động quá trình upload ảnh MEP...');
  
  for (const img of imagesToUpload) {
    try {
      if (!fs.existsSync(img.path)) {
        console.error(`❌ Không tìm thấy file: ${img.path}`);
        continue;
      }
      
      const fileBuffer = fs.readFileSync(img.path);
      const { data, error } = await supabase.storage
        .from('media')
        .upload(`mep/${img.name}`, fileBuffer, {
          contentType: 'image/png',
          upsert: true
        });
        
      if (error) {
        console.error(`❌ Lỗi upload ${img.name}:`, error.message);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(`mep/${img.name}`);
        console.log(`✅ Upload thành công ${img.name}. URL: ${publicUrl}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi hệ thống khi xử lý ${img.name}:`, err.message);
    }
  }
}

uploadImages();
