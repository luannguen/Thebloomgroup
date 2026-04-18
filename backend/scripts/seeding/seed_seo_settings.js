import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const client = await pool.connect();
  try {
    // Add missing SEO & branding settings
    const newSettings = [
      { key: 'site_name', value: 'VRC', description: 'Tên ngắn website (hiển thị trên tab trình duyệt)' },
      { key: 'site_title', value: 'VRC - Tổng công ty kỹ thuật điện lạnh Việt Nam', description: 'Tiêu đề đầy đủ (SEO title)' },
      { key: 'site_description', value: 'Giải pháp điện lạnh toàn diện cho mọi công trình. Uy tín, Chất lượng, Hiệu quả.', description: 'Mô tả SEO (meta description)' },
      { key: 'site_keywords', value: 'điện lạnh, VRC, HVAC, cơ điện lạnh, kho lạnh, chiller, VRV, bảo trì điện lạnh', description: 'Từ khóa SEO (phân cách bằng dấu phẩy)' },
      { key: 'site_logo', value: '', description: 'URL logo website (file SVG/PNG)' },
      { key: 'favicon_url', value: '/assets/svg/logo.svg', description: 'URL favicon (hiển thị trên tab trình duyệt)' },
      { key: 'og_image_url', value: '', description: 'Ảnh mặc định khi chia sẻ link trên mạng xã hội (OG Image, khuyến nghị 1200x630px)' },
      { key: 'og_type', value: 'website', description: 'Loại trang (website, article...)' },
      { key: 'og_site_name', value: 'VRC', description: 'Tên website hiển thị trên Open Graph' },
      { key: 'og_url', value: 'https://vrc.com.vn', description: 'URL chính thức của website' },
      { key: 'twitter_card', value: 'summary_large_image', description: 'Loại Twitter Card (summary, summary_large_image)' },
      { key: 'twitter_site', value: '@vrcdienlanhvn', description: 'Twitter handle của tổ chức' },
      { key: 'copyright_text', value: '© 2025 VRC - Tổng công ty kỹ thuật điện lạnh Việt Nam. Tất cả quyền được bảo lưu.', description: 'Text bản quyền footer' },
      { key: 'contact_email', value: 'info@vrc.com.vn', description: 'Email liên hệ chính' },
      { key: 'contact_phone', value: '028 3833 3333', description: 'Số điện thoại liên hệ' },
      { key: 'contact_address', value: '123 Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh', description: 'Địa chỉ công ty' },
      { key: 'google_analytics_id', value: '', description: 'Google Analytics Tracking ID (GA4, ví dụ: G-XXXXXXXXXX)' },
      { key: 'header_scripts', value: '', description: 'Custom scripts chèn vào <head> (GTM, Analytics...)' },
      { key: 'footer_scripts', value: '', description: 'Custom scripts chèn trước </body> (chat widget, tracking...)' },
    ];

    for (const s of newSettings) {
      await client.query(
        `INSERT INTO site_settings (key, value, description) VALUES ($1, $2, $3)
         ON CONFLICT (key) DO UPDATE SET description = EXCLUDED.description`,
        [s.key, s.value, s.description]
      );
    }

    console.log('✅ SEO & branding settings synced');

    // Verify
    const res = await client.query('SELECT key, value, description FROM site_settings ORDER BY key');
    console.log('\n=== ALL SETTINGS ===');
    for (const r of res.rows) {
      console.log(`  ${r.key}: ${r.value ? r.value.substring(0, 60) + '...' : '(empty)'}`);
    }

  } finally {
    client.release();
    pool.end();
  }
}
run();
