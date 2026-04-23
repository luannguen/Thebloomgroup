
import React from 'react';
import { useSettings } from '@/hooks/useSettings';

const ZaloButton: React.FC = () => {
    const { settings } = useSettings();
    const showZalo = settings['show_zalo_button'] === 'true';
    const zaloLink = settings['social_zalo'] || '';

    if (!showZalo || !zaloLink) return null;

    // Handle case where social_zalo is just a phone number
    const finalLink = zaloLink.startsWith('http') 
        ? zaloLink 
        : `https://zalo.me/${zaloLink.replace(/\s/g, '')}`;

    return (
        <a
            href={finalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-[999] group animate-in fade-in slide-in-from-bottom-4 duration-500"
            aria-label="Contact us on Zalo"
        >
            <div className="relative">
                {/* Ping effect */}
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-25"></div>
                
                {/* Main button */}
                <div className="relative bg-white shadow-xl rounded-full p-0.5 border border-blue-100 transition-transform hover:scale-110 active:scale-95 group-hover:shadow-blue-200">
                    <div className="bg-blue-500 rounded-full p-3 flex items-center justify-center">
                        <img 
                            src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" 
                            alt="Zalo" 
                            className="w-7 h-7 filter brightness-0 invert"
                        />
                    </div>
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-3 whitespace-nowrap bg-slate-900 text-white text-[10px] font-bold py-1 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 pointer-events-none uppercase tracking-widest">
                    Chat Zalo
                </div>
            </div>
        </a>
    );
};

export default ZaloButton;
