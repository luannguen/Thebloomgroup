import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Globe, Award, Settings, Zap, Users, BarChart3, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { useVisualEditor } from '../../context/VisualEditorContext';
import { FloatingToolbar } from '../admin/FloatingToolbar';
import { Link } from 'react-router-dom';
import { productService } from '@/services/productService';
import { Product } from '@/components/data/types';

// --- BLOCK 1: PARTNERSHIP & INTRO ---
export const HomeV2PartnershipBlock = ({
  title,
  subtitle,
  description,
  partnerImage,
  images = [],
  layout = 'image-right',
  imageWidth = 50,
  logo1,
  logo2,
  logo3,
  exp_value,
  exp_text,
  iconSize = 40,
  partnerImageWidth = 800,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const { editMode, updateSectionProps } = useVisualEditor();

  // Dữ liệu mặc định an toàn
  const dTitle = title || t('home_v2_partnership_title', "Đối Tác Chiến Lược Của Solar Turbines");
  const dSubtitle = subtitle || t('home_v2_partnership_subtitle', "Thuong Thien Technologies (TTT)");
  const dDesc = description || t('home_v2_partnership_desc', "Chúng tôi tự hào là đại diện chính thức và đối tác chiến lược của Solar Turbines tại Việt Nam, cung cấp các giải pháp năng lượng và hệ thống nén khí tiên tiến nhất.");
  const dPartnerImage = partnerImage || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800";
  const displayImages = images && images.length > 0 ? images : [{ url: dPartnerImage }];
  const dLogo1 = logo1 || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200&h=80';
  const dLogo2 = logo2 || 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200&h=80';
  const dLogo3 = logo3 || 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&q=80&w=200&h=80';
  const dExpValue = exp_value || "20+";
  const dExpText = exp_text || "Năm kinh nghiệm trong ngành công nghiệp nặng";

  const isVertical = layout === "image-top" || layout === "image-bottom" || layout === "image-middle";
  const isImageRight = layout === 'image-right';
  const isImageLeft = layout === 'image-left';

  const contentStyle = !isVertical ? { flex: `0 0 ${100 - imageWidth}%` } : { width: '100%' };
  const imageColStyle = !isVertical ? { flex: `0 0 ${imageWidth}%` } : { width: '100%' };

  const renderMediaGrid = () => {
    const gridCols = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2",
      4: "grid-cols-2"
    }[displayImages.length] || "grid-cols-1";

    return (
      <div className={`grid ${gridCols} gap-4 w-full h-full`}>
        {displayImages.slice(0, 4).map((img: any, idx: number) => (
          <div key={idx} className={`relative group ${displayImages.length === 3 && idx === 0 ? 'row-span-2' : ''}`}>
            {editMode && (
              <FloatingToolbar 
                iconSize={imageWidth}
                onIconSizeChange={(s) => updateSectionProps(sectionId, { imageWidth: s })}
                iconPosition={layout}
                onIconPositionChange={(pos) => updateSectionProps(sectionId, { layout: pos })}
                className="top-4 left-1/2 -translate-x-1/2 scale-75 z-50"
              />
            )}
            <EditableElement
              type="image"
              fieldKey={images && images.length > 0 ? `images.${idx}.url` : "partnerImage"}
              sectionId={sectionId}
              defaultContent={img.url || dPartnerImage}
              className="w-full h-full z-30 relative overflow-hidden"
            >
              <img 
                src={img.url || dPartnerImage} 
                alt={`Industrial ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
              />
            </EditableElement>
            
            {/* Professional Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-slate-900/20 to-transparent mix-blend-multiply pointer-events-none z-20" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none z-20" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="py-16 lg:py-24 bg-white relative overflow-hidden" data-section-id={sectionId}>
      <div className="container mx-auto px-4">
        <div 
          className={`flex flex-col gap-12 lg:gap-16 items-start ${isVertical ? "" : "lg:flex-row"} ${!isVertical && isImageLeft ? "lg:flex-row-reverse" : ""}`}
        >
          {/* Nội dung bên trái */}
          <motion.div
            initial={{ opacity: 0, x: isVertical ? 0 : (isImageLeft ? 30 : -30) }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="z-10 w-full"
            style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? contentStyle : { width: '100%' }}
          >
            <div className="relative z-20 space-y-8 md:space-y-12 lg:pr-12">
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
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight inline-block"
                  />
                </div>

                {layout === 'image-middle' && (
                  <div className="mb-10">
                    <div className={`relative ${displayImages.length > 1 ? 'aspect-auto' : 'aspect-[4/3]'} rounded-none overflow-hidden shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.3)] border-b-[8px] border-primary group`}>
                      {renderMediaGrid()}
                    </div>
                  </div>
                )}

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

              <div className="flex flex-wrap items-center gap-6 pt-8 border-t border-slate-100 relative z-30">
                <div className="relative group flex items-center">
                  {editMode && (
                    <FloatingToolbar 
                      iconSize={iconSize}
                      onIconSizeChange={(s) => updateSectionProps(sectionId, { iconSize: s })}
                      className="-top-12 left-0 translate-x-0 scale-75"
                    />
                  )}
                  <EditableElement
                    type="image"
                    fieldKey="logo1"
                    sectionId={sectionId}
                    defaultContent={dLogo1}
                    className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto shrink-0"
                    style={{ height: iconSize }}
                  >
                    <img src={dLogo1} alt="Logo 1" className="max-w-none" style={{ height: iconSize, maxWidth: '120px' }} />
                  </EditableElement>
                </div>

                <div className="flex items-center">
                  <EditableElement
                    type="image"
                    fieldKey="logo2"
                    sectionId={sectionId}
                    defaultContent={dLogo2}
                    className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto shrink-0"
                    style={{ height: iconSize }}
                  >
                    <img src={dLogo2} alt="Logo 2" className="max-w-none" style={{ height: iconSize, maxWidth: '120px' }} />
                  </EditableElement>
                </div>

                <div className="flex items-center">
                  <EditableElement
                    type="image"
                    fieldKey="logo3"
                    sectionId={sectionId}
                    defaultContent={dLogo3}
                    className="grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 pointer-events-auto shrink-0"
                    style={{ height: iconSize }}
                  >
                    <img src={dLogo3} alt="Logo 3" className="max-w-none" style={{ height: iconSize, maxWidth: '120px' }} />
                  </EditableElement>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Hình ảnh bên ngoài (nếu không phải layout middle) */}
          {layout !== 'image-middle' && (
            <motion.div
              initial={{ 
                opacity: 0, 
                x: isVertical ? 0 : (isImageLeft ? -30 : 30),
                y: isVertical ? (layout === 'image-top' ? -30 : 30) : 0
              }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`${isVertical ? 'w-full' : 'lg:sticky lg:top-32'} relative z-20 w-full ${layout === 'image-top' ? 'order-first mb-8 lg:mb-12' : (layout === 'image-bottom' ? 'order-last mt-8 lg:mt-12' : '')}`}
              style={typeof window !== 'undefined' && window.innerWidth >= 1024 ? imageColStyle : { width: '100%' }}
            >
              {/* Main Image Container - Sharp Corners & Heavy Shadow */}
              <div className={`relative ${displayImages.length > 1 ? 'aspect-auto' : 'aspect-[4/3]'} rounded-none overflow-hidden shadow-[20px_20px_40px_-10px_rgba(0,0,0,0.3)] lg:shadow-[30px_30px_60px_-15px_rgba(0,0,0,0.4)] border-b-[8px] lg:border-b-[12px] border-primary group`}>
                {renderMediaGrid()}
              </div>
              
              {/* Stats Badge - Optimized for Mobile */}
              <div className="absolute -bottom-6 -left-2 md:-bottom-10 md:-left-12 p-6 md:p-10 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] lg:shadow-[0_40px_100px_rgba(0,0,0,0.35)] border-l-[6px] lg:border-l-[10px] border-primary max-w-[240px] md:max-w-[320px] z-[60] transform hover:-translate-y-2 transition-all duration-500">
                <div className="relative mb-3">
                  <EditableElement
                    type="text"
                    fieldKey="exp_value"
                    sectionId={sectionId}
                    defaultContent={dExpValue}
                    className="text-4xl md:text-6xl font-black text-primary block"
                  >
                    {dExpValue}
                  </EditableElement>
                </div>
                <div className="relative">
                  <EditableElement
                    type="text"
                    fieldKey="exp_text"
                    sectionId={sectionId}
                    defaultContent={dExpText}
                    className="text-slate-800 font-extrabold uppercase tracking-[0.2em] text-[10px] md:text-xs leading-relaxed block"
                  >
                    {dExpText}
                  </EditableElement>
                  <div className="w-12 h-1 bg-primary mt-2" />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

// --- BLOCK 2: INDUSTRIAL SECTORS ---
export const HomeV2SectorsBlock = ({
  title,
  subtitle,
  items,
  sectionId
}: any) => {
  const { t } = useTranslation();

  const displayTitle = title || t('home_v2_sectors_title', "Lĩnh Vực Hoạt Động");
  const displaySubtitle = subtitle || t('home_v2_sectors_subtitle', "Chúng tôi cung cấp giải pháp chuyên biệt cho các ngành công nghiệp trọng điểm.");

  const defaultSectors = [
    { title: "Dịch Vụ Kỹ Thuật", desc: "Bảo trì, sửa chữa và vận hành.", icon: Award, bg: "https://images.unsplash.com/photo-1581092921461-7d1598637f9d?auto=format&fit=crop&q=80&w=600", link: "/services" },
    { title: "Máy Gia Công", desc: "Các giải pháp máy móc công nghiệp hiện đại.", icon: Zap, bg: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600", link: "/products" },
    { title: "Sản Xuất Đồ Gia Dụng", desc: "Dây chuyền sản xuất thiết bị gia đình.", icon: Globe, bg: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=600", link: "/products" },
    { title: "Thiết Bị Giặt Là Công Nghiệp", desc: "Giải pháp giặt là quy mô lớn.", icon: Settings, bg: "https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=600", link: "/products" }
  ];

  const displaySectors = items && items.length > 0 ? items : defaultSectors;

  // Map icon based on index for variety
  const getIcon = (index: number) => {
    const icons = [Award, Zap, Globe, Settings];
    return icons[index % icons.length];
  };

  return (
    <section className="py-24 bg-slate-50" data-section-id={sectionId}>
      <div className="container-custom">
        <div className="max-w-3xl mx-auto mb-20">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl font-black mb-6 text-slate-900 block" />
          <EditableElement tagName="div" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-slate-600 block" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySectors.map((sector: any, i: number) => {
            const IconComponent = getIcon(i);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl aspect-[3/4] bg-slate-900"
              >
                <EditableElement
                  type="image"
                  fieldKey={`items.${i}.bg`}
                  sectionId={sectionId}
                  defaultContent={sector.bg}
                  className="absolute inset-0 w-full h-full"
                >
                  <img src={sector.bg} alt={sector.title} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700" />
                </EditableElement>
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent p-8 flex flex-col justify-end pointer-events-none">
                  <div className="flex flex-col items-start w-full">
                    {/* Icon Container with fixed height and alignment */}
                    <div className="h-12 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/20 backdrop-blur-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all pointer-events-auto">
                        <IconComponent className="w-6 h-6" />
                      </div>
                    </div>
                    
                    <div className="pointer-events-auto w-full">
                      {/* Title Container with fixed height and bottom alignment */}
                      <div className="h-20 flex items-end mb-3">
                        <EditableElement 
                          tagName="h3" 
                          fieldKey={`items.${i}.title`} 
                          sectionId={sectionId} 
                          defaultContent={sector.title} 
                          className="text-2xl font-bold text-white block leading-tight" 
                        />
                      </div>
                      
                      {/* Description Container with fixed height */}
                      <div className="h-12 overflow-hidden">
                        <EditableElement 
                          tagName="p" 
                          fieldKey={`items.${i}.desc`} 
                          sectionId={sectionId} 
                          defaultContent={sector.desc} 
                          className="text-slate-300 text-xs md:text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 block leading-relaxed" 
                        />
                      </div>
                    </div>

                    {/* Link Container with fixed height to prevent pushing */}
                    <div className="h-8 mt-4">
                      <Link 
                        to={sector.link || "/products"} 
                        className="flex items-center text-primary text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0 pointer-events-auto"
                      >
                        {t('view_detail', 'Xem chi tiết')} <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const displayTitle = title || t('home_v2_solutions_title', "Giải Pháp Năng Lượng & Hệ Thống Nén");
  const displaySubtitle = subtitle || t('home_v2_solutions_subtitle', "Các dòng sản phẩm tuabin khí và máy nén khí hàng đầu thế giới.");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.getProducts();
        if (result.success) {
          // Lấy tối đa 3 sản phẩm mới nhất hoặc nổi bật
          setProducts(result.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching products for solutions block:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fallback nếu chưa có sản phẩm trong DB
  const fallbackSolutions = [
    { id: 'f1', name: "Gas Turbine Packages", description: "Công suất từ 1MW đến 22MW, hiệu suất vượt trội.", image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1280", slug: "gas-turbine-packages" },
    { id: 'f2', name: "Gas Compressors", description: "Thiết kế ly tâm hiện đại cho vận chuyển khí.", image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1280", slug: "gas-compressors" },
    { id: 'f3', name: "Customer Support", description: "Dịch vụ sau bán hàng toàn diện, linh kiện chính hãng.", image_url: "https://images.unsplash.com/photo-1521737706045-3205363958c2?auto=format&fit=crop&q=80&w=1280", slug: "customer-support" }
  ];

  const displayProducts = products.length > 0 ? products : fallbackSolutions;

  return (
    <section className="py-24 bg-white" data-section-id={sectionId}>
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-4xl font-black mb-6 text-slate-900 block" />
            <EditableElement tagName="div" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-slate-600 block" />
          </div>
          <Link to="/products" className="btn-primary flex items-center shrink-0">
            {t('all_solutions', 'Tất cả giải pháp')} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-10">
            {displayProducts.map((product: any, i) => (
              <motion.div
                key={product.id || i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="group"
              >
                <div className="rounded-[2.5rem] overflow-hidden aspect-video mb-8 relative shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img src={product.image_url || "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                <p className="text-slate-600 mb-6 line-clamp-2">{product.description}</p>
                <Link to={product.slug ? `/products/${product.slug}` : "/products"} className="inline-flex items-center text-primary font-bold hover:gap-3 transition-all">
                  {t('learn_more', 'Tìm hiểu thêm')} <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
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
        <div className="max-w-3xl mx-auto mb-20">
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
