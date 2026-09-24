import React from 'react';
import { useSettings } from '@/hooks/useSettings';

const TopContact = () => {
  const { settings } = useSettings();

  const phone = settings['contact_phone'] || '';
  const zaloUrl = settings['social_zalo'] || '#';
  const facebookUrl = settings['social_facebook'] || '#';

  return (
    <div className="bg-slate-50 border-b border-slate-100 text-xs text-slate-600">
      <div className="container-custom">
        <div className="flex justify-end items-center py-1.5 text-xs">
          {/* Phone number */}
          {phone && (
            <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="flex items-center text-slate-600 mr-6 hover:text-primary transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{phone}</span>
            </a>
          )}

          {/* Zalo */}
          {settings['social_zalo'] && (
            <a
              href={zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center mx-2 hover:opacity-80 transition-opacity"
              aria-label="Zalo"
            >
              <img
                src="assets/svg/zalo.svg"
                alt="Zalo"
                className="w-4 h-4 opacity-80 hover:opacity-100"
              />
            </a>
          )}

          {/* Facebook */}
          {settings['social_facebook'] && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-slate-500 ml-2 hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z"></path>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopContact;