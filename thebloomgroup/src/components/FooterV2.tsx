import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Loader2, MapPin, PhoneCall, Headset, ExternalLink, ArrowRight } from 'lucide-react';
import { navigationService } from '@/services/navigationService';
import { useSettings } from '@/hooks/useSettings';
import { NavigationItem } from '@/components/data/types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { normalizePath, isExternalLink } from '@/utils/urlUtils';
import Logo from './header/Logo';
import { useNavigation } from '@/hooks/useNavigation';

const FooterV2 = () => {
  const { t, i18n } = useTranslation();
  const { navItems: footerMenus, isLoading: navLoading } = useNavigation('footer');
  const { settings, loading: settingsLoading } = useSettings();

  const getTranslatedLabel = (item: NavigationItem | { label: string, path?: string }) => {
    const currentLang = i18n.language || 'vi';
    if (currentLang.startsWith('vi') && item.label) {
      return item.label;
    }
    if (item.label) {
      const translated = t(item.label);
      if (translated && translated !== item.label) return translated;
    }
    return item.label;
  };

  const currentLang = i18n.language || 'vi';
  const isVi = currentLang.startsWith('vi');

  const getLocalizedSetting = (baseKey: string) => {
    if (isVi) return settings[baseKey];
    const localizedVal = settings[`${baseKey}_${currentLang}`];
    return (localizedVal && localizedVal.trim() !== '') ? localizedVal : settings[baseKey];
  };

  const copyrightText = getLocalizedSetting('copyright_text') || `© ${new Date().getFullYear()} ${settings['company_name'] || 'The Bloom Group'}. All rights reserved.`;
  const contactEmail = settings['contact_email'] || '';
  const contactHotline = settings['contact_hotline'] || settings['contact_phone'] || '';
  const contactAddress = getLocalizedSetting('contact_address') || '';

  const parseOffices = () => {
    if (!contactAddress) return [];
    try {
      if (contactAddress.startsWith('[') || contactAddress.startsWith('{')) {
        const data = JSON.parse(contactAddress);
        return Array.isArray(data) ? data : [data];
      }
    } catch (e) { }
    return [];
  };

  const offices = parseOffices();
  const mainOffice = offices.find(o => o.is_main) || offices[0];

  if (settingsLoading || navLoading) return null;

  return (
    <footer 
      className="relative text-white overflow-hidden font-sans"
      style={{ 
        backgroundColor: '#374fa1',
        backgroundImage: 'url(/assets/patterns/congruent_outline.png)',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center top'
      }}
    >
      {/* Background Pattern Overlay - Removed current overlay as it's merged into main background style */}

      <div className="container-custom relative z-10 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Head Office Info */}
          <div className="lg:col-span-4 space-y-8">
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-white/50"></span>
                {t('head_office')}
              </h4>
              {mainOffice ? (
                <div className="space-y-4">
                  <div className="flex gap-4 group">
                    <MapPin className="text-white/80 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white transition-colors">
                      {mainOffice.address}
                    </p>
                  </div>
                  <div className="flex gap-4 group">
                    <PhoneCall className="text-white/80 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                    <a href={`tel:${mainOffice.phone}`} className="text-white/70 text-sm hover:text-white transition-colors">
                      {mainOffice.phone}
                    </a>
                  </div>
                  <div className="flex gap-4 group">
                    <Mail className="text-white/80 flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                    <a href={`mailto:${mainOffice.email}`} className="text-white/70 text-sm hover:text-white transition-colors">
                      {mainOffice.email}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-white/50 text-sm">Cập nhật thông tin liên hệ...</p>
              )}
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, url: settings['social_facebook'] },
                { icon: Twitter, url: settings['social_twitter'] },
                { icon: Linkedin, url: settings['social_linkedin'] },
                { icon: Youtube, url: settings['social_youtube'] }
              ].map((social, idx) => social.url && (
                <a 
                  key={idx} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:border-white hover:text-white transition-all duration-300 rounded-full"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {footerMenus.map((menu) => (
                <div key={menu.id}>
                  <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                    <span className="w-4 h-px bg-white/50"></span>
                    {getTranslatedLabel(menu)}
                  </h4>
                  <ul className="space-y-3">
                    {menu.children?.map((child) => (
                      <li key={child.id}>
                        <Link 
                          to={normalizePath(child.path)} 
                          className="text-white/70 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                        >
                          <ArrowRight size={12} className="text-white opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          {getTranslatedLabel(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Extras/Certifications maybe? */}
              <div className="space-y-6">
                <h4 className="text-white font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
                  <span className="w-4 h-px bg-white/50"></span>
                  {t('global_support')}
                </h4>
                <div className="bg-white/10 p-4 border border-white/20 rounded-sm">
                   <p className="text-xs text-white/80 leading-relaxed italic">
                     {t('footer_support_text', { defaultValue: 'Our world-class solutions are supported by a global network of dedicated professionals.' })}
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Divider */}
        <div className="mt-20 pt-10 border-t border-white/20 flex flex-col items-center">
           <div className="mb-8">
             <Logo variant="footer" className="opacity-100" />
           </div>
           
           <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
             <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">
                <Link to="/legal/privacy" className="hover:text-[#374fa1] transition-colors">{t('privacy_policy')}</Link>
                <Link to="/legal/terms" className="hover:text-[#374fa1] transition-colors">{t('terms_of_use')}</Link>
                <Link to="/legal/cookies" className="hover:text-[#374fa1] transition-colors">{t('cookie_policy')}</Link>
             </div>
             
             <p className="text-gray-600 text-[10px] uppercase tracking-widest text-center md:text-right">
               {copyrightText}
             </p>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterV2;
