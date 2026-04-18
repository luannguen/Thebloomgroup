import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageOption {
  code: string;
  name: string;
  flagIcon: string;
}

const languageOptions: LanguageOption[] = [
  { code: 'vi', name: 'Tiếng Việt', flagIcon: '/assets/svg/flags/vi-flag.svg' },
  { code: 'en', name: 'English', flagIcon: '/assets/svg/flags/en-flag.svg' },
  { code: 'de', name: 'Deutsch', flagIcon: '/assets/svg/flags/de-flag.svg' },
  { code: 'fr', name: 'Français', flagIcon: '/assets/svg/flags/fr-flag.svg' },
  { code: 'ru', name: 'Русский', flagIcon: '/assets/svg/flags/ru-flag.svg' },
  { code: 'ja', name: '日本語', flagIcon: '/assets/svg/flags/ja-flag.svg' },
  { code: 'ko', name: '한국어', flagIcon: '/assets/svg/flags/ko-flag.svg' },
  { code: 'zh', name: '中文', flagIcon: '/assets/svg/flags/zh-flag.svg' },
  { code: 'hr', name: 'Hrvatski', flagIcon: '/assets/svg/flags/hr-flag.svg' },
  { code: 'sl', name: 'Slovenščina', flagIcon: '/assets/svg/flags/sl-flag.svg' },
  { code: 'sr', name: 'Српски', flagIcon: '/assets/svg/flags/sr-flag.svg' },
];

interface LanguageSwitcherProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const LanguageSwitcher = ({ isMobile = false, onItemClick }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure we use the short code (e.g., 'en', 'vi')
  const activeLanguage = i18n.language ? i18n.language.split('-')[0] : 'vi';

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
    if (onItemClick) onItemClick();
  };

  const getActiveLanguageDetails = () => {
    return languageOptions.find(lang => lang.code === activeLanguage) || languageOptions[0];
  };

  if (isMobile) {
    return (
      <div className="relative">
        <label className="block text-gray-500 text-xs uppercase font-bold mb-2 tracking-wider">
          {t('language')}
        </label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 transition-all active:bg-gray-100"
        >
          <div className="flex items-center gap-3">
            <img
              src={getActiveLanguageDetails().flagIcon}
              alt={getActiveLanguageDetails().name}
              className="w-6 h-6 rounded-sm shadow-sm"
            />
            <span className="font-medium text-base">{getActiveLanguageDetails().name}</span>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>

        {isOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 origin-bottom">
            <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto px-2">
              {languageOptions.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-colors ${
                    activeLanguage === lang.code 
                      ? 'bg-primary/5 text-primary font-bold' 
                      : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={lang.flagIcon}
                      alt={lang.name}
                      className="w-5 h-5 rounded-sm"
                    />
                    <span>{lang.name}</span>
                  </div>
                  {activeLanguage === lang.code && <Check size={18} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <button className="navbar-link flex items-center uppercase py-1">
        <img
          src={getActiveLanguageDetails().flagIcon}
          alt={getActiveLanguageDetails().name}
          className="w-5 h-5 mr-1.5 shadow-sm rounded-sm"
        />
        <span className="font-medium text-sm">{activeLanguage}</span>
        <ChevronDown size={14} className="ml-1 opacity-60" />
      </button>
      <div className="absolute hidden group-hover:block bg-white shadow-xl p-2 rounded-lg min-w-[160px] right-0 top-full z-50 animate-in fade-in slide-in-from-top-2">
        <div className="flex flex-col gap-1">
          {languageOptions.map(lang => (
            <button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left text-sm ${
                activeLanguage === lang.code 
                  ? 'bg-primary/10 text-primary font-bold' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <img
                src={lang.flagIcon}
                alt={lang.name}
                className="w-5 h-5 rounded-sm shadow-sm"
              />
              <span className="flex-1">{lang.name}</span>
              {activeLanguage === lang.code && <Check size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;