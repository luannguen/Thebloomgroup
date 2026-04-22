import React, { useEffect, useState } from 'react';
import { Facebook, Twitter, Linkedin, Youtube, Mail, Loader2, MapPin, PhoneCall, Headset, ExternalLink } from 'lucide-react';
import { navigationService } from '@/services/navigationService';
import { useSettings } from '@/hooks/useSettings';
import { NavigationItem } from '@/components/data/types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { normalizePath, isExternalLink } from '@/utils/urlUtils';
import Logo from './header/Logo';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [footerMenus, setFooterMenus] = useState<NavigationItem[]>([]);
  const { settings, loading } = useSettings();

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const navResult = await navigationService.getNavigationItems();
        if (navResult.success && navResult.data) {
          const allFooterItems = navResult.data.filter(item => item.position === 'footer');
          const itemMap: Record<string, NavigationItem> = {};
          const roots: NavigationItem[] = [];

          allFooterItems.forEach(item => {
            itemMap[item.id] = { ...item, children: [] };
          });

          allFooterItems.forEach(item => {
            const mappedItem = itemMap[item.id];
            if (item.parent_id && itemMap[item.parent_id]) {
              itemMap[item.parent_id].children?.push(mappedItem);
            } else if (!item.parent_id) {
              roots.push(mappedItem);
            }
          });

          const sortItems = (items: NavigationItem[]) => {
            items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
            items.forEach(item => {
              if (item.children && item.children.length > 0) {
                sortItems(item.children);
              }
            });
          };

          sortItems(roots);
          setFooterMenus(roots);
        }
      } catch (error) {
        console.error("Failed to load footer nav", error);
      }
    };
    fetchNav();
  }, []);

  const getTranslatedLabel = (item: NavigationItem | { label: string, path?: string }) => {
    const currentLang = i18n.language || 'vi';
    if (currentLang.startsWith('vi') && item.label) {
      return item.label;
    }
    if (item.label) {
      const translated = t(item.label);
      if (translated && translated !== item.label) return translated;
      const lowerTranslated = t(item.label.toLowerCase());
      if (lowerTranslated && lowerTranslated !== item.label.toLowerCase()) return lowerTranslated;
    }

    const pathToKeyMap: Record<string, string> = {
      '/': 'home', '/about': 'about', '/about-us': 'about', '/products': 'products',
      '/news': 'news', '/contact': 'contact', '/services': 'services', '/projects': 'projects',
      '/team': 'team', '/recruitment': 'recruitment', '/publications': 'publications',
      '/technologies': 'technologies', '/he-thong-tich-hop': 'integrated_systems',
      '/ho-so-nang-luc': 'capability_experience',
    };

    if (item.path && pathToKeyMap[item.path]) {
      const translated = t(pathToKeyMap[item.path]);
      if (translated && translated !== pathToKeyMap[item.path]) return translated;
    }
    return item.label;
  };

  const currentLang = i18n.language || 'vi';
  const isVi = currentLang.startsWith('vi');

  const getLocalizedSetting = (baseKey: string) => {
    if (isVi) return settings[baseKey];
    const localizedVal = settings[`${baseKey}_${currentLang}`];
    
    if (localizedVal && localizedVal.trim() !== '') {
      // SMART FALLBACK LOGIC:
      // 1. If it's an address, it MUST be JSON (starts with [ or {) inside the new system
      if (baseKey === 'contact_address') {
        if (localizedVal.startsWith('[') || localizedVal.startsWith('{')) return localizedVal;
        // else fallback to master which is a JSON string
      } 
      // 2. If it's copyright and contains 2024, it's considered stale
      else if (baseKey === 'copyright_text') {
        if (!localizedVal.includes('2024')) return localizedVal;
        // else fallback to master which we updated to 2026
      }
      else {
        return localizedVal;
      }
    }
    return settings[baseKey];
  };

  const rawLocalizedCopyright = isVi ? settings['copyright_text'] : (settings[`copyright_text_${currentLang}`] || t('copyright'));
  const localizedCopyright = rawLocalizedCopyright;
  const copyrightText = localizedCopyright || settings['copyright_text'] || `© ${new Date().getFullYear()} ${settings['company_name'] || 'The Bloom Group'}. All rights reserved.`;
  const contactEmail = settings['contact_email'] || '';
  const contactAddress = getLocalizedSetting('contact_address') || '';
  const contactHotline = settings['contact_hotline'] || settings['contact_phone'] || '';
  const siteDescription = getLocalizedSetting('site_description') || '';

  // Parser for the multi-office contact string
  // Parser for the multi-branch structured data
  const parseOffices = () => {
    if (!contactAddress) return [];
    
    try {
      // 1. Try parsing as JSON first (new structured data)
      if (contactAddress.startsWith('[') || contactAddress.startsWith('{')) {
        const data = JSON.parse(contactAddress);
        const branchArray = Array.isArray(data) ? data : [data];
        return branchArray.map(b => ({
          title: b.title,
          details: [
            b.address,
            b.phone ? `${isVi ? 'Điện thoại: ' : 'Phone: '} ${b.phone}` : '',
            b.email ? `Email: ${b.email}` : ''
          ].filter(Boolean),
          mapUrl: b.map_url
        }));
      }
    } catch (e) {
      console.warn("JSON parse failed, falling back to legacy parser", e);
    }

    // 2. Legacy Parser Fallback
    const blocks = contactAddress.split(/\n\n+/).filter(b => b.trim().length > 0);
    const startIndex = blocks[0] && !blocks[0].includes(':') ? 1 : 0;
    
    return blocks.slice(startIndex).map(block => {
      const lines = block.split('\n').map(l => l.trim());
      const title = lines[0].replace(':', '');
      const details = lines.slice(1);
      return { title, details };
    });
  };

  const offices = parseOffices();

  if (loading) return <footer className="bg-primary text-white py-12"><div className="flex justify-center"><Loader2 className="animate-spin" /></div></footer>;

  return (
    <footer className="bg-primary text-white border-t border-white/5">
      {/* Upper Footer: Branding & Navigation */}
      <div className="container-custom pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-6">
            <Logo variant="footer" className="inline-block" />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              {siteDescription}
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: Facebook, url: settings['social_facebook'], label: 'Facebook' },
                { icon: Twitter, url: settings['social_twitter'], label: 'Twitter' },
                { icon: Linkedin, url: settings['social_linkedin'], label: 'LinkedIn' },
                { icon: Youtube, url: settings['social_youtube'], label: 'YouTube' }
              ].map((social, idx) => social.url && (
                <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" 
                    className="w-10 h-10 bg-white/5 flex items-center justify-center text-gray-400 hover:bg-accent hover:text-white transition-all duration-300"
                    aria-label={social.label}>
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Columns (Menu Manager) */}
          {footerMenus.map((menu) => (
            <div key={menu.id} className="lg:col-span-2">
              <h4 className="text-white font-bold text-base mb-6 relative inline-block">
                {getTranslatedLabel(menu)}
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-0.5 bg-accent rounded-full"></span>
              </h4>
              <ul className="space-y-3">
                {menu.children?.map((child) => (
                  <li key={child.id}>
                    <Link 
                      to={normalizePath(child.path)} 
                      className="text-gray-400 hover:text-accent transition-colors text-sm flex items-center group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-accent transition-all duration-300 mr-0 group-hover:mr-2"></span>
                      {getTranslatedLabel(child)}
                      {isExternalLink(child.path) && <ExternalLink size={12} className="ml-1 opacity-50" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Fast Contact Column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-base mb-6 relative inline-block">
                {t('contact')}
                <span className="absolute -bottom-1.5 left-0 w-1/2 h-0.5 bg-accent rounded-full"></span>
            </h4>
            <div className="space-y-5">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                        <Headset size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">{t('hotline')}</p>
                        <a href={`tel:${contactHotline.replace(/\s/g, '')}`} className="text-white font-semibold hover:text-accent transition-colors block">
                            {contactHotline}
                        </a>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                        <Mail size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-0.5">{t('email')}</p>
                        <a href={`mailto:${contactEmail}`} className="text-white font-semibold hover:text-accent transition-colors block break-all">
                            {contactEmail}
                        </a>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Footer: Office Network Grid */}
      {offices.length > 0 && (
        <div className="bg-white/5 py-12 px-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <MapPin className="text-accent" size={20} />
                        {t('office_network')}
                    </h3>
                    <div className="h-px flex-grow bg-white/5 mx-4 hidden md:block"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {offices.map((office, idx) => (
                        <div key={idx} className="bg-white/5 p-6 border border-white/5 hover:border-accent/30 transition-all duration-300 group flex flex-col h-full">
                            <h5 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:scale-125 transition-transform"></span>
                                {t(office.title, { defaultValue: office.title })}
                            </h5>
                            <div className="space-y-3 flex-grow">
                                {office.details.map((detail, dIdx) => {
                                    const isPhone = detail.toLowerCase().includes('điện thoại') || detail.toLowerCase().includes('phone');
                                    const isEmail = detail.toLowerCase().includes('email');
                                    
                                    return (
                                        <div key={dIdx} className="flex gap-3 text-sm text-gray-400 leading-relaxed group/line">
                                            {isPhone ? (
                                                <PhoneCall size={14} className="mt-0.5 text-accent/60 flex-shrink-0 group-hover/line:text-accent transition-colors" />
                                            ) : isEmail ? (
                                                <Mail size={14} className="mt-0.5 text-accent/60 flex-shrink-0 group-hover/line:text-accent transition-colors" />
                                            ) : (
                                                <MapPin size={14} className="mt-0.5 text-accent/60 flex-shrink-0 group-hover/line:text-accent transition-colors" />
                                            )}
                                            <span className={isPhone || isEmail ? "text-gray-300 font-medium group-hover/line:text-white transition-colors" : "group-hover/line:text-gray-200 transition-colors"}>
                                                {t(detail, { defaultValue: detail })}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            {(office as any).mapUrl && (
                                <a 
                                  href={(office as any).mapUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-white transition-colors border border-accent/20 hover:border-accent bg-accent/5 hover:bg-accent px-3 py-2 rounded-lg self-start"
                                >
                                  <ExternalLink size={12} />
                                  {t('view_on_maps')}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}

      {/* Bottom Bar: Copyright & Legal */}
      <div className="bg-primary-darker py-6 border-t border-white/5">
        <div className="container-custom">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                <p className="text-gray-500 text-xs tracking-wide">
                    {copyrightText}
                </p>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs">
                    {[
                        { to: "/legal/privacy", label: 'privacy_policy' },
                        { to: "/legal/terms", label: 'terms_of_use' },
                        { to: "/legal/cookies", label: 'cookie_policy' },
                        { to: "/legal/sitemap", label: 'sitemap' }
                    ].map((link, idx) => (
                        <Link key={idx} to={link.to} className="text-gray-500 hover:text-white transition-colors uppercase font-medium">
                            {t(link.label)}
                        </Link>
                    ))}
                </div>
                {/* Scroll to Top placeholder or other element */}
                <div className="hidden lg:block text-gray-600 text-[10px] italic">
                    Certified ISO 9001:2015
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
