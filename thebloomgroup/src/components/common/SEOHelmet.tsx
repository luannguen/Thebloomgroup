import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { settingsService } from '@/services/settingsService';

interface SEOHelmetProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
}

const SEOHelmet: React.FC<SEOHelmetProps> = ({ title, description, keywords, image }) => {
    const { i18n, t } = useTranslation();
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchSettings = async () => {
            const result = await settingsService.getSettings();
            if (result.success && result.data) {
                setSettings(result.data);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (!mounted || Object.keys(settings).length === 0) return;

        // Cập nhật favicon động từ Database
        if (settings['favicon_url']) {
            let link = document.getElementById('dynamic-favicon') as HTMLLinkElement;
            if (!link) {
                link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
            }
            if (link) {
                link.href = settings['favicon_url'];
            }
        }

        // Inject header and footer scripts safely (only runtime if not already injected)
        if (settings['header_scripts'] && !document.getElementById('injected-header-scripts')) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = settings['header_scripts'];
                const scripts = tempDiv.getElementsByTagName('script');
                Array.from(scripts).forEach(s => {
                    const scriptNode = document.createElement('script');
                    scriptNode.id = 'injected-header-scripts';
                    if (s.src) scriptNode.src = s.src;
                    scriptNode.innerHTML = s.innerHTML;
                    scriptNode.async = s.async;
                    scriptNode.defer = s.defer;
                    document.head.appendChild(scriptNode);
                });
            } catch (e) {
                console.error('Error injecting header scripts:', e);
            }
        }

        if (settings['footer_scripts'] && !document.getElementById('injected-footer-scripts')) {
            try {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = settings['footer_scripts'];
                const scripts = tempDiv.getElementsByTagName('script');
                Array.from(scripts).forEach(s => {
                    const scriptNode = document.createElement('script');
                    scriptNode.id = 'injected-footer-scripts';
                    if (s.src) scriptNode.src = s.src;
                    scriptNode.innerHTML = s.innerHTML;
                    scriptNode.async = s.async;
                    scriptNode.defer = s.defer;
                    document.body.appendChild(scriptNode);
                });
            } catch (e) {
                console.error('Error injecting footer scripts:', e);
            }
        }
    }, [settings, mounted]);

    if (!mounted) return null;

    const currentLang = i18n.language || 'vi';
    const isVi = currentLang.startsWith('vi');

    const getLocalizedSetting = (baseKey: string) => {
        if (isVi) return settings[baseKey];
        return settings[`${baseKey}_${currentLang}`] || settings[baseKey];
    };

    const siteTitle = getLocalizedSetting('site_title') || getLocalizedSetting('company_name') || t('site_title_fallback');
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDescription = description || getLocalizedSetting('site_description') || t('site_description_fallback');
    const finalKeywords = keywords || getLocalizedSetting('site_keywords') || t('site_keywords_fallback');
    const finalImage = image || settings['og_image_url'] || '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png';
    const siteUrl = settings['site_url'] || 'http://vietvinhcorp.com/';

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <meta name="keywords" content={finalKeywords} />
            <link rel="canonical" href={siteUrl} />

            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:type" content={settings['og_type'] || 'website'} />
            <meta property="og:site_name" content={settings['site_name'] || 'VVC'} />

            <meta name="twitter:card" content={settings['twitter_card'] || 'summary_large_image'} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />
            <meta name="twitter:image" content={finalImage} />
            <meta name="twitter:url" content={siteUrl} />
        </Helmet>
    );
};

export default SEOHelmet;
