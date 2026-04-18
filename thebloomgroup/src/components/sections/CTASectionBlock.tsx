import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';

interface CTASectionBlockProps {
  title?: string;
  description?: string;
  badge?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
  sectionId?: string;
}

export const CTASectionBlock = ({
  title,
  description,
  badge,
  primaryButtonLabel,
  primaryButtonLink = '/contact',
  secondaryButtonLabel,
  secondaryButtonLink = '/find-out-more',
  sectionId
}: CTASectionBlockProps) => {
  const { t } = useTranslation();

  const displayTitle = title || t('cta_services_title', 'Bắt đầu với dịch vụ của chúng tôi');
  const displayDescription = description || t('cta_services_desc', 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá các dịch vụ điện lạnh phù hợp với nhu cầu của bạn.');
  const displayBadge = badge || t('free_consultation', 'Tư vấn miễn phí');
  const displayPrimaryLabel = primaryButtonLabel || t('contact_now', 'Liên hệ ngay');
  const displaySecondaryLabel = secondaryButtonLabel || t('find_out_more', 'Tìm hiểu thêm');

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <EditableElement
            tagName="div"
            fieldKey="badge"
            sectionId={sectionId}
            defaultContent={displayBadge}
            className="mb-6"
          >
            <Badge className="bg-accent text-white border-none px-4 py-1">{displayBadge}</Badge>
          </EditableElement>
          
          <EditableElement
            tagName="h2"
            fieldKey="title"
            sectionId={sectionId}
            defaultContent={displayTitle}
            className="mb-6 text-white text-3xl md:text-5xl font-bold"
          />
          
          <EditableElement
            tagName="p"
            fieldKey="description"
            sectionId={sectionId}
            defaultContent={displayDescription}
            className="text-white/80 mb-10 text-lg md:text-xl"
          />
          
          <div className="flex flex-wrap gap-4 justify-center">
            <EditableElement
              tagName="a"
              href={primaryButtonLink}
              fieldKey="primaryButtonLabel"
              sectionId={sectionId}
              defaultContent={displayPrimaryLabel}
              className="px-8 py-4 bg-accent hover:bg-accent/90 text-white rounded-lg font-bold transition-all shadow-lg hover:shadow-accent/40 cursor-pointer"
            />
            
            <EditableElement
              tagName="a"
              href={secondaryButtonLink}
              fieldKey="secondaryButtonLabel"
              sectionId={sectionId}
              defaultContent={displaySecondaryLabel}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg font-bold transition-all backdrop-blur-sm cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
