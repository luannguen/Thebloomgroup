import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:X1PODLTRV56BMPTQ@db.okccyedrnmzzprqotilz.supabase.co:5432/postgres';

async function fixDbPages() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log('=== Updating team static page ===');
  const teamContent = JSON.stringify({
    sections: [
      {
        id: 'team-hero-1',
        type: 'team_hero',
        props: {
          title: 'ĐỘI NGŨ CHUYÊN GIA THEBLOOMGROUP',
          subtitle: 'Hội tụ những tinh hoa trong ngành kỹ thuật lạnh, tâm huyết với từng giải pháp của khách hàng.'
        }
      },
      {
        id: 'team-grid-1',
        type: 'team_grid',
        props: {
          title: 'Gặp gỡ đội ngũ của chúng tôi',
          description: 'Đội ngũ kỹ sư và chuyên viên dày dặn kinh nghiệm, luôn sẵn sàng đồng hành cùng dự án của bạn.'
        }
      }
    ]
  });

  await client.query(`
    UPDATE static_pages 
    SET is_active = true, content = $1, updated_at = NOW()
    WHERE slug = 'team';
  `, [teamContent]);
  console.log('✅ Updated team page in static_pages.');

  // Also verify if we should insert contact and projects as visual editable templates in static_pages
  // in case the admin edits them via CMS
  const contactContent = JSON.stringify({
    sections: [
      {
        id: 'contact-hero-img',
        type: 'hero',
        props: {
          title: 'KẾT NỐI VỚI CHÚNG TÔI',
          description: 'Thebloomgroup luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của quý khách hàng.',
          backgroundImage: '/assets/banners/contact-banner.png',
          alignment: 'center',
          badge: 'Get in touch'
        }
      },
      { id: 'contact-info-cards', type: 'contact_info', props: {} },
      { id: 'contact-map', type: 'google_map', props: {} },
      { id: 'contact-form-main', type: 'contact_form', props: { title: 'Gửi tin nhắn cho chúng tôi' } }
    ]
  });

  await client.query(`
    INSERT INTO static_pages (slug, title, content, excerpt, is_active, updated_at)
    VALUES ('contact', 'Liên hệ với chúng tôi', $1, 'Thông tin liên hệ của Thebloomgroup.', true, NOW())
    ON CONFLICT (slug) DO UPDATE SET is_active = true, content = EXCLUDED.content;
  `, [contactContent]);
  console.log('✅ Ensured contact page in static_pages.');

  const projectsContent = JSON.stringify({
    sections: [
      {
        id: 'projects-hero',
        type: 'hero',
        props: {
          title: 'CÔNG TRÌNH TIÊU BIỂU',
          description: 'Hàng trăm dự án thành công trên khắp cả nước khẳng định uy tín và năng lực kỹ thuật vượt trội của Thebloomgroup.',
          backgroundImage: '/assets/banners/projects-banner.png',
          alignment: 'center',
          badge: 'Success Stories'
        }
      },
      {
        id: 'projects-overview',
        type: 'project_overview',
        props: {
          title: 'Năng lực & Kinh nghiệm thi công',
          description: 'Với hơn 20 năm kinh nghiệm, Thebloomgroup đã thực hiện hàng trăm dự án lớn nhỏ trong lĩnh vực điện lạnh công nghiệp. Chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn và doanh nghiệp hàng đầu.',
          item1: 'Hơn 500 dự án lớn nhỏ đã hoàn thành',
          item2: 'Đối tác của các tập đoàn đa quốc gia',
          item3: 'Đội ngũ kỹ sư giàu kinh nghiệm thực tế',
          item4: 'Cam kết chất lượng và tiến độ khắt khe'
        }
      },
      { id: 'projects-categories', type: 'project_categories', props: { title: 'Lĩnh vực hoạt động' } },
      { id: 'projects-featured', type: 'featured_projects', props: { title: 'Dự án nổi bật' } },
      { id: 'projects-achievements', type: 'achievements', props: { title: 'Thành tựu chúng tôi đạt được' } },
      { id: 'projects-cta', type: 'cta_section', props: { title: 'Bạn có dự án cần tư vấn kỹ thuật?' } }
    ]
  });

  await client.query(`
    INSERT INTO static_pages (slug, title, content, excerpt, is_active, updated_at)
    VALUES ('projects', 'Dự án tiêu biểu', $1, 'Các dự án công trình tiêu biểu của Thebloomgroup.', true, NOW())
    ON CONFLICT (slug) DO UPDATE SET is_active = true, content = EXCLUDED.content;
  `, [projectsContent]);
  console.log('✅ Ensured projects page in static_pages.');

  await client.end();
}

fixDbPages().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
