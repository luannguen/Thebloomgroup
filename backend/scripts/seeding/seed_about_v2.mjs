import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../thebloomgroup/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const aboutV2Content = {
  sections: [
    {
      id: 'hero-' + Date.now(),
      type: 'about_v2_hero',
      props: { 
        title: "About Us", 
        backgroundImage: "/assets/about-v2/banner.jpg" 
      }
    },
    {
      id: 'intro-' + Date.now(),
      type: 'about_v2_intro',
      props: {
        title: "THUONG THIEN TECHNOLOGIES CO. LTD (TTT)",
        description: "TTT has been in collaboration with Solar Turbines since last 20 year to provide Vietnam customers with the highest quality Gas Turbines, Generators, Compressors and Service Solutions within Oil & Gas and Electricity Power Generation industry.",
        image: "/assets/about-v2/ttt-logo.svg",
        backgroundImage: "/assets/about-v2/intro-bg.jpg"
      }
    },
    {
      id: 'vision-' + Date.now(),
      type: 'about_v2_accordion',
      props: {
        vTitle: "OUR VISION",
        vContent: "Become the most Valued Business Partner to the Clients and Principals in Vietnam O&G, Energy and Power Market.",
        mTitle: "OUR MISSION",
        mContent: "Provide the highest standardized products with the best quality services to our clients.",
        cTitle: "CORE VALUES",
        cContent: "<ul><li><strong>INTEGRITY</strong>: Probity, righteous and law abiding attitudes – The company’s greatest value.</li><li><strong>CUSTOMER CARE</strong>: We care about you and your business.</li><li><strong>TRANSPARENCY</strong>: Conducting honesty, straightforwardness and openness in all matters – the company’s most valuable asset.</li></ul>",
        sideIcon: "/assets/about-v2/team-work-svg.svg"
      }
    },
    {
      id: 'timeline-' + Date.now(),
      type: 'about_v2_timeline',
      props: {
        title: "THE STORY OF SUCCESS",
        milestones: [
          { year: "2021 & Above", title: "Sustainable Growth", desc: "Continue to keep sustainable growth and Continuous Improvement.", logo: "/assets/about-v2/ttt-logo.svg" },
          { year: "2016", title: "Independence", desc: "TTT was founded from the Solar Turbines Sales organization, completely operating independently from TTE.", logo: "/assets/about-v2/ttt-logo.svg" },
          { year: "2000", title: "Solar Partnership", desc: "TTE has been appointed as the local partner of Solar Turbines. The Solar Turbines Sales Department was organized within TTE to support Solar Turbines local business and customers", logo: "/assets/about-v2/logo-pvn.jpg" },
          { year: "1993", title: "Foundation", desc: "Toan Thang Engineering Corporation (TTE) was established.", logo: "/assets/about-v2/logo-pvn.jpg" }
        ]
      }
    },
    {
      id: 'locations-' + Date.now(),
      type: 'about_v2_location',
      props: {
        title: "Locations",
        locations: [
          { 
             subTitle: "THUONG THIEN",
             city: "HEAD OFFICE", 
             address: "11B Nguyen Binh Khiem St, Sai Gon Ward, Ho Chi Minh City",
             phone: "+84.28.3911 1821",
             email: "support@thuongthien.vn"
          },
          { 
             subTitle: "VUNG TAU",
             city: "WORKSHOP (ASP)", 
             address: "Road No.12, Dong Xuyen IZ, Rach Dua Ward, Ho Chi Minh City",
             phone: "+84.64. 352 2219",
             email: "tts@toanthang.vn"
          },
          { 
             subTitle: "QUANG NGAI",
             city: "WORKSHOP (CSC)", 
             address: "Tuyet Diem 3 Hamlet, Van Tuong Commune, Quang Ngai Province",
             phone: "+84.907 977 840",
             email: "technical@thuongthien.vn"
          }
        ]
      }
    }
  ]
};

async function seedAboutV2() {
  console.log('Seeding About Us V2 page...');
  
  // First, ensure the page exists or create it
  const { data: existingPage, error: fetchError } = await supabase
    .from('static_pages')
    .select('id')
    .eq('slug', 'about-us-v2')
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching page:', fetchError);
    return;
  }

  if (existingPage) {
    console.log('Skipping about-us-v2 seeding as page already exists in database.');
  } else {
    console.log('Creating new about-us-v2 page...');
    const { error: insertError } = await supabase
      .from('static_pages')
      .insert({
        content: JSON.stringify(aboutV2Content),
        title: 'About Us V2',
        slug: 'about-us-v2',
        is_active: true,
        updated_at: new Date()
      });

    if (insertError) {
      console.error('Error inserting page:', insertError);
    } else {
      console.log('Successfully created About Us V2 page');
    }
  }
}

seedAboutV2();
