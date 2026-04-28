import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText as FileTextIcon, 
  Wrench as WrenchIcon, 
  Activity as ActivityIcon, 
  Cog as CogIcon, 
  CheckCircle as CheckCircleIcon, 
  Zap as ZapIcon, 
  Shield as ShieldIcon, 
  Settings as SettingsIcon, 
  Server as ServerIcon, 
  ArrowRight as ArrowRightIcon,
  ShieldCheck as ShieldCheckIcon,
  Check as CheckIcon,
  ThermometerSnowflake,
  Wind,
  IceCream,
  CircleCheckBig,
  BatteryCharging,
  Cpu,
  Droplets,
  Zap,
  Leaf,
  Layers,
  Flame,
  Snowflake
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { FloatingToolbar } from '../admin/FloatingToolbar';
import ContactForm from '../ContactForm';

// --- HỆ THỐNG LẠNH ---
export const RefrigerationBlock = ({ 
  title, 
  description,
  image,
  feature1_title,
  feature1_desc,
  feature2_title,
  feature2_desc,
  feature3_title,
  feature3_desc,
  iconSize = 64,
  iconSpacing = 24,
  sectionId 
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();
  
  const displayTitle = title || t('industry_refrigeration_hero_title', "Công Nghệ Làm Lạnh");
  const displayDesc = description || t('industry_refrigeration_hero_desc', "Bảo quản thực phẩm trong điều kiện lành mạnh lâu hơn.");
  const displayImage = image || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200";
  
  const features = [
    { 
      title: feature1_title || t('industry_ref_factor_1_title', "Chất lượng thiết bị"), 
      desc: feature1_desc || t('industry_ref_factor_1_desc', "Chất lượng của các thiết bị làm lạnh là nền tảng cho hiệu suất vận hành lâu dài.") 
    },
    { 
      title: feature2_title || t('industry_ref_factor_2_title', "Cấu hình chính xác"), 
      desc: feature2_desc || t('industry_ref_factor_2_desc', "Tối ưu hóa dựa trên đặc tính sản phẩm và điều kiện khí hậu thực tế.") 
    },
    { 
      title: feature3_title || t('industry_ref_factor_4_title', "Thuật toán thông minh"), 
      desc: feature3_desc || t('industry_ref_factor_4_desc', "Giảm tiêu thụ năng lượng thông qua bộ điều khiển thông minh AI.") 
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-4xl font-bold mb-6 text-primary block" />
            <EditableElement tagName="p" fieldKey="description" sectionId={sectionId} defaultContent={displayDesc} className="text-lg text-muted-foreground mb-8 leading-relaxed block" />
            
            <div className="grid sm:grid-cols-1 gap-8">
              {features.map((f: any, i: number) => {
                const Icon = i === 0 ? ThermometerSnowflake : i === 1 ? Wind : CircleCheckBig;
                const fieldPrefix = `feature${i+1}`;
                return (
                  <div key={i} className="flex gap-6 group items-start relative">
                    {editMode && (
                      <FloatingToolbar 
                        iconSize={iconSize}
                        onIconSizeChange={(size) => updateSectionProps(sectionId, { iconSize: size })}
                        iconSpacing={iconSpacing}
                        onIconSpacingChange={(s) => updateSectionProps(sectionId, { iconSpacing: s })}
                        className="top-0 left-0 -translate-x-full"
                      />
                    )}
                    <div 
                      className="flex-shrink-0 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm border border-primary/10"
                      style={{ width: iconSize, height: iconSize }}
                    >
                      <Icon className="text-primary group-hover:text-white group-hover:scale-110 transition-transform" style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                    </div>
                    <div className="flex-grow">
                      <EditableElement tagName="h4" fieldKey={`${fieldPrefix}_title`} sectionId={sectionId} defaultContent={f.title} className="font-bold text-xl mb-2 group-hover:text-primary transition-colors block" />
                      <EditableElement tagName="p" fieldKey={`${fieldPrefix}_desc`} sectionId={sectionId} defaultContent={f.desc} className="text-muted-foreground leading-relaxed block" />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-10">
              <a href="/products/industrial" className="btn-primary inline-flex items-center">
                {t('learn_more', 'Tìm hiểu thêm')} <ArrowRightIcon className="ml-2 w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="order-1 lg:order-2 relative">
            <div className="absolute -inset-4 bg-primary/5 rounded-2xl transform rotate-3" />
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <EditableElement type="image" fieldKey="image" sectionId={sectionId} defaultContent={displayImage}>
                <img src={displayImage} alt={displayTitle} className="w-full h-full object-cover min-h-[400px]" />
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PHÂN LOẠI KHO LẠNH ---
export const ColdStorageCatalogBlock = ({ 
  title, 
  subtitle,
  item1_name, item1_range,
  item2_name, item2_range,
  item3_name, item3_range,
  item4_name, item4_range,
  item5_name, item5_range,
  item6_name, item6_range,
  sectionId 
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('cold_storage_types_title', 'Phân Loại Kho Lạnh');
  const displaySubtitle = subtitle || t('cold_storage_types_subtitle', 'Phân loại dựa trên sản phẩm lưu trữ và mục đích sử dụng');

  const items = [
    { name: item1_name || t('cs_type_1_name'), range: item1_range || t('cs_type_1_range'), icon: ThermometerSnowflake },
    { name: item2_name || t('cs_type_2_name'), range: item2_range || t('cs_type_2_range'), icon: Snowflake },
    { name: item3_name || t('cs_type_3_name'), range: item3_range || t('cs_type_3_range'), icon: Droplets },
    { name: item4_name || t('cs_type_4_name'), range: item4_range || t('cs_type_4_range'), icon: Zap },
    { name: item5_name || t('cs_type_5_name'), range: item5_range || t('cs_type_5_range'), icon: Layers },
    { name: item6_name || t('cs_type_6_name'), range: item6_range || t('cs_type_6_range'), icon: Flame }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto mb-20">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight block" />
          <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-muted-foreground font-medium block" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const fieldPrefix = `item${idx+1}`;
            return (
              <div key={idx} className="group bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[60px] opacity-20 group-hover:opacity-100 group-hover:bg-primary/5 transition-all" />
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-500 shadow-inner">
                    <item.icon className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <EditableElement tagName="h3" fieldKey={`${fieldPrefix}_name`} sectionId={sectionId} defaultContent={item.name} className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors block" />
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 text-primary font-bold text-sm mb-4 border border-slate-200">
                    <ActivityIcon className="w-4 h-4 mr-2" />
                    <EditableElement tagName="span" fieldKey={`${fieldPrefix}_range`} sectionId={sectionId} defaultContent={item.range} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- SỰ KHÁC BIỆT VIETVINH & MÔI CHẤT LẠNH ---
export const IndustrialExpertiseBlock = ({ 
  diff_title, diff_desc,
  diff_feat1_title, diff_feat1_desc,
  diff_feat2_title, diff_feat2_desc,
  diff_feat3_title, diff_feat3_desc,
  refrig_title,
  refrig1_title, refrig1_desc,
  refrig2_title, refrig2_desc,
  iconSize = 56,
  sectionId 
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();

  const displayDiffTitle = diff_title || t('vietvinh_difference_title', 'Sự Khác Biệt Của VIETVINH');
  const displayDiffDesc = diff_desc || t('vietvinh_difference_desc', 'Kỹ thuật tập trung R&D bảo quản thực phẩm tốt nhất.');
  const displayRefrigTitle = refrig_title || t('refrigerants_title', 'Môi Chất Lạnh');

  const diffFeatures = [
    { title: diff_feat1_title || "71% Energy Savings", desc: diff_feat1_desc || t('industry_ref_factor_4_desc'), icon: BatteryCharging, color: 'green' },
    { title: diff_feat2_title || "R&D Focused Engineering", desc: diff_feat2_desc || "Design tailored to product and climate.", icon: Cpu, color: 'blue' },
    { title: diff_feat3_title || "Eco-friendly Energy", desc: diff_feat3_desc || "Solar and wind integration.", icon: Leaf, color: 'amber' }
  ];

  const refrigTypes = [
    { title: refrig1_title || t('refrigerants_natural_title'), desc: refrig1_desc || t('refrigerant_natural_desc') },
    { title: refrig2_title || t('refrigerants_freon_title'), desc: refrig2_desc || t('refrigerant_freon_desc') }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <EditableElement tagName="h2" fieldKey="diff_title" sectionId={sectionId} defaultContent={displayDiffTitle} className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-900 leading-tight block" />
            <EditableElement tagName="p" fieldKey="diff_desc" sectionId={sectionId} defaultContent={displayDiffDesc} className="text-lg text-muted-foreground mb-12 leading-relaxed block" />
            
            <div className="space-y-8">
              {diffFeatures.map((f, i) => {
                const prefix = `diff_feat${i+1}`;
                return (
                  <div key={i} className="flex gap-6 relative group">
                    {editMode && (
                      <FloatingToolbar 
                        iconSize={iconSize}
                        onIconSizeChange={(size) => updateSectionProps(sectionId, { iconSize: size })}
                        className="top-0 left-0 -translate-x-full"
                      />
                    )}
                    <div 
                      className={`flex-shrink-0 rounded-2xl bg-${f.color}-50 flex items-center justify-center border border-${f.color}-100 shadow-sm`}
                      style={{ width: iconSize, height: iconSize }}
                    >
                      <f.icon className={`text-${f.color}-600`} style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                    </div>
                    <div className="flex-grow">
                      <EditableElement tagName="h4" fieldKey={`${prefix}_title`} sectionId={sectionId} defaultContent={f.title} className="font-bold text-lg mb-1 block" />
                      <EditableElement tagName="p" fieldKey={`${prefix}_desc`} sectionId={sectionId} defaultContent={f.desc} className="text-muted-foreground text-sm block" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-10 flex items-center">
                <Droplets className="mr-4 text-primary w-8 h-8" />
                <EditableElement tagName="span" fieldKey="refrig_title" sectionId={sectionId} defaultContent={displayRefrigTitle} />
              </h3>
              
              <div className="space-y-12">
                {refrigTypes.map((rt, i) => (
                  <div key={i} className="group">
                    <h4 className="text-xl font-bold mb-4 text-primary flex items-center">
                      <span className="w-8 h-px bg-primary/40 mr-4 group-hover:w-12 transition-all" />
                      <EditableElement tagName="span" fieldKey={`refrig${i+1}_title`} sectionId={sectionId} defaultContent={rt.title} />
                    </h4>
                    <EditableElement tagName="p" fieldKey={`refrig${i+1}_desc`} sectionId={sectionId} defaultContent={rt.desc} className="text-slate-400 leading-relaxed font-medium block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- HỆ THỐNG CƠ ĐIỆN ---
export const MEBlock = ({
  title,
  description,
  image,
  cat1_label, cat1_sub, cat1_link,
  cat2_label, cat2_sub, cat2_link,
  cat3_label, cat3_sub, cat3_link,
  cat4_label, cat4_sub, cat4_link,
  cat5_label, cat5_sub, cat5_link,
  cat6_label, cat6_sub, cat6_link,
  iconSize = 80,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();
  
  const displayTitle = title || t('industry_me_title', "Tổng Thầu Cơ Điện (M&E)");
  const displayDesc = description || t('industry_me_desc', "Giải pháp cơ điện toàn diện cho mọi công trình.");
  const displayImage = image || "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=1200";

  const categories = [
    { icon: ZapIcon, label: cat1_label || t('industry_me_c1_title'), sub: cat1_sub || t('industry_me_c1_desc'), link: cat1_link || "/he-thong-dien" },
    { icon: Wind, label: cat2_label || t('industry_me_c2_title'), sub: cat2_sub || t('industry_me_c2_desc'), link: cat2_link || "/he-thong-hvac" },
    { icon: Flame, label: cat3_label || t('industry_me_c3_title'), sub: cat3_sub || t('industry_me_c3_desc'), link: cat3_link || "/phong-chay-chua-chay" },
    { icon: Droplets, label: cat4_label || t('industry_me_c4_title'), sub: cat4_sub || t('industry_me_c4_desc'), link: cat4_link || "/he-thong-ong-cong-nghe" },
    { icon: ShieldCheckIcon, label: cat5_label || t('industry_me_c5_title'), sub: cat5_sub || t('industry_me_c5_desc'), link: cat5_link || "/phong-sach" },
    { icon: Cpu, label: cat6_label || t('industry_me_c6_title'), sub: cat6_sub || t('industry_me_c6_desc'), link: cat6_link || "/he-thong-bms" }
  ];

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[120px] -mr-20 -mt-20 pointer-events-none" />
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom duration-700">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl md:text-5xl font-black mb-8 text-primary block tracking-tight" />
          <EditableElement tagName="p" fieldKey="description" sectionId={sectionId} defaultContent={displayDesc} className="text-xl text-slate-600 leading-relaxed block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => {
            const prefix = `cat${i+1}`;
            const CardContent = (
              <div className="h-full bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[80px] -mr-16 -mt-16 group-hover:bg-primary/10 transition-all duration-500" />
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-10 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:rotate-6"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <cat.icon className="group-hover:scale-110 transition-transform" style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                </div>
                <EditableElement tagName="h3" fieldKey={`${prefix}_label`} sectionId={sectionId} defaultContent={cat.label} className="text-2xl font-bold mb-5 text-slate-900 group-hover:text-primary transition-colors block" />
                <EditableElement tagName="p" fieldKey={`${prefix}_sub`} sectionId={sectionId} defaultContent={cat.sub} className="text-slate-500 leading-relaxed mb-8 block text-sm" />
                <div className="flex items-center text-primary font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                  {t('view_detail', 'Xem chi tiết')} <ArrowRightIcon className="ml-2 w-4 h-4" />
                </div>
              </div>
            );

            return (
              <div key={i} className="h-full">
                {cat.link ? (
                  <Link to={cat.link} className="block h-full no-underline">
                    {CardContent}
                  </Link>
                ) : CardContent}
              </div>
            );
          })}
        </div>

        <div className="mt-24 relative rounded-[3rem] overflow-hidden aspect-[21/9] shadow-2xl group border-8 border-white">
           <EditableElement type="image" fieldKey="image" sectionId={sectionId} defaultContent={displayImage}>
             <img src={displayImage} alt="M&E Infrastructure" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[5s]" />
           </EditableElement>
           <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-12 md:p-20">
             <div className="max-w-2xl text-white">
                <h4 className="text-3xl md:text-5xl font-black mb-6 leading-tight animate-in fade-in slide-in-from-left duration-1000">
                  {t('industry_me_banner_text', 'Giải Pháp Kỹ Thuật Đỉnh Cao Cho Mọi Quy Mô')}
                </h4>
                <p className="text-lg opacity-90 font-medium">{t('industry_me_banner_sub', 'VietVinhCorp cam kết tiến độ, chất lượng và an toàn tuyệt đối cho mọi hạng mục cơ điện.')}</p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

// --- CÔNG NGHỆ BẢO QUẢN CHUYÊN SÂU (CA, IQF, ...) ---
export const AdvancedTechShowcaseBlock = ({ 
  title,
  subtitle,
  badge,
  item1_title, item1_desc,
  item2_title, item2_desc,
  item3_title, item3_desc,
  item4_title, item4_desc,
  iconSize = 56,
  sectionId 
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();

  const displayTitle = title || t('advanced_preservation_tech', 'Công Nghệ Bảo Quản & Cấp Đông Chuyên Sâu');
  const displaySubtitle = subtitle || t('advanced_tech_subtitle', 'VIETVINH tiên phong ứng dụng các giải pháp bảo quản tiên tiến nhất.');
  const displayBadge = badge || t('specialized_solutions', 'Specialized Solutions');

  const items = [
    { title: item1_title || t('tech_ca_title'), desc: item1_desc || t('tech_ca_desc'), icon: Layers, link: "/cong-nghe-bao-quan-ca" },
    { title: item2_title || t('tech_iqf_title'), desc: item2_desc || t('iqf_desc'), icon: Snowflake, link: "/cap-dong-nhanh-iqf" },
    { title: item3_title || t('tech_banana_ripening'), desc: item3_desc || t('tech_banana_desc'), icon: Leaf, link: "/phong-chin-chuoi-tieu-chuan" },
    { title: item4_title || t('tech_blast_freezer'), desc: item4_desc || t('tech_blast_desc'), icon: ThermometerSnowflake, link: "/ham-dong-gio-cong-suat-lon" }
  ];

  return (
    <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600 rounded-full blur-[120px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold uppercase tracking-wider mb-6">
            <EditableElement tagName="span" fieldKey="badge" sectionId={sectionId} defaultContent={displayBadge} />
          </div>
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-400 block" />
          <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-slate-400 block" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((tech, i) => {
            const Icon = tech.icon;
            const prefix = `item${i+1}`;
            return (
              <div key={i} className="group p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:border-blue-500/30 transition-all duration-500 backdrop-blur-sm relative overflow-hidden block">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                <div 
                  className="rounded-2xl mb-6 flex items-center justify-center bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform duration-500 shadow-inner border border-white/5"
                  style={{ width: iconSize, height: iconSize }}
                >
                  <Icon style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                </div>
                <EditableElement tagName="h3" fieldKey={`${prefix}_title`} sectionId={sectionId} defaultContent={tech.title} className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors block" />
                <EditableElement tagName="p" fieldKey={`${prefix}_desc`} sectionId={sectionId} defaultContent={tech.desc} className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors block" />
                <Link to={tech.link} className="mt-8 flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                  {t('details', 'Chi tiết')} <ArrowRightIcon className="ml-2 w-3 h-3" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// --- TRUNG TÂM DỮ LIỆU & QUẢN LÝ ---
export const DataCenterBlock = ({
  title,
  description,
  image,
  dc_feat1_title, dc_feat1_desc,
  dc_feat2_title, dc_feat2_desc,
  iconSize = 80,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();
  
  const displayTitle = title || t('industry_dc_title', "Trung Tâm Dữ Liệu & Quản Lý Tập Trung");
  const displayDesc = description || t('industry_dc_desc', "Tư vấn và triển khai hạ tầng trung tâm dữ liệu tiêu chuẩn TIER III.");
  const displayImage = image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=1200";

  const features = [
    { title: dc_feat1_title || t('precision_cooling'), desc: dc_feat1_desc || t('precision_cooling_desc'), icon: ServerIcon },
    { title: dc_feat2_title || t('optimize_pue'), desc: dc_feat2_desc || t('optimize_pue_desc'), icon: ActivityIcon }
  ];

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
              {t('high_tech_infrastructure', 'High-Tech Infrastructure')}
            </div>
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white block" />
            <EditableElement tagName="p" fieldKey="description" sectionId={sectionId} defaultContent={displayDesc} className="text-lg opacity-80 mb-10 leading-relaxed block" />
            
            <div className="grid sm:grid-cols-2 gap-10">
              {features.map((f, i) => {
                const prefix = `dc_feat${i+1}`;
                return (
                  <div key={i} className="flex items-start gap-6 group relative">
                    <div 
                      className="rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:border-secondary transition-all duration-500"
                      style={{ width: iconSize, height: iconSize }}
                    >
                      <f.icon className="text-secondary group-hover:text-white transition-colors" style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
                    </div>
                    <div className="flex-grow">
                      <EditableElement tagName="h4" fieldKey={`${prefix}_title`} sectionId={sectionId} defaultContent={f.title} className="font-bold text-xl mb-3 text-white group-hover:text-secondary transition-colors block" />
                      <EditableElement tagName="p" fieldKey={`${prefix}_desc`} sectionId={sectionId} defaultContent={f.desc} className="text-sm opacity-70 leading-relaxed block" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video">
              <EditableElement type="image" fieldKey="image" sectionId={sectionId} defaultContent={displayImage}>
                <img src={displayImage} alt="Data Center" className="w-full h-full object-cover" />
              </EditableElement>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- DỊCH VỤ (LIFECYCLE) ---
export const ServiceLifecycleBlock = ({
  title,
  description,
  step1_title, step1_desc,
  step2_title, step2_desc,
  step3_title, step3_desc,
  step4_title, step4_desc,
  iconSize = 96,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();
  
  const displayTitle = title || t('industry_lifecycle_title', "Vòng Đời Dịch Vụ Toàn Diện");
  const displayDesc = description || t('industry_lifecycle_desc', "Đồng hành cùng khách hàng từ khâu lên ý tưởng đến vận hành lâu dài.");

  const steps = [
    { icon: FileTextIcon, title: step1_title || t('lifecycle_s1_title'), desc: step1_desc || t('lifecycle_s1_desc') },
    { icon: WrenchIcon, title: step2_title || t('lifecycle_s2_title'), desc: step2_desc || t('lifecycle_s2_desc') },
    { icon: ActivityIcon, title: step3_title || t('lifecycle_s3_title'), desc: step3_desc || t('lifecycle_s3_desc') },
    { icon: CogIcon, title: step4_title || t('lifecycle_s4_title'), desc: step4_desc || t('lifecycle_s4_desc') }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto mb-20">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl md:text-5xl font-extrabold mb-6 block tracking-tight" />
          <EditableElement tagName="p" fieldKey="description" sectionId={sectionId} defaultContent={displayDesc} className="text-xl text-muted-foreground block leading-relaxed" />
        </div>

        <div className="relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-slate-100 origin-left" 
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, i) => {
              const prefix = `step${i+1}`;
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 * i }}
                  className="group"
                >
                  <div 
                    className="bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-8 transition-colors group-hover:border-primary group-hover:shadow-2xl group-hover:shadow-primary/20 bg-white relative"
                    style={{ width: iconSize, height: iconSize }}
                  >
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                      0{i+1}
                    </div>
                    <step.icon className="text-slate-400 group-hover:text-primary transition-colors" style={{ width: iconSize * 0.4, height: iconSize * 0.4 }} />
                  </div>
                  <div className="flex flex-col items-center">
                    <EditableElement tagName="h3" fieldKey={`${prefix}_title`} sectionId={sectionId} defaultContent={step.title} className="font-bold text-2xl mb-4 text-primary block text-center" />
                    <EditableElement tagName="p" fieldKey={`${prefix}_desc`} sectionId={sectionId} defaultContent={step.desc} className="text-muted-foreground text-base leading-relaxed block text-center max-w-[240px] mx-auto" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-20 text-center"
        >
           <a href="/services" className="btn-outline group inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-primary/20 hover:border-primary hover:bg-primary hover:text-white transition-all font-bold">
             {t('explore_service_details', 'Khám phá chi tiết dịch vụ')}
             <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
           </a>
        </motion.div>
      </div>
    </section>
  );
};

// --- TECHNICAL DETAIL BLOCK ---
export const TechnicalDetailBlock = ({ 
  title,
  description,
  feature1,
  feature2,
  feature3,
  feature4,
  image,
  accent = 'blue',
  techType = 'ca',
  iconSize = 80,
  sectionId 
}: any) => {
  const { t } = useTranslation();
  const { updateSectionProps, editMode } = useVisualEditor();

  const techConfigs: Record<string, any> = {
    ca: {
      title: t('tech_detail_ca_title'),
      description: t('tech_detail_ca_desc'),
      features: [
        t('tech_detail_ca_feature1'),
        t('tech_detail_ca_feature2'),
        t('tech_detail_ca_feature3'),
        t('tech_detail_ca_feature4')
      ],
      icon: ShieldCheckIcon,
      accent: 'blue'
    },
    iqf: {
      title: t('tech_detail_iqf_title'),
      description: t('tech_detail_iqf_desc'),
      features: [
        t('tech_detail_iqf_feature1'),
        t('tech_detail_iqf_feature2'),
        t('tech_detail_iqf_feature3'),
        t('tech_detail_iqf_feature4')
      ],
      icon: ZapIcon,
      accent: 'cyan'
    },
    ripening: {
      title: t('tech_detail_ripening_title'),
      description: t('tech_detail_ripening_desc'),
      features: [
        t('tech_detail_ripening_feature1'),
        t('tech_detail_ripening_feature2'),
        t('tech_detail_ripening_feature3'),
        t('tech_detail_ripening_feature4')
      ],
      icon: CogIcon,
      accent: 'amber'
    },
    blast: {
      title: t('tech_detail_blast_title'),
      description: t('tech_detail_blast_desc'),
      features: [
        t('tech_detail_blast_feature1'),
        t('tech_detail_blast_feature2'),
        t('tech_detail_blast_feature3'),
        t('tech_detail_blast_feature4')
      ],
      icon: ActivityIcon,
      accent: 'indigo'
    }
  };

  const config = techConfigs[techType] || techConfigs.ca;
  
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayAccent = accent || config.accent;
  const displayImage = image || `https://images.unsplash.com/photo-1558444430-32f9109ef810?auto=format&fit=crop&q=80&w=1200&sig=${techType}`;
  const Icon = config.icon;

  const features = [
    feature1 || config.features[0],
    feature2 || config.features[1],
    feature3 || config.features[2],
    feature4 || config.features[3]
  ];

  return (
    <section className="py-24 bg-slate-50 overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="animate-in fade-in slide-in-from-left duration-700 relative">
            {editMode && (
              <FloatingToolbar 
                iconSize={iconSize}
                onIconSizeChange={(size) => updateSectionProps(sectionId, { iconSize: size })}
                className="top-0 left-0 -translate-x-full"
              />
            )}
            <div 
              className={`rounded-3xl bg-${displayAccent}-500/10 flex items-center justify-center mb-10 border border-${displayAccent}-500/20 shadow-lg shadow-${displayAccent}-500/5`}
              style={{ width: iconSize, height: iconSize }}
            >
              <Icon className={`text-${displayAccent}-600`} style={{ width: iconSize * 0.5, height: iconSize * 0.5 }} />
            </div>
            
            <EditableElement 
              tagName="h1" 
              fieldKey="title" 
              sectionId={sectionId} 
              defaultContent={displayTitle} 
              className="text-4xl md:text-6xl font-extrabold mb-8 text-primary leading-tight block" 
            />
            
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed mb-12">
              <EditableElement 
                tagName="p" 
                fieldKey="description" 
                sectionId={sectionId} 
                defaultContent={displayDescription} 
                className="block"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature: string, idx: number) => (
                <div key={idx} className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`mt-1 shrink-0 w-6 h-6 rounded-full bg-${displayAccent}-100 flex items-center justify-center group-hover:bg-${displayAccent}-500 group-hover:text-white transition-colors`}>
                    <CheckIcon className="w-4 h-4" />
                  </div>
                  <EditableElement 
                    tagName="span" 
                    fieldKey={`feature${idx+1}`} 
                    sectionId={sectionId} 
                    defaultContent={feature} 
                    className="text-slate-700 font-medium leading-tight block"
                  />
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap gap-6">
              <a href="/contact" className="px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-3 group">
                {t('quote_now', 'Nhận báo giá kỹ thuật')}
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => window.history.back()} className="px-10 py-4 bg-white text-primary font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                {t('back', 'Quay lại')}
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className={`absolute -top-20 -right-20 w-80 h-80 bg-${displayAccent}-500/10 rounded-full blur-3xl pointer-events-none`} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] lg:aspect-square">
               <EditableElement type="image" fieldKey="image" sectionId={sectionId} defaultContent={displayImage}>
                 <img 
                   src={displayImage} 
                   alt={displayTitle}
                   className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-[3s]" 
                 />
               </EditableElement>
               <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent pointer-events-none" />
               <div className="absolute bottom-10 left-10 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 text-white max-w-[80%]">
                 <p className="text-3xl font-bold mb-2">VIETVINH R&D</p>
                 <p className="text-sm opacity-80 uppercase tracking-widest leading-loose">Pioneering in {techType.toUpperCase()} technology solutions for Southeast Asia market.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// --- CONTACT FORM BLOCK ---
export const ContactFormBlock = () => {
  return <ContactForm />;
};
