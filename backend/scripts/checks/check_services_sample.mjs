import { supabase } from './src/lib/supabase.js';

async function checkSchema() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching services:', error);
    return;
  }

  console.log('Sample service record:', JSON.stringify(data[0], null, 2));
}

checkSchema();
