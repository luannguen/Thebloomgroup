import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../../.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key missing in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkPages() {
  const slugs = [
    'he-thong-lanh',
    'cong-nghe-bao-quan-ca',
    'cap-dong-nhanh-iqf',
    'phong-chin-chuoi-tieu-chuan',
    'ham-dong-gio-cong-suat-lon'
  ];

  const { data, error } = await supabase
    .from('static_pages')
    .select('id, slug, title')
    .in('slug', slugs);

  if (error) {
    console.error('Error fetching pages:', error);
    return;
  }

  console.log('--- Existing Static Pages ---');
  data.forEach(page => {
    console.log(`- ${page.title} (${page.slug}) [ID: ${page.id}]`);
  });

  const missing = slugs.filter(s => !data.some(p => p.slug === s));
  console.log('\n--- Missing Slugs ---');
  missing.forEach(m => console.log(`- ${m}`));
}

checkPages();
