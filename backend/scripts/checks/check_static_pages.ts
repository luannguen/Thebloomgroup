import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Query a single row or use an RPC if available to check columns
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Data sample:", data);
    if (data && data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("Table is empty but exists.");
      // We can try to get the column definitions via information_schema if we had postgres access
    }
  }
}

checkSchema();
