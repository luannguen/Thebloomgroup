import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';
import logoSrc from '@/assets/images/logo-ttt.svg';

interface LogoProps {
  isScrolled?: boolean;
  className?: string;
  variant?: 'header' | 'footer';
}

const Logo = ({ isScrolled = false, className = "", variant = 'header' }: LogoProps) => {
  const { settings, loading } = useSettings();
  const { t } = useTranslation();
  
  if (loading) {
    return (
      <div className={`flex items-center flex-shrink-0 animate-pulse bg-gray-100 rounded-md ${
        isScrolled ? 'h-[40px] w-[120px]' : 'h-[50px] w-[150px] md:h-[80px] md:w-[200px]'
      }`}>
      </div>
    );
  }

  const displayLogo = settings?.logo_url || logoSrc;
  const siteName = settings?.site_name || t('logo_alt_text');

  return (
    <Link to="/" className={`flex items-center gap-2 flex-shrink-0 relative z-10 transition-transform active:scale-95 ${className}`}>
      <img
        src={displayLogo}
        alt={siteName}
        className={`object-contain transition-all duration-500 ease-in-out ${
          variant === 'footer'
            ? 'h-14 lg:h-16 brightness-0 invert'
            : isScrolled 
              ? 'h-[40px] md:h-[60px]' 
              : 'h-[50px] md:h-[100px] brightness-0 invert'
        }`}
      />
    </Link>
  );
};

export default Logo;