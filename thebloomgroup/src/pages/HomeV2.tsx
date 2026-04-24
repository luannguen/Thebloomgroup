import React from 'react';
import { VisualEditorProvider, useVisualEditor } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';

const DEFAULT_HOME_V2_SECTIONS = [
  { id: 'banner', type: 'home_banner_slider', props: {} },
  { id: 'partnership', type: 'home_v2_partnership', props: {} },
  { id: 'sectors', type: 'home_v2_sectors', props: {} },
  { id: 'solutions', type: 'home_v2_solutions', props: {} },
  { id: 'stats', type: 'home_v2_stats', props: {} },
  { id: 'featured_projects', type: 'featured_projects', props: {} },
  { id: 'news', type: 'news_events', props: {} },
  { id: 'contact', type: 'contact_form', props: {} }
];

const HomeV2Content = () => {
  const { contentData, isLoading } = useVisualEditor();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-muted-foreground animate-pulse">Đang tải nội dung...</p>
      </div>
    );
  }

  if (contentData?.sections && contentData.sections.length > 0) {
    return <VisualPageRenderer />;
  }

  return <VisualPageRenderer customSections={DEFAULT_HOME_V2_SECTIONS} />;
};

const HomeV2 = () => {
  return (
    <VisualEditorProvider slug="home_v2">
      <HomeV2Content />
    </VisualEditorProvider>
  );
};

export default HomeV2;
