import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from "@/hooks/useSettings";
import { Mail, Phone, MapPin, Clock, Facebook, Youtube } from 'lucide-react';
import { EditableElement } from '../admin/EditableElement';

export const ContactInfoBlock: React.FC<any> = ({ sectionId }) => {
  const { t, i18n } = useTranslation();
  const { settings } = useSettings();
  const currentLang = i18n.language || 'vi';
  const isDefaultLang = currentLang === 'vi';

  const getSetting = (key: string, defaultVal: string) => {
    const langKey = isDefaultLang ? key : `${key}_${currentLang}`;
    const localized = settings[langKey];
    
    if (localized && localized.trim() !== '') {
      return localized;
    }
    
    return settings[key] || defaultVal;
  };

  const getDisplayAddress = (val: string) => {
    try {
      if (val && (val.startsWith('[') || val.startsWith('{'))) {
        const data = JSON.parse(val);
        const branches = Array.isArray(data) ? data : [data];
        return branches[0]?.address || val;
      }
    } catch (e) {}
    return val;
  };

  const companyName = getSetting('company_name', 'The Bloom Group');
  const address = getDisplayAddress(getSetting('contact_address', ''));
  const phone = getSetting('contact_phone', '');
  const email = getSetting('contact_email', '');
  const workingHours = getSetting('contact_working_hours', '');

  const infoItems = [
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      label: t('address'),
      value: address,
      link: null
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      label: t('phone'),
      value: phone,
      link: `tel:${phone}`
    },
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      label: t('email'),
      value: email,
      link: `mailto:${email}`
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      label: t('working_hours'),
      value: workingHours,
      link: null
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <EditableElement 
              fieldKey="title" 
              tagName="h2" 
              sectionId={sectionId}
              defaultContent={t('contact_info')} 
              className="text-3xl font-bold text-primary mb-4"
            >
              {t('contact_info')}
            </EditableElement>
            <div className="w-20 h-1 bg-accent mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-primary">{companyName}</h3>
              <div className="space-y-8 mt-8">
                {infoItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-full shadow-sm">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                      {item.link ? (
                        <a href={item.link} className="text-lg font-medium text-gray-800 hover:text-primary transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-lg font-medium text-gray-800">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col justify-center">
              <h3 className="text-xl font-semibold text-primary mb-6">{t('connect_with_us')}</h3>
              <p className="text-gray-600 mb-8">
                Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật những tin tức mới nhất về năng lượng tái tạo.
              </p>
              <div className="flex gap-4">
                {settings['social_facebook'] && (
                  <a href={settings['social_facebook']} target="_blank" rel="noreferrer" 
                     className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:-translate-y-1">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {settings['social_youtube'] && (
                  <a href={settings['social_youtube']} target="_blank" rel="noreferrer"
                     className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-lg hover:-translate-y-1">
                    <Youtube className="w-6 h-6" />
                  </a>
                )}
                {settings['social_zalo'] && (
                   <a href={settings['social_zalo']} target="_blank" rel="noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 p-2 hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1">
                     <img src="/assets/svg/zalo.svg" alt="Zalo" className="w-full h-full brightness-0 invert" />
                   </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

