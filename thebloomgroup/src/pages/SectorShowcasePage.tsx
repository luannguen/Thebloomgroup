import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Settings, Zap, Globe, Award, Shield, CheckCircle2, 
  Clock, Users, ArrowRight, Phone, Mail, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SectorConfig {
  title: string;
  subtitle: string;
  badge: string;
  posterImage: string;
  heroBg: string;
  pillars: {
    title: string;
    desc: string;
    icon: any;
  }[];
  stats: {
    value: string;
    label: string;
  }[];
  tagline: string;
  details: {
    title: string;
    desc: string;
    items: string[];
  }[];
}

const SECTOR_DATA: Record<string, SectorConfig> = {
  'thiet-bi-giat-la': {
    title: 'Thiết Bị Giặt Là Công Nghiệp',
    subtitle: 'Giải pháp toàn diện cho hệ thống giặt là công nghiệp',
    badge: 'Lĩnh vực trọng tâm',
    posterImage: '/images/bloom/thiet-bi-giat-la.jpg',
    heroBg: 'from-slate-900 via-slate-800 to-slate-900',
    pillars: [
      {
        title: 'Hiệu Suất Vượt Trội',
        desc: 'Vận hành mạnh mẽ, ổn định, tiết kiệm thời gian và chi phí cho các cơ sở giặt là quy mô lớn.',
        icon: Zap
      },
      {
        title: 'Tiêu Chuẩn Quốc Tế',
        desc: 'Thiết bị đạt tiêu chuẩn chất lượng và an toàn hàng đầu thế giới (UniMac, công nghệ Mỹ & Châu Âu).',
        icon: Shield
      },
      {
        title: 'Tiết Kiệm Năng Lượng',
        desc: 'Công nghệ biến tần và tái sử dụng nhiệt tiên tiến giúp tối ưu điện, nước và lượng hóa chất tiêu hao.',
        icon: Settings
      },
      {
        title: 'Hỗ Trợ Toàn Diện',
        desc: 'Tư vấn layout, thiết kế hệ thống, lắp đặt và dịch vụ bảo trì định kỳ chuyên nghiệp, nhanh chóng.',
        icon: Clock
      }
    ],
    stats: [
      { value: '10+', label: 'Năm kinh nghiệm' },
      { value: '500+', label: 'Khách hàng tin tưởng' },
      { value: 'Toàn cầu', label: 'Đối tác uy tín' },
      { value: 'Bền vững', label: 'Chất lượng dài lâu' }
    ],
    tagline: 'TheBloom Group - Đối tác tin cậy của doanh nghiệp trong mọi hệ thống giặt là công nghiệp',
    details: [
      {
        title: 'Dòng máy giặt vắt công nghiệp',
        desc: 'Dung tích từ 15kg đến hơn 120kg, lực vắt G-force cao rút ngắn thời gian sấy, tiết kiệm tối đa điện năng.',
        items: [
          'Hệ thống giảm chấn thủy lực cao cấp',
          'Lồng giặt thép không gỉ SUS 304 chuẩn y tế',
          'Bộ điều khiển vi xử lý thông minh đa chương trình',
          'Kết nối cấp hóa chất tự động'
        ]
      },
      {
        title: 'Máy sấy và máy là ép công nghiệp',
        desc: 'Dây chuyền sấy khô và ủi là phẳng đồng bộ, hoàn thiện sản phẩm vải nhanh chóng với độ thẩm mỹ cao.',
        items: [
          'Hệ thống luồng khí đối lưu phân bổ nhiệt đều',
          'Cảm biến độ ẩm tự động ngắt khi đạt chuẩn',
          'Máy là lô 1 - 4 quả lô tốc độ cao',
          'An toàn cháy nổ và cách nhiệt vượt trội'
        ]
      }
    ]
  },
  'thoi-trang-may-mac': {
    title: 'May Gia Công & Thời Trang',
    subtitle: 'Giải pháp may gia công toàn diện cho thương hiệu trong và ngoài nước',
    badge: 'Năng lực sản xuất',
    posterImage: '/images/bloom/thoi-trang-may-mac.jpg',
    heroBg: 'from-amber-950 via-slate-900 to-black',
    pillars: [
      {
        title: 'Năng Lực Sản Xuất',
        desc: 'Hệ thống máy móc hiện đại, quy trình sản xuất tối ưu, đáp ứng đa dạng đơn hàng từ nhỏ đến lớn.',
        icon: Settings
      },
      {
        title: 'Chất Lượng Vượt Trội',
        desc: 'Kiểm soát chất lượng nghiêm ngặt từng công đoạn cắt, may, ủi và đóng gói chuẩn xuất khẩu.',
        icon: CheckCircle2
      },
      {
        title: 'Thiết Kế & Phát Triển',
        desc: 'Đội ngũ thiết kế sáng tạo, cập nhật xu hướng thời trang, hỗ trợ phát triển mẫu nhanh theo yêu cầu.',
        icon: Zap
      },
      {
        title: 'Hợp Tác Bền Vững',
        desc: 'Đồng hành dài hạn, chính sách linh hoạt theo nhu cầu của từng thương hiệu, tối ưu chi phí.',
        icon: Users
      }
    ],
    stats: [
      { value: '10+', label: 'Năm kinh nghiệm trong ngành' },
      { value: 'Tay nghề cao', label: 'Đội ngũ thợ may tận tâm' },
      { value: 'Ổn định', label: 'Chất lượng đồng nhất' },
      { value: 'FOB / CMT', label: 'Mô hình hợp tác linh hoạt' }
    ],
    tagline: 'TheBloom Group - Đối tác tin cậy của doanh nghiệp trong lĩnh vực may gia công & thời trang',
    details: [
      {
        title: 'May gia công hàng xuất khẩu & nội địa',
        desc: 'Nhận gia công các đơn hàng thời trang nam nữ, áo sơ mi, polo, đầm váy, áo khoác theo tiêu chuẩn cao cấp.',
        items: [
          'Dây chuyền chuyền may công nghiệp JUKI hiện đại',
          'Bàn cắt tự động chính xác từng milimet',
          'Quy trình kiểm kim, đóng gói chuyên nghiệp',
          'Cam kết tiến độ giao hàng đúng hẹn'
        ]
      },
      {
        title: 'Sản xuất đồng phục doanh nghiệp & tổ chức',
        desc: 'Giải pháp đồng phục cao cấp cho nhà hàng, khách sạn, bệnh viện, trường học và tập đoàn lớn.',
        items: [
          'Chất liệu vải đa dạng, thoáng khí, bền màu',
          'Thêu, in logo công nghệ sắc nét',
          'Tư vấn thiết kế kiểu dáng nhận diện thương hiệu',
          'Giá xưởng cạnh tranh trực tiếp'
        ]
      }
    ]
  },
  'khong-gian-song': {
    title: 'Không Gian Sống & Đồ Gia Dụng',
    subtitle: 'Giải pháp sản xuất toàn diện cho sản phẩm chất lượng & bền vững',
    badge: 'Tiện ích không gian sống',
    posterImage: '/images/bloom/do-gia-dung.jpg',
    heroBg: 'from-slate-900 via-blue-950 to-slate-900',
    pillars: [
      {
        title: 'Hệ Thống Sản Xuất Hiện Đại',
        desc: 'Dây chuyền đồng bộ, ứng dụng công nghệ cơ khí chính xác và dập uốn tự động để nâng cao năng suất.',
        icon: Settings
      },
      {
        title: 'Kiểm Soát Chất Lượng Chặt Chẽ',
        desc: 'Quy trình kiểm tra nghiêm ngặt từng công đoạn, đảm bảo sản phẩm đạt độ hoàn thiện và an toàn cao.',
        icon: Shield
      },
      {
        title: 'Đổi Mới & Phát Triển',
        desc: 'Liên tục nghiên cứu, cải tiến mẫu mã và công năng, đáp ứng xu hướng thiết kế nội thất hiện đại.',
        icon: Zap
      },
      {
        title: 'Sản Xuất Bền Vững',
        desc: 'Tối ưu hóa nguồn lực, giảm thiểu tác động môi trường, hướng tới sản phẩm xanh và bền lâu.',
        icon: Globe
      }
    ],
    stats: [
      { value: '10+', label: 'Năm kinh nghiệm' },
      { value: 'Chuẩn chất lượng', label: 'Sản phẩm hoàn thiện cao' },
      { value: 'Toàn cầu', label: 'Đối tác tin cậy' },
      { value: 'Linh hoạt', label: 'Dịch vụ hỗ trợ toàn diện' }
    ],
    tagline: 'TheBloom Group - Đối tác tin cậy của doanh nghiệp trong lĩnh vực sản xuất đồ gia dụng',
    details: [
      {
        title: 'Sản phẩm gia dụng thông minh & kệ đa năng',
        desc: 'Các dòng sản phẩm kệ đẩy đa tầng, giá kệ nhà bếp, kệ để đồ thông minh bằng thép sơn tĩnh điện chống rỉ.',
        items: [
          'Kết cấu chắc chắn, chịu lực tải trọng cao',
          'Bề mặt sơn tĩnh điện tĩnh vi chống trầy xước',
          'Dễ dàng tháo lắp và di chuyển linh hoạt',
          'Thiết kế tối giản, tối ưu không gian sống'
        ]
      },
      {
        title: 'Giải pháp gia công OEM / ODM đồ gia dụng',
        desc: 'Nhận thiết kế và sản xuất đồ gia dụng theo đơn đặt hàng của các chuỗi bán lẻ, siêu thị và thương hiệu.',
        items: [
          'Dập kim loại, hàn robot chính xác',
          'Gia công kết hợp gỗ, inox, thép cao cấp',
          'Đóng gói bao bì theo yêu cầu thương mại điện tử',
          'Kiểm định độ bền rơi vỡ và tải trọng'
        ]
      }
    ]
  },
  'giai-phap-dich-vu': {
    title: 'Giải Pháp Dịch Vụ & Kỹ Thuật',
    subtitle: 'Giải pháp kỹ thuật toàn diện - Vận hành ổn định – Hiệu suất tối ưu',
    badge: 'Dịch vụ chuyên nghiệp',
    posterImage: '/images/bloom/dich-vu-ky-thuat.jpg',
    heroBg: 'from-slate-900 via-amber-950 to-slate-900',
    pillars: [
      {
        title: 'Bảo Trì Định Kỳ',
        desc: 'Kiểm tra, bảo dưỡng định kỳ giúp hệ thống thiết bị vận hành liên tục, ổn định, bền bỉ và an toàn.',
        icon: Shield
      },
      {
        title: 'Sửa Chữa Chuyên Nghiệp',
        desc: 'Xử lý nhanh chóng mọi sự cố kỹ thuật với đội ngũ chuyên gia giàu kinh nghiệm, linh kiện sẵn có.',
        icon: Settings
      },
      {
        title: 'Nâng Cấp & Tối Ưu',
        desc: 'Đề xuất giải pháp nâng cấp thiết bị, tối ưu hiệu suất, tiết kiệm năng lượng và chi phí vận hành.',
        icon: Zap
      },
      {
        title: 'Hỗ Trợ 24/7',
        desc: 'Đường dây nóng kỹ thuật 24/7, sẵn sàng hỗ trợ khẩn cấp và giải quyết kịp thời mọi nhu cầu khách hàng.',
        icon: Clock
      }
    ],
    stats: [
      { value: '100%', label: 'An toàn tuyệt đối' },
      { value: 'Tối ưu', label: 'Hiệu suất vận hành' },
      { value: 'Chuyên môn cao', label: 'Đội ngũ kỹ thuật viên' },
      { value: '24/7', label: 'Hỗ trợ toàn thời gian' }
    ],
    tagline: 'TheBloom Group - Đối tác tin cậy của doanh nghiệp trong mọi lĩnh vực',
    details: [
      {
        title: 'Gói bảo trì & bảo dưỡng phòng ngừa sự cố',
        desc: 'Kế hoạch bảo dưỡng chi tiết theo chu kỳ tuần, tháng, quý giúp giảm thiểu 95% nguy cơ gián đoạn vận hành.',
        items: [
          'Vệ sinh, bôi trơn và căn chỉnh cơ khí',
          'Đo kiểm tra dòng điện, điện áp và tải nhiệt',
          'Cập nhật phần mềm điều khiển và hiệu chuẩn cảm biến',
          'Báo cáo kỹ thuật chi tiết sau mỗi kỳ kiểm tra'
        ]
      },
      {
        title: 'Dịch vụ ứng cứu & sửa chữa khẩn cấp 24/7',
        desc: 'Đội cơ động sẵn sàng có mặt xử lý các sự cố đột xuất, đảm bảo dây chuyền hoạt động không bị đình trệ.',
        items: [
          'Hotline kỹ thuật thường trực 24/7/365',
          'Kho linh kiện thay thế chính hãng đầy đủ',
          'Phương án thay thế tạm thời trong khi sửa chữa lớn',
          'Bảo hành chất lượng dịch vụ sau sửa chữa'
        ]
      }
    ]
  }
};

export const SectorShowcasePage: React.FC<{ explicitSlug?: string }> = ({ explicitSlug }) => {
  const { slug: paramSlug } = useParams<{ slug: string }>();
  const activeSlug = explicitSlug || paramSlug || 'thiet-bi-giat-la';
  const data = SECTOR_DATA[activeSlug] || SECTOR_DATA['thiet-bi-giat-la'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero Banner */}
      <section className={`relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br ${data.heroBg} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-slate-300 mb-6 font-medium">
              <Link to="/" className="hover:text-amber-400 transition-colors">Trang chủ</Link>
              <ChevronRight className="w-4 h-4 text-slate-500" />
              <span className="text-amber-400">{data.title}</span>
            </div>

            <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-amber-500/30">
              {data.badge}
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
              {data.title}
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8">
              {data.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-xl active:scale-95" asChild>
                <Link to="/contact">
                  Nhận tư vấn & Báo giá <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm" asChild>
                <a href="tel:+84963415369">
                  <Phone className="mr-2 w-4 h-4 text-amber-400" /> +84 963 415 369
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Poster Showcase & 4 Pillars Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
            {/* Poster Image */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200 group">
                <img 
                  src={data.posterImage} 
                  alt={data.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 pointer-events-none" />
              </div>
            </div>

            {/* 4 Core Pillars */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-600 mb-2 block">
                  Ưu thế vượt trội
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
                  Trọng Tâm Giải Pháp Của TheBloom Group
                </h2>
                <p className="text-slate-600 leading-relaxed mb-8">
                  Chúng tôi chú trọng vào tính ổn định, độ bền dài hạn và tối ưu chi phí vận hành cho mọi dự án và đối tác.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {data.pillars.map((pillar, idx) => {
                  const Icon = pillar.icon;
                  return (
                    <div 
                      key={idx}
                      className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/50 hover:bg-amber-50/20 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-1.5">
                        {pillar.title}
                      </h3>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-2xl bg-slate-900 text-white shadow-xl mb-20">
            {data.stats.map((s, idx) => (
              <div key={idx} className="text-center p-3">
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-amber-400 mb-1">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-300 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Capacities */}
          <div className="space-y-12 mb-16">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4">
                Chi Tiết Năng Lực & Dịch Vụ Cung Ứng
              </h2>
              <p className="text-slate-600 text-sm sm:text-base">
                Mọi quy trình đều được chuẩn hóa và thực hiện theo tiêu chuẩn kỹ thuật nghiêm ngặt.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {data.details.map((detail, idx) => (
                <div key={idx} className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {detail.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {detail.desc}
                  </p>
                  <ul className="space-y-3">
                    {detail.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-sm text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 mr-2.5 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Tagline Callout */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 text-slate-900">
            <p className="text-lg md:text-xl font-bold italic text-slate-800">
              "{data.tagline}"
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-16 bg-slate-900 text-white mt-auto">
        <div className="container-custom text-center max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
            Đồng Hành Cùng TheBloom Group Ngay Hôm Nay
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-8 leading-relaxed">
            Liên hệ với đội ngũ chuyên gia của chúng tôi để nhận tư vấn kỹ thuật chuyên sâu và giải pháp phù hợp nhất với mô hình của bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="rounded-full px-8 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold" asChild>
              <Link to="/contact">Liên hệ tư vấn ngay</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-8 border-slate-700 hover:bg-slate-800 text-white" asChild>
              <Link to="/about-us">Tìm hiểu về TheBloom Group</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SectorShowcasePage;
