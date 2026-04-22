import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { AboutV2HeroBlock } from "@/components/sections/AboutV2Blocks";
import { useTranslation } from "react-i18next";

const AboutUsV2Content = () => {
    const { contentData } = useVisualEditor();
    const sections = contentData?.sections || [];

    return (
        <main className="flex-grow">
            <VisualPageRenderer customSections={sections} />
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
