import React from 'react';
import { useSettings } from "@/hooks/useSettings";

export const GoogleMapBlock: React.FC = () => {
  const { settings } = useSettings();

  const extractSrcFromHtml = (input: string) => {
    if (!input) return "";
    if (input.includes('<iframe')) {
      const match = input.match(/src=["']([^"']+)["']/);
      return match ? match[1] : input;
    }
    return input;
  };

  const mapEmbedUrl = extractSrcFromHtml(settings['map_embed_url']) || 
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5177580567146!2d106.69916857465953!3d10.771594089387617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0x4db964d76bf6e18e!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBCw6FjaCBLaG9hIC0gxJDhuqFpIEjhu41jIFF14buRYyBHaWEgVFAuSENN!5e0!3m2!1svi!2s!4v1712459678422!5m2!1svi!2s";

  return (
    <section className="w-full bg-white">
      <div className="w-full h-[450px]">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
        ></iframe>
      </div>
    </section>
  );
};

