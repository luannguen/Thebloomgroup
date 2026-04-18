import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres:vietvinhcorp@db.rfzuevsyegqbdlttmloa.supabase.co:5432/postgres";

const aboutContent = {
  sections: [
    {
      id: 'hero',
      type: 'about_hero',
      props: { 
        title: 'TỔNG CÔNG TY KỸ THUẬT LẠNH VIỆT NAM - VIETVINH CORPORATION', 
        description: 'VVC tự hào là đơn vị tiên phong trong lĩnh vực tư vấn, thiết kế và lắp đặt hệ thống cơ điện lạnh, mang đến giải pháp toàn diện cho hàng ngàn công trình lớn nhỏ trên khắp cả nước.' 
      }
    },
    {
      id: 'history',
      type: 'about_history',
      props: {
        title: 'Hành trình phát triển',
        p1: 'Được thành lập vào năm 2003, VVC đã trải qua chặng đường hơn 20 năm phát triển bền vững, không ngừng đổi mới để trở thành Tổng công ty kỹ thuật lạnh hàng đầu Việt Nam.',
        p2: 'Sự kết hợp giữa đội ngũ kỹ sư chuyên môn cao và quy trình quản trị hiện đại đã giúp VVC khẳng định vị thế trong các lĩnh vực: kho lạnh công nghiệp, hệ thống điều hòa không khí và vật tư kỹ thuật lạnh.',
        image: '/vvc-hero.png',
        expYears: '20+',
        expText: 'Năm kinh nghiệm'
      }
    },
    {
      id: 'vision_mission',
      type: 'about_vision',
      props: {
        visionTitle: 'Tầm nhìn',
        visionDesc1: 'Trở thành biểu tượng uy tín hàng đầu trong ngành kỹ thuật lạnh tại Việt Nam và vươn tầm khu vực Đông Nam Á.',
        missionTitle: 'Sứ mệnh',
        missionDesc1: 'Cung cấp hệ sinh thái giải pháp kỹ thuật lạnh bền vững, tiết kiệm năng lượng, góp phần nâng cao chất lượng cuộc sống và bảo vệ môi trường.'
      }
    },
    {
      id: 'facilities',
      type: 'about_facilities',
      props: {
        title: 'NĂNG LỰC SẢN XUẤT & CƠ SỞ VẬT CHẤT',
        description: 'VVC sở hữu hệ thống nhà máy sản xuất linh kiện cơ khí lạnh hiện đại, cùng mạng lưới kho bãi quy mô lớn tại các vùng kinh tế trọng điểm, đáp ứng mọi nhu cầu khắt khe của dự án.',
        image1: '/vvc-factory.png',
        image2: '/vvc-quality.png'
      }
    },
    {
      id: 'quality',
      type: 'about_quality',
      props: {
        title: 'NGUYÊN TẮC CHẤT LƯỢNG CỦA CHÚNG TÔI',
        q1_title: 'Chất lượng là sống còn',
        q1_desc: 'Mọi sản phẩm và giải pháp đều phải trải qua quy trình kiểm soát 3 lớp nghiêm ngặt trước khi đến tay khách hàng.',
        q2_title: 'Sáng tạo & Đổi mới',
        q2_desc: 'Không ngừng cập nhật công nghệ làm mát tiên tiến nhất từ Nhật Bản và Châu Âu để tối ưu hiệu suất.',
        q3_title: 'Trách nhiệm cộng đồng',
        q3_desc: 'Cam kết sử dụng các môi chất lạnh thân thiện với môi trường, giảm thiểu tác động đến tầng Ozone.',
        q4_title: 'Đối tác tin cậy',
        q4_desc: 'Xây dựng mối quan hệ dựa trên sự trung thực, chuyên nghiệp và hiệu quả kinh tế bền vững cho mọi khách hàng.'
      }
    },
    {
      id: 'core_values',
      type: 'about_values',
      props: { title: 'Giá trị cốt lõi' }
    },
    {
      id: 'leadership',
      type: 'about_leadership',
      props: { title: 'Đội ngũ lãnh đạo' }
    }
  ]
};

async function seed() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to DB');
    
    const query = `
      INSERT INTO public.static_pages (slug, title, content, is_active, updated_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (slug) 
      DO UPDATE SET 
        content = EXCLUDED.content,
        updated_at = NOW();
    `;
    
    await client.query(query, ['about-us', 'Về chúng tôi', JSON.stringify(aboutContent), true]);
    console.log('Seeding successful!');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await client.end();
  }
}

seed();
