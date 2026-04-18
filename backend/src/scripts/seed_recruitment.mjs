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

        // 1. Create Static Page for Recruitment
        const recruitmentContent = JSON.stringify({
            sections: [
                {
                    id: 'hero-recruitment',
                    type: 'hero',
                    props: {
                        title: 'Gia nhập Viet Vinh Corp',
                        subtitle: 'Khởi đầu sự nghiệp vững chắc cùng đội ngũ chuyên gia hàng đầu trong lĩnh vực cơ điện lạnh.',
                        backgroundImage: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80',
                        buttonText: 'Xem các vị trí đang tuyển',
                        buttonLink: '#jobs-list'
                    }
                },
                {
                    id: 'jobs-list',
                    type: 'jobs_list',
                    props: {
                        title: 'Vị trí đang tuyển dụng',
                        subtitle: 'Hãy chọn cho mình một vị trí phù hợp để cùng chúng tôi kiến tạo tương lai.'
                    }
                }
            ]
        });

        const result = await client.query('SELECT id FROM static_pages WHERE slug = $1', ['recruitment']);
        const pageExists = result.rows.length > 0;
        
        if (!pageExists) {
            await client.query(
                'INSERT INTO static_pages (title, slug, content, is_active) VALUES ($1, $2, $3, $4)',
                ['Tuyển dụng', 'recruitment', recruitmentContent, true]
            );
            console.log('Recruitment static page created');
        } else {
            console.log('Recruitment static page already exists');
        }

        // 2. Add to Navigation (Footer - Về VVC)
        const { rows: footerNav } = await client.query('SELECT id FROM navigation WHERE label = $1', ['Về VVC']);
        if (footerNav.length > 0) {
            const parentId = footerNav[0].id;
            const { rows: navExists } = await client.query('SELECT id FROM navigation WHERE label = $1 AND parent_id = $2', ['Tuyển dụng', parentId]);
            
            if (navExists.length === 0) {
                await client.query(
                    'INSERT INTO navigation (label, path, parent_id, order_index, position, type, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)',
                    ['Tuyển dụng', '/recruitment', parentId, 10, 'footer', 'internal', true]
                );
                console.log('Recruitment link added to "Về VVC" footer navigation');
            } else {
                console.log('Recruitment link already exists in footer');
            }
        } else {
            console.log('Footer parent "Về VVC" not found');
        }

    } catch (err) {
        console.error('Error seeding recruitment:', err);
    } finally {
        await client.end();
    }
}

seed();
