import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const { Client } = pg;
const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const companyName = "Thebloomgroup";
const siteAcronym = "THEBLOOM";
const contactEmail = "info@thebloomgroup.vn";
const contactPhone = "+84 775 842 789";
const contactHotline = "+84 981 789 248";
const logoPath = "/images/logo-ttt.svg";

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

async function executeRebrand() {
    try {
        await client.connect();
        console.log('Connected to Database.');

        // 1. Update site_settings
        console.log('1. Updating site_settings...');
        const settings = [
            { key: 'company_name', value: companyName },
            { key: 'site_name', value: companyName },
            { key: 'site_acronym', value: siteAcronym },
            { key: 'site_title', value: `${companyName} - Giải pháp kỹ thuật nhiệt lạnh công nghiệp` },
            { key: 'site_title_en', value: `${companyName} - Leading Industrial Refrigeration Solutions in Vietnam` },
            { key: 'site_title_de', value: `${companyName} - Führende industrielle Kältelösungen in Vietnam` },
            { key: 'site_title_fr', value: `${companyName} - Solutions de réfrigération industrielle de pointe au Vietnam` },
            { key: 'site_title_ja', value: `${companyName} - ベトナムを代表する産業用冷凍ソリューション` },
            { key: 'site_title_ko', value: `${companyName} - 베트남 최고의 산업용 냉동 솔루션` },
            { key: 'site_title_zh', value: `${companyName} - 越南领先的工业制冷解决方案` },
            { key: 'site_title_ru', value: `${companyName} - Ведущие промышленные холодильные решения во Вьетнаме` },
            { key: 'site_title_hr', value: `${companyName} - Vodeća rješenja industrijskog hlađenja u Vijetnamu` },
            { key: 'site_title_sl', value: `${companyName} - Vodilne rešitve za industrijsko hlajenje v Vietnamu` },
            { key: 'site_title_sr', value: `${companyName} - Vodeća rešenja industrijskog hlađenja u Vijetnamu` },
            { key: 'site_description', value: 'Giải pháp điện lạnh toàn diện cho mọi công trình. Uy tín, Chất lượng, Hiệu quả.' },
            { key: 'site_keywords', value: 'điện lạnh, thebloomgroup, hvac, construction, cơ điện lạnh, bảo trì' },
            { key: 'og_site_name', value: companyName },
            { key: 'og_url', value: 'https://thebloomgroup.vn' },
            { key: 'site_url', value: 'https://thebloomgroup.vn/' },
            { key: 'site_logo', value: logoPath },
            { key: 'footer_logo', value: logoPath },
            { key: 'contact_email', value: contactEmail },
            { key: 'contact_phone', value: contactPhone },
            { key: 'contact_hotline', value: contactHotline },
            { key: 'contact_address', value: contactAddressVi },
            { key: 'contact_address_en', value: contactAddressEn },
            { key: 'copyright_text', value: `© 2026 ${companyName}. Bảo lưu mọi quyền.` },
            { key: 'copyright_text_en', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_de', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_fr', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_ja', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_ko', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_zh', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_ru', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_hr', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_sl', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'copyright_text_sr', value: `© 2026 ${companyName}. All rights reserved.` },
            { key: 'twitter_site', value: '@thebloomgroup' }
        ];

        for (const s of settings) {
            await client.query(
                `INSERT INTO public.site_settings (key, value) VALUES ($1, $2)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
                [s.key, s.value]
            );
        }
        console.log('✅ Site settings updated.');

        // 2. Navigation cleanup
        console.log('2. Updating navigation...');
        await client.query(`UPDATE public.navigation SET label = 'Về Thebloomgroup' WHERE label ILIKE '%về vvc%' OR label ILIKE '%về việt vinh%'`);
        await client.query(`UPDATE public.navigation SET label = 'Giới thiệu Thebloomgroup' WHERE label ILIKE '%giới thiệu vvc%'`);
        console.log('✅ Navigation updated.');

        // 3. String replacements for content across tables
        const legacyNames = [
            "VIETVINH INDUSTRIES CORPORATION",
            "VIETVINH CORPORATION",
            "Viet Vinh Corporation",
            "VietVinh Corporation",
            "VietVinhCorp",
            "Việt Vinh Corp",
            "Việt Vinh",
            "Viet Vinh",
            "Vietvinh",
            "VVC"
        ];

        console.log('3. Updating static_pages content and multi-language columns...');
        const { rows: pages } = await client.query('SELECT * FROM public.static_pages');
        for (const page of pages) {
            let updated = false;
            let newContent = page.content;
            let newTitle = page.title;
            let newExcerpt = page.excerpt;

            for (const oldName of legacyNames) {
                if (newContent && newContent.includes(oldName)) {
                    newContent = newContent.split(oldName).join(companyName);
                    updated = true;
                }
                if (newTitle && newTitle.includes(oldName)) {
                    newTitle = newTitle.split(oldName).join(companyName);
                    updated = true;
                }
                if (newExcerpt && newExcerpt.includes(oldName)) {
                    newExcerpt = newExcerpt.split(oldName).join(companyName);
                    updated = true;
                }
            }

            if (updated) {
                await client.query(
                    'UPDATE public.static_pages SET content = $1, title = $2, excerpt = $3 WHERE id = $4',
                    [newContent, newTitle, newExcerpt, page.id]
                );
            }
        }
        console.log('✅ Static pages content updated.');

        // 4. Update news, faqs, services
        console.log('4. Updating other tables (news, faqs, services)...');
        for (const oldName of legacyNames) {
            await client.query(`UPDATE public.news SET title = REPLACE(title, $1, $2), content = REPLACE(content, $1, $2) WHERE title LIKE '%' || $1 || '%' OR content LIKE '%' || $1 || '%'`, [oldName, companyName]);
            await client.query(`UPDATE public.faqs SET question = REPLACE(question, $1, $2), answer = REPLACE(answer, $1, $2) WHERE question LIKE '%' || $1 || '%' OR answer LIKE '%' || $1 || '%'`, [oldName, companyName]);
            await client.query(`UPDATE public.services SET title = REPLACE(title, $1, $2), description = REPLACE(description, $1, $2), content = REPLACE(content, $1, $2) WHERE title LIKE '%' || $1 || '%' OR description LIKE '%' || $1 || '%' OR content LIKE '%' || $1 || '%'`, [oldName, companyName]);
        }
        console.log('✅ News, faqs, services updated.');

        console.log('🎉 ALL REBRANDING COMPLETED SUCCESSFULLY!');
    } catch (err) {
        console.error('❌ Rebranding error:', err);
    } finally {
        await client.end();
    }
}

executeRebrand();
