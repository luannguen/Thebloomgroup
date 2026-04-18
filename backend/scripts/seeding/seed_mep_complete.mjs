import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const { Client } = pg;
const connectionString = process.env.DATABASE_URL;

const mepMainPage = {
  sections: [
    {
      id: 'mep-hero',
      type: 'hero',
      props: {
        title: 'GIẢI PHÁP CƠ ĐIỆN (M&E) TỔNG THỂ',
        description: 'VietVinhCorp là tổng thầu cơ điện uy tín, chuyên cung cấp các giải pháp kỹ thuật tích hợp từ thiết kế đến thi công cho các nhà máy công nghiệp, tòa nhà cao tầng và hạ tầng kỹ thuật chuyên sâu.',
        alignment: 'left',
        image_url: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_electrical.png'
      }
    },
    {
      id: 'mep-systems',
      type: 'me_systems',
      props: {
        title: '6 Hệ Thống Cơ Điện Cốt Lõi',
        description: 'Chúng tôi làm chủ công nghệ và quy trình thi công cho toàn bộ các hạng mục MEP quan trọng nhất hiện nay.',
        image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_bms.png',
        cat1_label: 'Hệ Thống Điện',
        cat1_sub: 'Trạm biến áp, tủ điện MSB, RMU và hệ thống nguồn dự phòng.',
        cat1_link: '/he-thong-dien',
        cat2_label: 'Hệ Thống HVAC',
        cat2_sub: 'Chiller trung tâm, điều hòa VRV/VRF và thông gió nhà xưởng.',
        cat2_link: '/he-thong-hvac',
        cat3_label: 'Ống Công Nghệ',
        cat3_sub: 'Khí nén, lò hơi, nước lạnh PCW và đường ống vi sinh.',
        cat3_link: '/he-thong-ong-cong-nghe',
        cat4_label: 'PCCC & Cấp Thoát Nước',
        cat4_sub: 'Hệ thống Sprinkler, báo cháy địa chỉ và xử lý nước thải.',
        cat4_link: '/phong-chay-chua-chay',
        cat5_label: 'Phòng Sạch (Cleanroom)',
        cat5_sub: 'Thi công Panel, lọc HEPA tiêu chuẩn ISO 14644 & GMP.',
        cat5_link: '/phong-sach',
        cat6_label: 'BMS & ICT',
        cat6_sub: 'Quản lý tòa nhà thông minh, giám sát năng lượng và hạ tầng mạng IT.',
        cat6_link: '/he-thong-bms'
      }
    },
    {
      id: 'mep-lifecycle',
      type: 'service_lifecycle',
      props: {
        title: 'Quy Trình Triển Khai Chuyên Nghiệp',
        description: 'Đảm bảo tiến độ và chất lượng thông qua quy trình kiểm soát 4 giai đoạn nghiêm ngặt.',
        step1_title: 'Tư Vấn & Thiết Kế',
        step1_desc: 'Khảo sát hiện trạng, tư vấn giải pháp tối ưu và thiết kế Shopdrawing chi tiết.',
        step2_title: 'Cung Ứng Vật Tư',
        step2_desc: 'Lựa chọn thiết bị từ các thương hiệu uy tín toàn cầu, đảm bảo tiêu chuẩn kỹ thuật.',
        step3_title: 'Thi Công & Giám Sát',
        step3_desc: 'Đội ngũ kỹ sư giàu kinh nghiệm trực tiếp thi công và giám sát an toàn tại công trường.',
        step4_title: 'Bàn Giao & Bảo Trì',
        step4_desc: 'Vận hành thử nghiệm, đào tạo chuyển giao và bảo trì định kỳ trọn đời dự án.'
      }
    }
  ]
};

const mepSubPages = [
  {
    slug: 'he-thong-dien',
    title: 'Hệ Thống Điện Công Nghiệp & Tòa Nhà',
    sections: [
      {
        id: 'detail-elec',
        type: 'technical_detail',
        props: {
          title: 'Hệ Thống Phân Phối Điện Toàn Diện',
          description: 'VietVinhCorp thiết kế và thi công hệ thống điện từ khâu cấp nguồn trung thế đến các thiết bị tiêu thụ đầu cuối. Chúng tôi tập trung vào tính ổn định, an toàn và khả năng dự phòng cao cho các nhà máy sản xuất liên tục.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_electrical.png',
          feature1: 'Trạm biến áp & Tủ trung thế RMU',
          feature2: 'Hệ thống tủ điện MSB, ATS, DB tiêu chuẩn IEC',
          feature3: 'Máy phát điện dự phòng & UPS công suất lớn',
          feature4: 'Hệ thống chống sét địa chỉ & Tiếp địa chuyên dụng'
        }
      }
    ]
  },
  {
    slug: 'he-thong-hvac',
    title: 'Giải Pháp Điều Hòa Không Khí & Thông Gió',
    sections: [
      {
        id: 'detail-hvac',
        type: 'technical_detail',
        props: {
          title: 'Công Nghệ HVAC Tiết Kiệm Năng Lượng',
          description: 'Giải pháp điều hòa không khí trung tâm và thông gió quy mô lớn, tối ưu hóa lưu chuyển khí tươi và kiểm soát nhiệt độ, độ ẩm chính xác cho môi trường làm việc lý tưởng.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_hvac.png',
          feature1: 'Hệ thống Chiller giải nhiệt nước & Tháp giải nhiệt',
          feature2: 'Điều hòa trung tâm VRV / VRF biến tần Daikin/Mitsubishi',
          feature3: 'Hệ thống thông gió hút khí thải & Cấp khí tươi (PAU)',
          feature4: 'Điều hòa chính xác (Precision Cooling) cho Server Room'
        }
      }
    ]
  },
  {
    slug: 'he-thong-ong-cong-nghe',
    title: 'Hệ Thống Đường Ống Công Nghệ & Tiện Ích',
    sections: [
      {
        id: 'detail-utility',
        type: 'technical_detail',
        props: {
          title: 'Hệ Thống Tiện Ích Công Nghiệp (Utility)',
          description: 'Cung cấp hạ tầng đường ống kỹ thuật cho sản xuất, bao gồm khí nén, lò hơi và nước làm mát. Chúng tôi sử dụng các vật liệu cao cấp như Inox vi sinh để đảm bảo tiêu chuẩn vệ sinh an toàn thực phẩm.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_utility.png',
          feature1: 'Đường ống khí nén áp lực cao & Máy nén khí',
          feature2: 'Hệ thống lò hơi (Steam) & Mạng phân phối nhiệt',
          feature3: 'Hệ thống nước lạnh PCW & Cooling Water',
          feature4: 'Đường ống Inox vi sinh (Sanitary) cho Thực phẩm'
        }
      }
    ]
  },
  {
    slug: 'phong-chay-chua-chay',
    title: 'Hệ Thống PCCC & Cấp Thoát Nước',
    sections: [
      {
        id: 'detail-fire',
        type: 'technical_detail',
        props: {
          title: 'An Toàn PCCC & Hạ Tầng Nước',
          description: 'Thi công trọn gói hệ thống phòng cháy chữa cháy đạt chuẩn kiểm duyệt của cơ quan chức năng, kết hợp hệ thống cấp thoát nước thông minh cho các khu công nghiệp.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_firefighting.png',
          feature1: 'Hệ thống chữa cháy tự động Sprinkler & Vách tường',
          feature2: 'Báo cháy địa chỉ (Addressable Fire Alarm) thông minh',
          feature3: 'Trạm bơm chữa cháy công suất lớn & Bể chứa',
          feature4: 'Hệ thống xử lý nước thải & Cấp nước sản xuất'
        }
      }
    ]
  },
  {
    slug: 'phong-sach',
    title: 'Thi Công Phòng Sạch Tiêu Chuẩn Quốc Tế',
    sections: [
      {
        id: 'detail-clean',
        type: 'technical_detail',
        props: {
          title: 'Kiểm Soát Môi Trường Tuyệt Đối (Cleanroom)',
          description: 'Thiết kế và thi công phòng sạch đạt tiêu chuẩn ISO 14644, GMP cho lĩnh vực Dược phẩm, Thực phẩm và Điện tử. Chúng tôi làm chủ kỹ thuật thi công Panel và hệ thống lọc bụi tiên tiến.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_cleanroom.png',
          feature1: 'Thi công Panel cách nhiệt PU/PIR & Cửa chuyên dụng',
          feature2: 'Hệ thống lọc khí HEPA/ULPA & FFU tự động',
          feature3: 'Thiết kế kháng chấn & Sàn Vinyl chống tĩnh điện',
          feature4: 'Kiểm soát áp suất, nhiệt độ & độ ẩm 24/7'
        }
      }
    ]
  },
  {
    slug: 'he-thong-bms',
    title: 'Hệ Thống Quản Lý Tòa Nhà & Hạ Tầng ICT',
    sections: [
      {
        id: 'detail-bms',
        type: 'technical_detail',
        props: {
          title: 'Thông Minh Hóa Công Trình (BMS/ICT)',
          description: 'Tích hợp các hệ thống kỹ thuật vào một nền tảng quản lý duy nhất (iBMS), giúp giám sát tập trung, tối ưu hóa năng lượng và tăng cường an ninh hạ tầng CNTT cho doanh nghiệp.',
          image: 'https://rfzuevsyegqbdlttmloa.supabase.co/storage/v1/object/public/media/mep/mep_bms.png',
          feature1: 'Hệ thống iBMS giám sát toàn diện cơ điện',
          feature2: 'Phát hiện sự cố & Cảnh báo sớm qua Mobile/Email',
          feature3: 'Quản lý tiêu thụ điện năng & Tự động tiết kiệm',
          feature4: 'Hạ tầng Data Center, LAN/TEL & WiFi chuyên dụng'
        }
      }
    ]
  }
];

async function seed() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('🔄 Đang đồng bộ hóa nội dung MEP toàn diện...');

    const query = `
      INSERT INTO public.static_pages (slug, title, content, is_active)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (slug) 
      DO UPDATE SET 
        content = EXCLUDED.content,
        title = EXCLUDED.title,
        updated_at = NOW();
    `;

    // 1. Seed Main Overview Page
    await client.query(query, ['he-thong-co-dien', 'Hệ Thống Cơ Điện (M&E)', JSON.stringify(mepMainPage), true]);
    console.log('✅ Đã đồng bộ trang Overview: /he-thong-co-dien');

    // 2. Seed 6 Detail Pages
    for (const page of mepSubPages) {
      const content = { sections: page.sections };
      await client.query(query, [page.slug, page.title, JSON.stringify(content), true]);
      console.log(`✅ Đã đồng bộ trang chi tiết: /${page.slug}`);
    }

    console.log('\n🎉 HOÀN TẤT: Toàn bộ hệ thống nội dung MEP đã sẵn sàng!');
  } catch (err) {
    console.error('❌ Thất bại:', err.message);
  } finally {
    await client.end();
  }
}

seed();
