import { Link } from 'react-router-dom';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from 'react-i18next';

interface LogoProps {
  isScrolled?: boolean;
}

const Logo = ({ isScrolled = false }: LogoProps) => {
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

  const logoSrc = settings['site_logo'];
  
  // If no logo in settings, and not loading, we can show a text logo or the default
  if (!logoSrc) {
    return (
      <Link to="/" className="flex items-center gap-2 flex-shrink-0 relative z-10 transition-transform active:scale-95">
        <span className="text-xl md:text-2xl font-bold text-primary">VIET VINH</span>
      </Link>
    );
  }

  return (
    <Link to="/" className="flex items-center gap-2 flex-shrink-0 relative z-10 transition-transform active:scale-95">
      <img
        src={logoSrc}
        alt={t('logo_alt_text')}
        className={`object-contain transition-all duration-500 ease-in-out ${
          isScrolled 
            ? 'h-[40px] md:h-[60px]' 
            : 'h-[50px] md:h-[100px]'
        }`}
      />
    </Link>
  );
};

export default Logo;