import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { ChevronDown, ChevronUp, MapPin, Phone, Mail, Clock, CheckCircle2 } from 'lucide-react';

// --- About V2 Hero Block ---
export const AboutV2HeroBlock = ({ title, sectionId, backgroundImage }: any) => {
  const { t } = useTranslation();
  return (
    <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-110"
        style={{ backgroundImage: `url(${backgroundImage || '/assets/about-v2/about-banner.jpg'})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      <div className="container-custom relative z-10 text-center">
        <EditableElement 
          tagName="h1" 
          fieldKey="title" 
          sectionId={sectionId}
          defaultContent={title || t('about_us')} 
          className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wider mb-4 drop-shadow-lg" 
        />
        <div className="w-24 h-1 bg-[#374fa1] mx-auto"></div>
      </div>
    </section>
  );
};

// --- About V2 Intro Section ---
export const AboutV2IntroBlock = ({ title, description, image, sectionId }: any) => {
  const { t } = useTranslation();
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h4 className="text-[#374fa1] font-bold uppercase tracking-[0.2em] text-sm">
               {t('our_story', 'Câu chuyện của chúng tôi')}
            </h4>
            <EditableElement 
              tagName="h2" 
              fieldKey="title" 
              sectionId={sectionId}
              defaultContent={title || t('about_intro_title', 'Hơn 20 năm khẳng định vị thế')} 
              className="text-3xl md:text-4xl font-bold text-slate-900 border-l-4 border-[#374fa1] pl-6" 
            />
            <div className="space-y-4">
              <EditableElement 
                tagName="p" 
                fieldKey="description" 
                sectionId={sectionId}
                defaultContent={description || t('about_intro_desc', 'Chúng tôi tự hào là đơn vị tiên phong mang đến những giải pháp kỹ thuật lạnh tối ưu cho doanh nghiệp.')} 
                className="text-slate-600 leading-relaxed text-lg" 
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-[#374fa1]/5 rounded-sm -rotate-2"></div>
            <div className="relative overflow-hidden shadow-2xl rounded-sm">
              <EditableElement type="image" fieldKey="image" sectionId={sectionId} defaultContent={image || '/assets/about-v2/intro-logo.png'}>
                <img src={image || '/assets/about-v2/intro-logo.png'} alt="Intro" className="w-full h-auto" />
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- About V2 Accordion (Vision/Mission/Values) ---
export const AboutV2AccordionBlock = ({ 
  vTitle, vContent, 
  mTitle, mContent, 
  cTitle, cContent, 
  sectionId 
}: any) => {
  const [active, setActive] = useState<number | null>(0);
  const { t } = useTranslation();

  const items = [
    { title: vTitle || t('vision'), content: vContent || t('vision_desc', 'Trở thành tập đoàn kỹ thuật lạnh hàng đầu.') },
    { title: mTitle || t('mission'), content: mContent || t('mission_desc', 'Mang lại giải pháp tiết kiệm năng lượng nhất.') },
    { title: cTitle || t('core_values'), content: cContent || t('core_values_desc', 'Uy tín - Chất lượng - Sáng tạo.') }
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#374fa1]/20 to-transparent"></div>
      <div className="container-custom">
        <div className="max-w-4xl mx-auto space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-sm overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setActive(active === idx ? null : idx)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors ${active === idx ? 'bg-[#374fa1] text-white' : 'hover:bg-slate-50 text-slate-800'}`}
              >
                <span className="text-xl font-bold uppercase tracking-wide">{item.title}</span>
                {active === idx ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${active === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-8 text-slate-600 leading-relaxed text-lg">
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- About V2 Timeline (Vertical) ---
export const AboutV2TimelineBlock = ({ title, sectionId }: any) => {
  const { t } = useTranslation();
  const milestones = [
    { year: '1993', title: t('milestone_1993_title', 'Khởi nguồn'), desc: t('milestone_1993_desc', 'Bắt đầu hành trình chinh phục thị trường kỹ thuật lạnh.') },
    { year: '2000', title: t('milestone_2000_title', 'Bứt phá'), desc: t('milestone_2000_desc', 'Thành lập các chi nhánh trọng điểm tại Việt Nam.') },
    { year: '2016', title: t('milestone_2016_title', 'Chuyển mình'), desc: t('milestone_2016_desc', 'Tái cấu trúc và mở rộng danh mục giải pháp công nghiệp.') },
    { year: '2021', title: t('milestone_2021_title', 'Tầm vóc mới'), desc: t('milestone_2021_desc', 'Khẳng định vị thế đối tác chiến lược của các tập đoàn đa quốc gia.') }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <EditableElement 
            tagName="h2" 
            fieldKey="title" 
            sectionId={sectionId}
            defaultContent={title || t('history_timeline', 'Chặng đường lịch sử')} 
            className="text-3xl md:text-4xl font-bold text-slate-900 mb-4" 
          />
          <div className="w-16 h-1 bg-[#374fa1] mx-auto"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4">
          {/* Vertical line centered */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 hidden md:block transform -translate-x-1/2"></div>
          
          <div className="space-y-12 md:space-y-0">
            {milestones.map((ms, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row items-center ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* Year Marker */}
                <div className="z-10 bg-[#374fa1] text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-xl mb-4 md:mb-0 shadow-xl border-4 border-white">
                  {ms.year}
                </div>
                
                {/* Content Card */}
                <div className={`w-full md:w-1/2 px-8 ${idx % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{ms.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{ms.desc}</p>
                </div>
                
                {/* Spacer for other side */}
                <div className="hidden md:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- About V2 Location ---
export const AboutV2LocationBlock = ({ title, sectionId }: any) => {
  const { t } = useTranslation();
  const locations = [
    { 
       city: t('hanoi', 'Hà Nội'), 
       address: 'Tầng 15, Toà nhà Vietinbank, 117 Trần Duy Hưng, Hà Nội',
       phone: '+84 24 3789 248',
       email: 'hn@thuongthien.vn'
    },
    { 
       city: t('hcm', 'TP. Hồ Chí Minh'), 
       address: 'Số 10-12 Đông Du, Phường Bến Nghé, Quận 1, TP. HCM',
       phone: '+84 28 3823 456',
       email: 'hcm@thuongthien.vn'
    },
    { 
       city: t('danang', 'Đà Nẵng'), 
       address: 'Lô A-12, Khu Công nghiệp Đà Nẵng, Quận Sơn Trà, Đà Nẵng',
       phone: '+84 236 3912 345',
       email: 'dn@thuongthien.vn'
    }
  ];

  return (
    <section className="py-20 bg-slate-900 text-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <EditableElement 
            tagName="h2" 
            fieldKey="title" 
            sectionId={sectionId}
            defaultContent={title || t('our_locations', 'Mạng lưới văn phòng')} 
            className="text-3xl md:text-4xl font-bold mb-4" 
          />
          <div className="w-16 h-1 bg-[#374fa1] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#374fa1] flex items-center justify-center mb-6 rounded-sm group-hover:scale-110 transition-transform">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-4">{loc.city}</h3>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex gap-3">
                  <MapPin size={16} className="text-[#374fa1] flex-shrink-0" />
                  <span>{loc.address}</span>
                </li>
                <li className="flex gap-3">
                  <Phone size={16} className="text-[#374fa1] flex-shrink-0" />
                  <span>{loc.phone}</span>
                </li>
                <li className="flex gap-3">
                  <Mail size={16} className="text-[#374fa1] flex-shrink-0" />
                  <span>{loc.email}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
