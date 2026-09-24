import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function testLogin(email, password) {
  console.log(`Attempting login for ${email}...`);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(`❌ Login failed for ${email}:`, error.status, error.message);
    return false;
  }

  console.log(`✅ Login successful for ${email}! User ID: ${data.user?.id}`);
  return true;
}

async function run() {
  await testLogin('admin@vvc.com.vn', 'Admin@123456');
  await testLogin('admin@vrc.com.vn', 'Admin@123456');
}

run();
