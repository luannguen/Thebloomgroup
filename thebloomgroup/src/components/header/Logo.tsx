import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useNavigation } from '@/hooks/useNavigation';
import { useTranslation } from 'react-i18next';
import logoSrc from '@/assets/images/logo-ttt.svg';

interface LogoProps {
  isScrolled?: boolean;
  className?: string;
  variant?: 'header' | 'footer';
}

const Logo = ({ isScrolled = false, className = "", variant = 'header' }: LogoProps) => {
  const { settings, loading: settingsLoading } = useSettings();
  const { homePath, isLoading: navLoading } = useNavigation('header');
  const { t } = useTranslation();
  
  const loading = settingsLoading || navLoading;

  if (loading) {
    return (
      <div className={`flex items-center flex-shrink-0 animate-pulse bg-gray-100 rounded-md ${
        variant === 'footer' 
          ? 'h-14 w-32'
          : isScrolled ? 'h-[40px] w-[120px]' : 'h-[50px] w-[150px] md:h-[60px] md:w-[180px]'
      }`}>
      </div>
    );
  }

  const headerLogo = settings?.site_logo || logoSrc;
  const footerLogo = settings?.footer_logo || headerLogo;
  const displayLogo = variant === 'footer' ? footerLogo : headerLogo;
  const siteName = settings?.company_name || settings?.site_name || t('logo_alt_text');

  // Use the configured home path from navigation
  const destination = homePath || '/';

  return (
    <Link to={destination} className={`flex items-center gap-2 flex-shrink-0 relative z-10 transition-transform active:scale-95 ${className}`}>
      <img
        src={displayLogo}
        alt={siteName}
        className={`object-contain transition-all duration-500 ease-in-out ${
          variant === 'footer'
            ? 'h-14 lg:h-16'
            : isScrolled 
              ? 'h-[40px] md:h-[60px]' 
              : 'h-[50px] md:h-[80px]'
        }`}
      />
    </Link>
  );
};

export default Logo;