import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ Missing DATABASE_URL in .env');
  process.exit(1);
}

const client = new pg.Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });

async function setAdminRole() {
  await client.connect();
  console.log('🔄 Setting admin role for admin@vrc.com.vn...');

  // Check if the user exists in public.users
  const check = await client.query("SELECT id, role FROM public.users WHERE email = 'admin@vrc.com.vn'");
  
  if (check.rows.length === 0) {
    // User might not be synced yet — insert directly
    const authCheck = await client.query("SELECT id FROM auth.users WHERE email = 'admin@vrc.com.vn'");
    if (authCheck.rows.length === 0) {
      console.error('❌ Admin user not found in auth.users. Run createAdmin.mjs first.');
      return;
    }
    
    const userId = authCheck.rows[0].id;
    await client.query(
      "INSERT INTO public.users (id, email, full_name, role) VALUES ($1, 'admin@vrc.com.vn', 'VRC Administrator', 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin', full_name = 'VRC Administrator'",
      [userId]
    );
    console.log('✅ Admin user inserted into public.users with admin role!');
  } else {
    // User exists, update role
    await client.query("UPDATE public.users SET role = 'admin', full_name = 'VRC Administrator' WHERE email = 'admin@vrc.com.vn'");
    console.log(`✅ Updated role from '${check.rows[0].role}' to 'admin'!`);
  }

  // Also confirm the email in auth.users so login works immediately
  await client.query("UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@vrc.com.vn' AND email_confirmed_at IS NULL");
  console.log('✅ Email confirmed for admin@vrc.com.vn');

  await client.end();
  console.log('\n🎉 Done! Admin can now login at the backend dashboard.');
  console.log('📧 Email:    admin@vrc.com.vn');
  console.log('🔑 Password: Admin@123456');
}

setAdminRole().catch(err => { console.error(err); process.exit(1); });
