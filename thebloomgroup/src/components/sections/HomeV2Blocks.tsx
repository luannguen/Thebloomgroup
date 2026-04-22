import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Award, Settings, Zap, Users, BarChart3 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { Link } from 'react-router-dom';

// --- BLOCK 1: PARTNERSHIP & INTRO ---
export const HomeV2PartnershipBlock = ({
  title,
  subtitle,
  description,
  partnerLogo,
  partnerName,
  sectionId
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('home_v2_partnership_title', "Đối Tác Chiến Lược Của Solar Turbines");
  const displaySubtitle = subtitle || t('home_v2_partnership_subtitle', "Thuong Thien Technologies (TTT)");
  const displayDesc = description || t('home_v2_partnership_desc', "Chúng tôi tự hào là đại diện chính thức và đối tác chiến lược của Solar Turbines tại Việt Nam, cung cấp các giải pháp năng lượng và hệ thống nén khí tiên tiến nhất.");
  const displayLogo = partnerLogo || "/assets/partners/solar-turbines-logo.svg";

  const partners = [
    { name: "Caterpillar", logo: "https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/cat-logo.png" },
    { name: "Solar Turbines", logo: "https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/solar-logo.png" },
    { name: "TTT", logo: "/assets/partners/ttt-logo.svg" }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Shield className="w-4 h-4" />
              <EditableElement tagName="span" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} />
            </div>
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl md:text-5xl font-black mb-8 text-slate-900 leading-tight block" />
            <EditableElement tagName="div" fieldKey="description" sectionId={sectionId} defaultContent={displayDesc} className="text-lg text-slate-600 mb-10 leading-relaxed block" />
            
            <div className="flex flex-wrap gap-8 items-center grayscale opacity-60">
              {partners.map((p, i) => (
                <img key={i} src={p.logo} alt={p.name} className="h-10 object-contain" />
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-[3rem] bg-slate-100 overflow-hidden relative shadow-2xl">
              <EditableElement type="image" fieldKey="partnerImage" sectionId={sectionId} defaultContent="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800">
                <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800" alt="Industrial" className="w-full h-full object-cover" />
              </EditableElement>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            </div>
            <div className="absolute -bottom-10 -left-10 p-10 bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-[280px]">
              <div className="text-4xl font-black text-primary mb-2">20+</div>
              <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">Năm kinh nghiệm trong ngành công nghiệp nặng</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- BLOCK 2: INDUSTRIAL SECTORS ---
export const HomeV2SectorsBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('home_v2_sectors_title', "Lĩnh Vực Hoạt Động");
  const displaySubtitle = subtitle || t('home_v2_sectors_subtitle', "Chúng tôi cung cấp giải pháp chuyên biệt cho các ngành công nghiệp trọng điểm.");

  const sectors = [
    { id: 'oil-gas', title: "Dầu Khí", desc: "Khai thác, vận chuyển và chế biến dầu khí.", icon: Zap, bg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
    { id: 'power', title: "Sản Xuất Điện", desc: "Giải pháp tuabin khí cho nhà máy điện.", icon: Globe, bg: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600" },
    { id: 'industrial', title: "Sản Xuất Công Nghiệp", desc: "Năng lượng cho các khu công nghiệp.", icon: Settings, bg: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=600" },
    { id: 'service', title: "Dịch Vụ Kỹ Thuật", desc: "Bảo trì, sửa chữa và vận hành.", icon: Award, bg: "https://images.unsplash.com/photo-1581092921461-7d1598637f9d?auto=format&fit=crop&q=80&w=600" }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl font-black mb-6 text-slate-900 block" />
          <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-slate-600 block" />
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sectors.map((sector, i) => (
            <motion.div
              key={sector.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-900"
            >
              <img src={sector.bg} alt={sector.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent p-8 flex flex-col justify-end">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <sector.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{sector.title}</h3>
                <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500">{sector.desc}</p>
                <div className="mt-6 flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('view_detail', 'Xem chi tiết')} <ArrowRight className="ml-2 w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- BLOCK 3: SOLUTIONS SHOWCASE ---
export const HomeV2SolutionsBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('home_v2_solutions_title', "Giải Pháp Năng Lượng & Hệ Thống Nén");
  const displaySubtitle = subtitle || t('home_v2_solutions_subtitle', "Các dòng sản phẩm tuabin khí và máy nén khí hàng đầu thế giới.");

  const solutions = [
    { title: "Gas Turbine Packages", desc: "Công suất từ 1MW đến 22MW, hiệu suất vượt trội.", image: "https://www.solar-turbines.com/content/dam/solar-turbines/assets/product-families/gas-turbines/gas-turbine-packages-family.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg" },
    { title: "Gas Compressors", desc: "Thiết kế ly tâm hiện đại cho vận chuyển khí.", image: "https://www.solar-turbines.com/content/dam/solar-turbines/assets/product-families/compressors/compressors-family.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg" },
    { title: "Customer Support", desc: "Dịch vụ sau bán hàng toàn diện, linh kiện chính hãng.", image: "https://www.solar-turbines.com/content/dam/solar-turbines/assets/site-elements/home-page/customer-service.jpg/_jcr_content/renditions/cq5dam.web.1280.1280.jpeg" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl font-black mb-6 text-slate-900 block" />
            <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-slate-600 block" />
          </div>
          <Link to="/products" className="btn-primary flex items-center shrink-0">
            {t('all_solutions', 'Tất cả giải pháp')} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-10">
          {solutions.map((sol, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="group"
            >
              <div className="rounded-[2.5rem] overflow-hidden aspect-video mb-8 relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                <img src={sol.image} alt={sol.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{sol.title}</h3>
              <p className="text-slate-600 mb-6">{sol.desc}</p>
              <Link to="/products" className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all">
                {t('learn_more', 'Tìm hiểu thêm')} <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- BLOCK 4: STATS & IMPACT ---
export const HomeV2StatsBlock = ({
  title,
  sectionId
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('home_v2_stats_title', "Sức Mạnh Từ Kinh Nghiệm & Công Nghệ");

  const stats = [
    { label: "Thiết bị lắp đặt", value: "16,000+", icon: Settings },
    { label: "Giờ vận hành", value: "3 Tỷ+", icon: BarChart3 },
    { label: "Quốc gia hiện diện", value: "100+", icon: Globe },
    { label: "Khách hàng tin tưởng", value: "500+", icon: Users }
  ];

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      </div>
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl md:text-5xl font-black mb-8 block leading-tight" />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6 text-secondary">
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
              <div className="text-white/70 font-medium uppercase tracking-widest text-xs">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
