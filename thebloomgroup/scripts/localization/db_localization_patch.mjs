import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfzuevsyegqbdlttmloa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmenVldnN5ZWdxYmRsdHRtbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzQwNDAsImV4cCI6MjA5MDYxMDA0MH0.3nv_Wirt8oaifiJdSkbG4ZaXMCTyN0ZefOti5dkz6ec';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const localizedCopyrights = {
  'vi': '© 2026 VIETVINH INDUSTRIES CORPORATION. Bảo lưu mọi quyền.',
  'en': '© 2026 VIETVINH INDUSTRIES CORPORATION. All rights reserved.',
  'de': '© 2026 VIETVINH INDUSTRIES CORPORATION. Alle Rechte vorbehalten.',
  'ja': '© 2026 VIETVINH INDUSTRIES CORPORATION. 全著作権所有。',
  'zh': '© 2026 VIETVINH INDUSTRIES CORPORATION. 版权所有。',
  'fr': '© 2026 VIETVINH INDUSTRIES CORPORATION. Tous droits réservés.',
  'ru': '© 2026 VIETVINH INDUSTRIES CORPORATION. Все права защищены.',
  'ko': '© 2026 VIETVINH INDUSTRIES CORPORATION. 모든 권리 보유.',
  'sr': '© 2026 VIETVINH INDUSTRIES CORPORATION. Sva prava zadržana.',
};

async function patchDatabase() {
  console.log('Starting DB Perfect Patch...');
  
  // 1. Update master copyright
  await supabase
    .from('site_settings')
    .update({ value: localizedCopyrights['vi'], updated_at: new Date().toISOString() })
    .eq('key', 'copyright_text');

  // 2. Update language specific ones
  for (const [lang, text] of Object.entries(localizedCopyrights)) {
    const key = lang === 'vi' ? 'copyright_text' : `copyright_text_${lang}`;
    const { error } = await supabase
      .from('site_settings')
      .update({ value: text, updated_at: new Date().toISOString() })
      .eq('key', key);
    
    if (error) console.error(`Error updating ${key}:`, error);
    else console.log(`Successfully perfected DB entry for ${key}`);
  }

  console.log('DB Perfect Patch Finished.');
}

patchDatabase();
