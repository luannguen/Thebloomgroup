import React from 'react';
import { useTranslation } from 'react-i18next';
import { EditableElement } from '../admin/EditableElement';

interface ServiceHeroBlockProps {
  title?: string;
  description?: string;
  primaryButtonLabel?: string;
  primaryButtonLink?: string;
  secondaryButtonLabel?: string;
  secondaryButtonLink?: string;
  sectionId?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export const ServiceHeroBlock = ({
  title,
  description,
  primaryButtonLabel,
  primaryButtonLink = '/contact',
  secondaryButtonLabel,
  secondaryButtonLink = '/service-support',
  sectionId,
  titleColor = '#ffffff',
  descriptionColor = 'rgba(255, 255, 255, 0.9)'
}: ServiceHeroBlockProps) => {
  const { t } = useTranslation();

  const displayTitle = title || t('service_professional_title');
  const displayDescription = description || t('service_professional_desc');
  const displayPrimaryLabel = primaryButtonLabel || t('service_consulting');
  const displaySecondaryLabel = secondaryButtonLabel || t('technical_support');

  return (
    <section className="bg-primary/90 py-16 text-white overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full -mr-48 -mt-48 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
      </div>
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          <EditableElement
            tagName="h1"
            fieldKey="title"
            sectionId={sectionId}
            defaultContent={displayTitle}
            className="text-white mb-6 animate-in slide-in-from-left duration-700"
            style={{ color: titleColor }}
          />
          <EditableElement
            tagName="p"
            fieldKey="description"
            sectionId={sectionId}
            defaultContent={displayDescription}
            className="text-xl md:text-2xl mb-8 opacity-90 animate-in slide-in-from-left duration-700 delay-100"
            style={{ color: descriptionColor }}
          />
          <div className="flex flex-wrap gap-4 animate-in slide-in-from-left duration-700 delay-200">
            <EditableElement
              tagName="a"
              href={primaryButtonLink}
              fieldKey="primaryButtonLabel"
              sectionId={sectionId}
              defaultContent={displayPrimaryLabel}
              className="px-6 py-3 rounded-lg bg-accent text-white font-bold hover:bg-accent/90 transition-all shadow-lg cursor-pointer"
            />
            <EditableElement
              tagName="a"
              href={secondaryButtonLink}
              fieldKey="secondaryButtonLabel"
              sectionId={sectionId}
              defaultContent={displaySecondaryLabel}
              className="px-6 py-3 rounded-lg bg-white text-primary font-bold hover:bg-gray-100 transition-all cursor-pointer"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
