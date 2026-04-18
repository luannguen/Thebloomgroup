import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rfzuevsyegqbdlttmloa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmenVldnN5ZWdxYmRsdHRtbG9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMzQwNDAsImV4cCI6MjA5MDYxMDA0MH0.3nv_Wirt8oaifiJdSkbG4ZaXMCTyN0ZefOti5dkz6ec';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('--- Force Sync Team Page ---');
    
    // 1. Check if slug exists
    const { data: existing } = await supabase
        .from('static_pages')
        .select('*')
        .eq('slug', 'team')
        .maybeSingle();

    const teamData = {
        slug: 'team',
        title: 'Đội ngũ',
        excerpt: 'Đội ngũ chuyên gia giàu kinh nghiệm của Tổng công ty Kỹ thuật lạnh Việt Nam (VRC)',
        is_active: true,
        content: JSON.stringify({
            sections: [
                {
                    id: 'team_hero_block_1',
                    type: 'team_hero',
                    props: {
                        title: 'Đội ngũ',
                        subtitle: 'Chúng tôi là tập thể chuyên nghiệp, thân thiện và luôn sẵn sàng hỗ trợ khách hàng.'
                    }
                },
                {
                    id: 'team_grid_block_1',
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
        console.log(`Page with slug 'team' exists (ID: ${existing.id}). Force updating...`);
        const { error } = await supabase
            .from('static_pages')
            .update(teamData)
            .eq('id', existing.id);
        
        if (error) {
            console.error('Update ERROR:', error);
        } else {
            console.log('Update SUCCESS!');
        }
    } else {
        console.log(`Page with slug 'team' NOT found. Inserting new record...`);
        const { error } = await supabase
            .from('static_pages')
            .insert(teamData);
        
        if (error) {
            console.error('Insert ERROR:', error);
        } else {
            console.log('Insert SUCCESS!');
        }
    }

    // LIST ALL SLUGS to verify
    const { data: all } = await supabase.from('static_pages').select('slug, title');
    console.log('\n--- Current Static Pages ---');
    all.forEach(p => console.log(`[SLUG: ${p.slug}] - [TITLE: ${p.title}]`));
}

run();
