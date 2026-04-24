import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { AboutV2HeroBlock } from "@/components/sections/AboutV2Blocks";
import { useTranslation } from "react-i18next";

const DEFAULT_ABOUT_V2_SECTIONS = [
  { id: 'hero', type: 'about_v2_hero', props: {} },
  { id: 'intro', type: 'about_v2_intro', props: {} },
  { id: 'accordion', type: 'about_v2_accordion', props: {} },
  { id: 'timeline', type: 'about_v2_timeline', props: {} },
  { id: 'location', type: 'about_v2_location', props: {} },
  { id: 'contact', type: 'contact_form', props: {} }
];

import { VisualSectionRenderer } from "@/components/visual-editor/VisualSectionRenderer";

const AboutUsV2Content = () => {
    const { contentData, isLoading, editMode } = useVisualEditor();
    
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Đang tải nội dung...</p>
            </div>
        );
    }
    
    const sections = (contentData?.sections && contentData.sections.length > 0) 
        ? contentData.sections 
        : DEFAULT_ABOUT_V2_SECTIONS;

    if (editMode) {
        return (
            <main className="flex-grow">
                <VisualPageRenderer customSections={DEFAULT_ABOUT_V2_SECTIONS} />
            </main>
        );
    }

    return (
        <main className="flex-grow">
            <VisualSectionRenderer sections={sections} isEditMode={false} />
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
