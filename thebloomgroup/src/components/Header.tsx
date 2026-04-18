import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './header/Logo';
import MainNavigation from './header/MainNavigation';
import LanguageSwitcher from './header/LanguageSwitcher';
import SearchComponent from './header/SearchComponent';
import TopContact from './TopContact';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* TopContact - hide when scrolled for more space */}
      {!isScrolled && <TopContact />}

      {/* Main header */}
      <header
        className={`bg-primary/10 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-md bg-white/95' : ''
        }`}
      >
        <div className="container-custom">
          <div className={`flex justify-between items-center transition-all duration-300 ${
            isScrolled ? 'py-1' : 'py-1.5'
          }`}>
            {/* Logo - shrinks on scroll */}
            <Logo isScrolled={isScrolled} />

            {/* Desktop Navigation */}
            <MainNavigation />

            {/* Desktop actions */}
            <div className="hidden md:flex items-center space-x-4">
              <SearchComponent />
              <LanguageSwitcher />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <SearchComponent isMobile={true} />
              <button 
                onClick={toggleMenu} 
                className={`p-1.5 rounded-md transition-colors ${
                  isScrolled ? 'text-gray-900 hover:bg-gray-100' : 'text-gray-900 hover:bg-white/20'
                }`}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-[100%] bg-white shadow-2xl border-t border-gray-100 animate-slide-in-right overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className="container-custom py-6 pb-10">
              <MainNavigation isMobile={true} onItemClick={() => setIsMenuOpen(false)} />
              <div className="mt-6 pt-6 border-t border-gray-100">
                <LanguageSwitcher isMobile={true} onItemClick={() => setIsMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
