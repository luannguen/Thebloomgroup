import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
 
const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});
 
const companyName = "Thebloomgroup";
const contactEmail = "info@thebloomgroup.vn";
const contactPhone = "+84 775 842 789";
const contactHotline = "+84 981 789 248";
 
const contactAddressVi = `Thebloomgroup
 
Trụ sở chính: Tầng 14, Tòa nhà HM Town, 412 Nguyễn Thị Minh Khai, Phường Bàn Cờ, Quận 3, TP.HCM
Điện thoại: +84 775 842 789 
Email: info@thebloomgroup.vn
 
Văn phòng Thủ Đức: 59 Bis, Đường số 2, Phường Trường Thọ, TP. Thủ Đức, TP.HCM
Điện thoại: +84 384 898 284 
 
Văn phòng Hà Nội: BT1 Đường Phạm Văn Đồng, Quận Bắc Từ Liêm, Hà Nội
Điện thoại: +84 705 789 345
 
Trung tâm Chăm sóc Khách hàng: +84 981 789 248`;
 
const contactAddressEn = `Thebloomgroup
 
Head Office: FL.14 HM Town Building, 412 Nguyen Thi Minh Khai St., Ban Co Ward, District 3, HCMC
Phone: +84 775 842 789 
Email: info@thebloomgroup.vn
 
Thu Duc Office: 59 Bis, Road No. 2, Thu Duc Ward, HCMC
Phone: +84 384 898 284 
 
Hanoi Office: BT1 Pham Van Dong St., Bac Tu Liem, Ha Noi
Phone: +84 705 789 345
 
Customer Care Center: +84 981 789 248`;
 
const copyrightVi = `© 2026 Thebloomgroup. Bảo lưu mọi quyền.`;
const copyrightEn = `© 2026 Thebloomgroup. All rights reserved.`;
 
async function updateInfo() {
  try {
    await client.connect();
    console.log('Connected to Database');
 
    const settings = [
      { key: 'company_name', value: companyName },
      { key: 'contact_email', value: contactEmail },
      { key: 'contact_phone', value: contactPhone },
      { key: 'contact_hotline', value: contactHotline },
      { key: 'contact_address', value: contactAddressVi },
      { key: 'contact_address_en', value: contactAddressEn },
      { key: 'copyright_text', value: copyrightVi },
      { key: 'copyright_text_en', value: copyrightEn },
    ];
 
    for (const s of settings) {
      await client.query(
        'INSERT INTO public.site_settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
        [s.key, s.value]
      );
    }
    console.log('Updated site_settings table');
 
    // Update company name in static_pages content
    // We replace "VIETVINH CORPORATION" and its variations
    const nameReplacements = [
        "VIETVINH INDUSTRIES CORPORATION",
        "VIETVINH CORPORATION",
        "Viet Vinh Corporation",
        "VietVinh Corporation",
        "Việt Vinh Corporation",
        "VVC"
    ];
 
    for (const oldName of nameReplacements) {
        // Use regex for case insensitive and global replacement in the content JSON string
        // We'll fetch all pages, update locally and save back
        const { rows: pages } = await client.query('SELECT id, content FROM public.static_pages');
        
        for (const page of pages) {
            if (page.content && page.content.includes(oldName)) {
                const newContent = page.content.split(oldName).join(companyName);
                await client.query(
                    'UPDATE public.static_pages SET content = $1 WHERE id = $2',
                    [newContent, page.id]
                );
            }
        }
    }
    console.log('Updated static_pages content branding');
 
    console.log('All company information updates completed successfully!');
  } catch (err) {
    console.error('Update failed:', err);
  } finally {
    await client.end();
  }
}
 
updateInfo();
