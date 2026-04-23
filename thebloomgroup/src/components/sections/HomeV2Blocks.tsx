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
  partnerImage,
  logo1,
  logo2,
  logo3,
  exp_value,
  exp_text,
  sectionId
}: any) => {
  const { t } = useTranslation();

  // Dữ liệu mặc định an toàn
  const dTitle = title || t('home_v2_partnership_title', "Đối Tác Chiến Lược Của Solar Turbines");
  const dSubtitle = subtitle || t('home_v2_partnership_subtitle', "Thuong Thien Technologies (TTT)");
  const dDesc = description || t('home_v2_partnership_desc', "Chúng tôi tự hào là đại diện chính thức và đối tác chiến lược của Solar Turbines tại Việt Nam, cung cấp các giải pháp năng lượng và hệ thống nén khí tiên tiến nhất.");
  const dPartnerImage = partnerImage || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800";
  const dLogo1 = logo1 || 'https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/cat-logo.png';
  const dLogo2 = logo2 || 'https://www.solar-turbines.com/etc.clientlibs/solar-turbines/clientlibs/clientlib-site/resources/images/solar-logo.png';
  const dLogo3 = logo3 || '/assets/partners/ttt-logo.svg';
  const dExpValue = exp_value || "20+";
  const dExpText = exp_text || "Năm kinh nghiệm trong ngành công nghiệp nặng";

  return (
    <section className="py-24 bg-white relative" data-section-id={sectionId}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Nội dung bên trái */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="z-10"
          >
            <div className="relative z-20 space-y-8 md:space-y-12 pr-0 md:pr-12">
              <div className="space-y-4">
                <EditableElement
                  fieldKey="subtitle"
                  sectionId={sectionId}
                  defaultContent={dSubtitle}
                  className="inline-block px-4 py-1.5 bg-slate-100 text-[#B8860B] text-[10px] font-black uppercase tracking-[0.3em] border-l-4 border-[#B8860B] mb-2"
                >
                  {dSubtitle}
                </EditableElement>

                <div className="mb-6">
                  <EditableElement
                    tagName="h2"
                    fieldKey="title"
                    sectionId={sectionId}
                    defaultContent={dTitle}
                    className="text-4xl md:text-5xl font-black text-slate-900 leading-tight inline-block"
                  />
                </div>

                <div className="mb-10">
                  <EditableElement
                    tagName="div"
                    fieldKey="description"
                    sectionId={sectionId}
                    defaultContent={dDesc}
                    type="rich-text"
                    className="text-lg text-slate-600 leading-relaxed block"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8 md:gap-12 pt-8 border-t border-slate-100 relative z-30">
                <EditableElement
                  type="image"
                  fieldKey="logo1"
                  defaultContent={dLogo1}
                  className="h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto"
                >
                  <img src={dLogo1} alt="Logo 1" className="h-full w-auto" />
                </EditableElement>

                <EditableElement
                  type="image"
                  fieldKey="logo2"
                  defaultContent={dLogo2}
                  className="h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto"
                >
                  <img src={dLogo2} alt="Logo 2" className="h-full w-auto" />
                </EditableElement>

                <EditableElement
                  type="image"
                  fieldKey="logo3"
                  defaultContent={dLogo3}
                  className="h-10 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto"
                >
                  <img src={dLogo3} alt="Logo 3" className="h-full w-auto" />
                </EditableElement>
              </div>
            </div>
          </motion.div>

          {/* Hình ảnh bên phải */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            {/* Main Image Container - Sharp Corners & Heavy Shadow */}
            <div className="relative aspect-[4/3] rounded-none overflow-hidden shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.4)] border-b-[12px] border-primary group">
              <EditableElement
                type="image"
                fieldKey="partnerImage"
                sectionId={sectionId}
                defaultContent={dPartnerImage}
                className="w-full h-full z-30 relative"
              >
                <img src={dPartnerImage} alt="Industrial" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              </EditableElement>

              {/* Professional Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/20 to-transparent mix-blend-multiply pointer-events-none z-20" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none z-20" />
            </div>

            {/* Stats Badge - High Contrast & Elevated */}
            <div className="absolute -bottom-10 -left-6 md:-left-12 p-8 md:p-10 bg-white shadow-[0_40px_100px_rgba(0,0,0,0.35)] border-l-[10px] border-primary max-w-[320px] z-[60] transform hover:-translate-y-2 transition-all duration-500">
              <div className="relative mb-3">
                <EditableElement
                  type="text"
                  fieldKey="exp_value"
                  defaultContent={dExpValue}
                  className="text-6xl font-black text-primary block"
                >
                  {dExpValue}
                </EditableElement>
              </div>
              <div className="relative">
                <EditableElement
                  type="text"
                  fieldKey="exp_text"
                  defaultContent={dExpText}
                  className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[10px] md:text-xs leading-relaxed block"
                >
                  {dExpText}
                </EditableElement>
                <div className="w-12 h-1 bg-primary mt-2" />
              </div>
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
