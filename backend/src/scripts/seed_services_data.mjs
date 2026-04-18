import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const { Client } = pg;

async function seed() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // 1. Seed Categories
        console.log('Seeding service categories...');
        const categories = [
            { name: 'Tư vấn & Thiết kế', slug: 'consulting-design', description: 'Dịch vụ tư vấn giải pháp và thiết kế hệ thống điện lạnh.' },
            { name: 'Cung cấp & Lắp đặt', slug: 'supply-installation', description: 'Cung cấp thiết bị chính hãng và lắp đặt chuyên nghiệp.' },
            { name: 'Bảo trì & Sửa chữa', slug: 'maintenance-repair', description: 'Dịch vụ bảo dưỡng định kỳ và sửa chữa sự cố 24/7.' }
        ];

        for (const cat of categories) {
            await client.query(`
                INSERT INTO public.service_categories (name, slug, description)
                VALUES ($1, $2, $3)
                ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
            `, [cat.name, cat.slug, cat.description]);
        }

        const catRes = await client.query("SELECT id, slug FROM public.service_categories");
        const catMap = Object.fromEntries(catRes.rows.map(r => [r.slug, r.id]));

        // 2. Seed Services
        console.log('Seeding services...');
        const services = [
            {
                title: 'Tư vấn giải pháp điện lạnh',
                slug: 'tu-van-giai-phap',
                description: 'Tư vấn thiết kế hệ thống điều hòa không khí và thông gió (HVAC) tối ưu cho mọi công trình.',
                icon: 'HelpCircle',
                category_slug: 'consulting-design'
            },
            {
                title: 'Thiết kế hệ thống kho lạnh',
                slug: 'thiet-ke-kho-lanh',
                description: 'Thiết kế kho lạnh bảo quản thực phẩm, dược phẩm đạt tiêu chuẩn quốc tế.',
                icon: 'FileCheck',
                category_slug: 'consulting-design'
            },
            {
                title: 'Lắp đặt điều hòa trung tâm',
                slug: 'lap-dat-dieu-hoa-trung-tam',
                description: 'Lắp đặt hệ thống VRV/VRF, Chiller chuyên nghiệp cho tòa nhà và nhà máy.',
                icon: 'Cog',
                category_slug: 'supply-installation'
            },
            {
                title: 'Bảo trì hệ thống định kỳ',
                slug: 'bao-tri-dinh-ky',
                description: 'Dịch vụ bảo trì, vệ sinh hệ thống định kỳ giúp kéo dài tuổi thọ và tiết kiệm điện năng.',
                icon: 'Clock',
                category_slug: 'maintenance-repair'
            },
            {
                title: 'Sửa chữa khẩn cấp 24/7',
                slug: 'sua-chua-khan-cap',
                description: 'Đội ngũ kỹ thuật sẵn sàng hỗ trợ sửa chữa các sự cố hệ thống lạnh mọi lúc, mọi nơi.',
                icon: 'Wrench',
                category_slug: 'maintenance-repair'
            }
        ];

        for (const s of services) {
            await client.query(`
                INSERT INTO public.services (title, slug, description, icon, category_id)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (slug) DO UPDATE SET 
                    title = EXCLUDED.title, 
                    description = EXCLUDED.description,
                    icon = EXCLUDED.icon,
                    category_id = EXCLUDED.category_id
            `, [s.title, s.slug, s.description, s.icon, catMap[s.category_slug]]);
        }

        // 3. Seed "Services" page into static_pages
        console.log('Seeding services static page...');
        const servicesPageContent = {
            sections: [
                {
                    id: "hero-section",
                    type: "HeroBlock",
                    data: {
                        title: "Dịch vụ chuyên nghiệp",
                        description: "Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao từ tư vấn, lắp đặt đến bảo trì và sửa chữa.",
                        backgroundImage: "/assets/images/service-hero.jpg",
                        primaryButtonLabel: "Liên hệ tư vấn",
                        primaryButtonLink: "/contact",
                        secondaryButtonLabel: "Hỗ trợ kỹ thuật",
                        secondaryButtonLink: "/service-support"
                    }
                },
                {
                    id: "overview-section",
                    type: "ContentBlock",
                    data: {
                        title: "Dịch vụ toàn diện",
                        content: "Với hơn 20 năm kinh nghiệm trong lĩnh vực điện lạnh công nghiệp và dân dụng, VVC đã trở thành đối tác tin cậy của hàng nghìn khách hàng trên cả nước. Chúng tôi tự hào cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên viên được đào tạo bài bản.",
                        image: "/assets/images/service-overview.jpg",
                        features: [
                            "Đội ngũ kỹ sư giàu kinh nghiệm, được chứng nhận chuyên môn",
                            "Phục vụ 24/7 với thời gian phản hồi nhanh chóng",
                            "Trang thiết bị hiện đại, công nghệ tiên tiến",
                            "Cam kết chất lượng và bảo hành dài hạn"
                        ]
                    }
                }
            ]
        };

        await client.query(`
            INSERT INTO public.static_pages (slug, title, content, is_active)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (slug) DO UPDATE SET 
                title = EXCLUDED.title, 
                content = EXCLUDED.content,
                is_active = EXCLUDED.is_active
        `, ['services', 'Dịch vụ', JSON.stringify(servicesPageContent), true]);

        console.log('Seeding completed successfully');

    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await client.end();
    }
}

seed();
