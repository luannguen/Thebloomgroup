import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Tag, ExternalLink, Package, LayoutGrid, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';
import { projectService } from '@/services/projectService';
import { productService } from '@/services/productService';
import { Project, Product, Category } from '@/components/data/types';
import { mockNewsItems } from '@/components/data/mock/newsData';

// --- NEWS & EVENTS BLOCK ---
import { newsAPI } from '@/components/data/services/newsService';
import { NewsItem } from '@/components/data/models/news';

export const NewsEventsBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t, i18n } = useTranslation();
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const result = await newsAPI.getAll();
      if (result.success) {
        setNewsList(result.data.slice(0, 4));
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container-custom text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-slate-200 rounded mb-4"></div>
            <div className="h-4 w-96 bg-slate-100 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  if (newsList.length === 0) return null;

  const featuredNews = newsList[0];
  const otherNews = newsList.slice(1);

  const displayTitle = title || t('home_news_title', "Tin tức & Sự kiện");
  const displaySubtitle = subtitle || t('home_news_subtitle', "Cập nhật những hoạt động mới nhất, công nghệ tiên tiến và thông tin ngành từ Thebloomgroup.");

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-4xl font-bold mb-4" />
            <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-muted-foreground" />
          </div>
          <Link to="/news" className="mt-6 md:mt-0 inline-flex items-center text-primary font-bold hover:gap-2 transition-all">
            {t('view_all_news_posts', 'Xem tất cả bài viết')} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2 group">
            <Link to={`/news/${featuredNews.slug}`} className="block relative overflow-hidden rounded-2xl aspect-[16/9]">
              <img 
                src={featuredNews.image} 
                alt={featuredNews.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center gap-4 text-white/80 text-sm mb-4">
                  <span className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    {featuredNews.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {new Date(featuredNews.publishDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN')}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-secondary transition-colors">
                  {featuredNews.title}
                </h3>
                <p className="text-white/70 line-clamp-2 max-w-2xl mb-2">
                  {featuredNews.summary}
                </p>
              </div>
            </Link>
          </div>

          {/* Side List */}
          <div className="space-y-6">
            {otherNews.map((news) => (
              <Link key={news.id} to={`/news/${news.slug}`} className="flex gap-4 group">
                <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-xs text-primary font-bold uppercase mb-1">{news.category}</div>
                  <h4 className="font-bold text-base line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                    {news.title}
                  </h4>
                  <div className="text-xs text-muted-foreground mt-2">{new Date(news.publishDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'vi-VN')}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- PROJECTS BLOCK ---
export const ProjectsBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await projectService.getProjects({ featured: true, limit: 3 });
      if (result.success) {
        setProjects(result.data);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const displayTitle = title || t('home_projects_title', "Dự Án Tiêu Biểu");
  const displaySubtitle = subtitle || t('home_projects_subtitle', "Những công trình thực tế khẳng định năng lực thi công và chất lượng giải pháp từ Thebloomgroup.");

  return (
    <section className="py-20 bg-slate-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-4xl font-bold mb-6" />
          <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-muted-foreground" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
            ))
          ) : (
            projects.map((project) => (
              <Link key={project.id} to={`/project-details/${project.id}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-primary">
                <img 
                  src={project.image_url || "/placeholder.svg"} 
                  alt={project.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-60" 
                />
                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-secondary font-bold text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {typeof project.category === 'object' ? (project.category as any).name : t('project', 'Dự án')}
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">{project.name}</h3>
                  <div className="flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {t('project_details', 'Chi tiết dự án')} <ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="w-5 h-5" />
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/projects" className="btn-primary">{t('all_projects_works', 'Tất cả dự án công trình')}</Link>
        </div>
      </div>
    </section>
  );
};

// --- PRODUCTS BLOCK ---
export const ProductsBlock = ({
  title,
  subtitle,
  sectionId
}: any) => {
  const { t } = useTranslation();
  
  const displayTitle = title || t('home_products_title_dist', "Sản Phẩm Phân Phối");
  const displaySubtitle = subtitle || t('home_products_subtitle_dist', "Chúng tôi là đối tác chiến lược của các hãng thiết bị điện lạnh hàng đầu thế giới, cung cấp hệ thống vật tư tiêu chuẩn quốc tế.");

  const categories = [
    { name: t('home_prod_cat1', "Cụm Máy Chiller"), icon: Package, desc: t('home_prod_cat1_desc', "Trane, Daikin, York - Hiệu suất cao, tiết kiệm điện") },
    { name: t('home_prod_cat2', "Kho Lạnh Công Nghiệp"), icon: LayoutGrid, desc: t('home_prod_cat2_desc', "Panel cách nhiệt, cửa kho lạnh tiêu chuẩn ISO") },
    { name: t('home_prod_cat3', "Điều Hòa VRV / VRF"), icon: Tag, desc: t('home_prod_cat3_desc', "Giải pháp đa kết nối cho tòa nhà và biệt thự") },
    { name: t('home_prod_cat4', "Vật Tư Phụ Trợ"), icon: CheckCircle, desc: t('home_prod_cat4_desc', "Ống đồng, bảo ôn, gas lạnh chính hãng") }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <EditableElement tagName="h2" fieldKey="title" sectionId={sectionId} defaultContent={displayTitle} className="text-3xl md:text-4xl font-bold mb-6" />
            <EditableElement tagName="p" fieldKey="subtitle" sectionId={sectionId} defaultContent={displaySubtitle} className="text-lg text-muted-foreground mb-8" />
            <Link to="/products" className="btn-outline inline-flex items-center">
              {t('view_product_catalog', 'Xem danh mục sản phẩm')} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {categories.map((cat, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-100 hover:border-primary/20 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <cat.icon className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <h4 className="font-bold text-lg mb-2">{cat.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">{t('bulk_quote_request', 'Bạn cần báo giá thiết bị số lượng lớn?')}</h3>
              <p className="text-white/70">{t('bulk_quote_request_desc', 'Liên hệ ngay với bộ phận dự án để nhận chính sách giá ưu đãi và hỗ trợ kỹ thuật chuyên sâu từ các chuyên gia của Thebloomgroup.')}</p>
            </div>
            <Link to="/contact" className="px-8 py-4 bg-secondary text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-xl shrink-0">
              {t('get_quote_now', 'Nhận báo giá ngay')}
            </Link>
          </div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};
