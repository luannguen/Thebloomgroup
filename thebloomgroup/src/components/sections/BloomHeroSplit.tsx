import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const BloomHeroSplit: React.FC<{ sectionId?: string }> = ({ sectionId }) => {
  const cards = [
    {
      id: 'laundry',
      title: 'Thiết Bị Giặt Là Công Nghiệp',
      link: '/thiet-bi-giat-la',
      image: '/images/bloom/hero-giat-la.jpg',
      iconBg: 'bg-[#1e293b]',
      iconBorder: 'border-slate-700',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
          <rect x="3" y="2" width="18" height="20" rx="3" />
          <circle cx="12" cy="13" r="5" />
          <circle cx="12" cy="13" r="2.5" />
          <line x1="7" y1="6" x2="7.01" y2="6" strokeWidth="2.5" />
          <line x1="11" y1="6" x2="13" y2="6" strokeWidth="2" />
        </svg>
      ),
      buttonText: 'Nhận tư vấn'
    },
    {
      id: 'garment',
      title: 'May Gia Công',
      link: '/thoi-trang-may-mac',
      image: '/images/bloom/hero-may-gia-cong.jpg',
      iconBg: 'bg-[#b8860b]',
      iconBorder: 'border-[#996515]',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
          <path d="M12 2v3" />
          <path d="M8 5a4 4 0 0 1 8 0c1 2 2 4.5 2 7-1 2.5-3 4-6 4s-5-1.5-6-4c0-2.5 1-5 2-7z" />
          <path d="M12 16v6" />
          <path d="M8 22h8" />
        </svg>
      ),
      buttonText: 'Xem chi tiết'
    },
    {
      id: 'home_appliances',
      title: 'Sản Xuất Đồ Gia Dụng',
      link: '/khong-gian-song',
      image: '/images/bloom/hero-do-gia-dung.jpg',
      iconBg: 'bg-[#0f3b60]',
      iconBorder: 'border-blue-900',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
          <path d="M9 21V12h6v9" />
        </svg>
      ),
      buttonText: 'Xem chi tiết'
    }
  ];

  return (
    <section className="relative w-full pt-10 md:pt-14 pb-12 bg-slate-50 border-b border-slate-200/60 overflow-hidden select-none" data-section-id={sectionId}>
      {/* Watermark Banner Text across the top */}
      <div className="w-full text-center py-4 md:py-6 overflow-hidden">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1e293b] tracking-[0.15em] md:tracking-[0.22em] uppercase font-sans drop-shadow-sm opacity-90 transition-all duration-300">
          KẾT NỐI - SẢN XUẤT - NÂNG TẦM GIÁ TRỊ
        </h1>
      </div>

      {/* Main 3-Column Split Display */}
      <div className="container-custom px-2 sm:px-4 mx-auto relative">
        {/* Navigation arrows (decorative / slider feel) */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-30 hidden xl:flex">
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-95"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 z-30 hidden xl:flex">
          <button 
            type="button"
            className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-95"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 lg:gap-6 items-stretch">
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              className="flex flex-col group relative rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 bg-white"
            >
              {/* Header Tab with Icon and Title */}
              <div className="flex items-center gap-3 px-4 py-3.5 bg-white border-b border-slate-100 z-10 transition-colors group-hover:bg-slate-50">
                <div className={`w-11 h-11 rounded-full ${card.iconBg} ${card.iconBorder} border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                  {card.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1e293b] tracking-tight leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
              </div>

              {/* Image Container with Hover Zoom & Action Button */}
              <Link 
                to={card.link}
                className="relative block w-full h-[320px] sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[540px] overflow-hidden cursor-pointer"
              >
                <img 
                  src={card.image} 
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading={idx === 0 ? "eager" : "lazy"}
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Action button inside image */}
                <div className="absolute bottom-6 left-6 z-20">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-black/60 hover:bg-black/85 text-white text-sm font-semibold tracking-wide backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 transform group-hover:translate-y-[-2px] group-hover:bg-black/90">
                    <span>{card.buttonText}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BloomHeroSplit;
