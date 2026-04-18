import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfzuevsyegqbdlttmloa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmenVldnN5ZWdxYmRsdHRtbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzQwNDAsImV4cCI6MjA5MDYxMDA0MH0.3nv_Wirt8oaifiJdSkbG4ZaXMCTyN0ZefOti5dkz6ec';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Checking for team page...');
  const { data: existing, error: fetchError } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', 'team')
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching:', fetchError);
    return;
  }

  const teamData = {
    slug: 'team',
    title: 'Đội ngũ',
    excerpt: 'Đội ngũ chuyên gia giàu kinh nghiệm của Tổng công ty Kỹ thuật lạnh Việt Nam (VRC)',
    is_active: true,
    content: JSON.stringify({
      sections: [
        {
          id: 'team-hero-' + Date.now(),
          type: 'team_hero',
          props: {
            title: 'Đội ngũ',
            subtitle: 'Chúng tôi là tập thể chuyên nghiệp, thân thiện và luôn sẵn sàng hỗ trợ khách hàng.'
          }
        },
        {
          id: 'team-grid-' + Date.now(),
          type: 'team_grid',
          props: {
            title: 'Đội ngũ nhân sự',
            description: 'Gặp gỡ những chuyên gia của chúng tôi'
          }
        }
      ]
    })
  };

  if (existing) {
    console.log('Team page exists (ID:', existing.id, '). Updating...');
    const { error: updateError } = await supabase
      .from('static_pages')
      .update(teamData)
      .eq('id', existing.id);
    
    if (updateError) console.error('Update error:', updateError);
    else console.log('Update successful!');
  } else {
    console.log('Team page missing. Inserting...');
    const { error: insertError } = await supabase
      .from('static_pages')
      .insert(teamData);
    
    if (insertError) console.error('Insert error:', insertError);
    else console.log('Insert successful!');
  }

  // Final check
  const { data: allPages } = await supabase.from('static_pages').select('slug, title');
  console.log('Current static pages in DB:');
  allPages.forEach(p => console.log(`- ${p.slug}: ${p.title}`));
}

run();
