import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { AboutV2HeroBlock } from "@/components/sections/AboutV2Blocks";
import { useTranslation } from "react-i18next";

const AboutUsV2Content = () => {
    const { contentData } = useVisualEditor();
    const { t } = useTranslation();

    const sections = contentData?.sections || [];
    const heroSection = sections.find((s: any) => s.type === 'about_v2_hero');
    const otherSections = sections.filter((s: any) => s.type !== 'about_v2_hero');

    return (
        <main className="flex-grow">
            {/* Dynamic Banner V2 */}
            {heroSection ? (
                <AboutV2HeroBlock 
                    sectionId={heroSection.id} 
                    {...heroSection.props} 
                />
            ) : (
                /* Fallback Banner V2 */
                <AboutV2HeroBlock 
                  title={t('about_us')}
                  backgroundImage="/assets/about-v2/about-banner.jpg"
                />
            )}

            {/* Other v2 sections */}
            <VisualPageRenderer customSections={otherSections} />
        </main>
    );
};

const AboutUsV2 = () => {
  return (
    <VisualEditorProvider slug="about-us-v2">
      <AboutUsV2Content />
    </VisualEditorProvider>
  );
};

export default AboutUsV2;
