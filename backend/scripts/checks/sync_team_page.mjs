import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manual env loading since path has spaces
const envPath = resolve('f:/code duan/vietvinhcorp/vrcfrontend/.env');
const envContent = readFileSync(envPath, 'utf8');
const env = Object.fromEntries(envContent.split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim())));

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncTeamPage() {
  const { data: existing } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', 'team')
    .single();

  if (existing) {
    console.log('Team page exists:', existing.title);
    if (existing.title !== 'Đội ngũ') {
      await supabase
        .from('static_pages')
        .update({ title: 'Đội ngũ' })
        .eq('slug', 'team');
      console.log('Renamed to Đội ngũ');
    }
  } else {
    // Create it if missing
    const { data: inserted, error } = await supabase
      .from('static_pages')
      .insert({
        slug: 'team',
        title: 'Đội ngũ',
        content: JSON.stringify({
          sections: [
            { id: 'hero-1', type: 'team_hero', props: { title: 'Đội ngũ', subtitle: 'Chúng tôi là tập thể chuyên nghiệp, thân thiện và luôn sẵn sàng hỗ trợ khách hàng.' } },
            { id: 'grid-1', type: 'team_grid', props: { title: 'Đội ngũ nhân sự', description: 'Gặp gỡ những chuyên gia của chúng tôi' } }
          ]
        }),
        is_active: true
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating page:', error);
    } else {
      console.log('Created Team page successfully:', inserted.id);
    }
  }
}

syncTeamPage();
