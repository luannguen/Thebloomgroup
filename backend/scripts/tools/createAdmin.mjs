import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Try service role key first, fall back to anon key
const keyToUse = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !keyToUse) {
  console.error('❌ Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY/VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, keyToUse, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});

const ADMIN_EMAIL = 'admin@vrc.com.vn';
const ADMIN_PASSWORD = 'Admin@123456';

async function createAdminUser() {
  console.log('🔄 Creating admin user...');

  // Step 1: Sign up the admin user via Supabase Auth
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    options: {
      data: {
        full_name: 'VRC Administrator',
        role: 'admin',
      }
    }
  });

  if (signUpError) {
    // Check if user already exists
    if (signUpError.message.includes('already registered') || signUpError.message.includes('already exists')) {
      console.log('⚠️  Admin user already exists. Trying to update role...');
      
      // Try to sign in to get the user ID
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (loginError) {
        console.error('❌ Cannot login as existing admin:', loginError.message);
        console.log('💡 If the password is wrong, reset it from Supabase Dashboard.');
        return;
      }

      if (loginData.user) {
        // Update role in public.users table
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: loginData.user.id,
            email: ADMIN_EMAIL,
            full_name: 'VRC Administrator',
            role: 'admin',
          }, { onConflict: 'id' });

        if (updateError) {
          console.error('❌ Failed to update admin role:', updateError.message);
        } else {
          console.log('✅ Admin role updated successfully!');
        }
      }
      return;
    }
    console.error('❌ Sign up failed:', signUpError.message);
    return;
  }

  if (!signUpData.user) {
    console.error('❌ No user returned from signUp');
    return;
  }

  console.log('✅ Admin user created in auth.users:', signUpData.user.id);

  // Step 2: The trigger handle_new_user() should auto-create the public.users record.
  // But let's make sure the role is set to 'admin'
  // Wait a moment for the trigger to fire
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { error: updateError } = await supabase
    .from('users')
    .upsert({
      id: signUpData.user.id,
      email: ADMIN_EMAIL,
      full_name: 'VRC Administrator',
      role: 'admin',
    }, { onConflict: 'id' });

  if (updateError) {
    console.error('⚠️  Could not set admin role in public.users:', updateError.message);
    console.log('💡 You may need to set the role manually in Supabase Dashboard.');
  } else {
    console.log('✅ Admin role set in public.users table.');
  }

  console.log('\n========================================');
  console.log('🎉 Admin account created successfully!');
  console.log('========================================');
  console.log(`📧 Email:    ${ADMIN_EMAIL}`);
  console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
  console.log('========================================');
  console.log('⚠️  NOTE: If email confirmation is enabled in Supabase,');
  console.log('   you need to confirm the email first or disable');
  console.log('   "Confirm email" in Supabase Dashboard > Auth > Settings.');
  console.log('========================================');
}

createAdminUser()
  .catch(console.error)
  .finally(() => process.exit(0));
