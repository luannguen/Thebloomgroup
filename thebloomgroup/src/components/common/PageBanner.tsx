import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
}

export const PageBanner: React.FC<PageBannerProps> = ({
  title,
  subtitle,
  badge,
  backgroundImage = '/images/bloom/hero-giat-la.jpg',
  breadcrumbs = [{ label: 'Trang chủ', href: '/' }],
  children,
  className = ''
}) => {
  return (
    <section className={`relative w-full pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden select-none bg-slate-950 text-white ${className}`}>
      {/* Background Image with Ambient Zoom */}
      <div className="absolute inset-0 z-0">
        <img
          src={backgroundImage}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        {/* Layered Overlays for Maximum Text Contrast and Readability */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          {/* Breadcrumbs Navigation */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-slate-300 mb-6 font-medium">
              <Link to="/" className="inline-flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  {crumb.href ? (
                    <Link to={crumb.href} className="hover:text-amber-400 transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-amber-400 font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Badge */}
          {badge && (
            <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-amber-500/30">
              {badge}
            </span>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
            {title}
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className="text-base sm:text-lg md:text-xl text-slate-200/90 leading-relaxed font-normal max-w-2xl">
              {subtitle}
            </p>
          )}

          {/* Optional Children/CTAs */}
          {children && <div className="mt-8 flex flex-wrap gap-4">{children}</div>}
        </div>
      </div>

      {/* Decorative Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-primary to-transparent" />
    </section>
  );
};

export default PageBanner;
