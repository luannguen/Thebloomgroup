import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { HeroBlock } from "@/components/sections/HeroBlock";
import { useTranslation } from "react-i18next";

const AboutContent = () => {
    const { contentData } = useVisualEditor();
    const { t } = useTranslation();

    const sections = contentData?.sections || [];
    const heroSection = sections.find((s: any) => s.type === 'hero');

    // Nếu trong DB đã có Hero, ưu tiên để VisualPageRenderer xử lý toàn bộ trang
    if (heroSection) {
        return (
            <main className="flex-grow">
                <VisualPageRenderer />
            </main>
        );
    }

    const otherSections = sections.filter((s: any) => s.type !== 'hero');

    return (
        <main className="flex-grow">
            {/* Fallback Banner */}
            <div className="bg-primary py-20 text-white text-center">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('about_us', 'Về chúng tôi')}</h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        {t('about_desc', 'Hơn 20 năm kinh nghiệm trong ngành điện lạnh')}
                    </p>
                </div>
            </div>

            {/* Other sections */}
            <VisualPageRenderer customSections={otherSections} />
        </main>
    );
};

const About = () => {
  return (
    <VisualEditorProvider slug="about-us">
      <AboutContent />
    </VisualEditorProvider>
  );
};

export default About;