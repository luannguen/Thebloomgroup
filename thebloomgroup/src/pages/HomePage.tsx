import React, { useEffect } from 'react';
import { VisualEditorProvider, useVisualEditor } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';
import { useSettings } from '../hooks/useSettings';
import { useNavigation } from '../hooks/useNavigation';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_HOME_SECTIONS = [
  { id: 'banner', type: 'home_banner_slider', props: {} },
  { id: 'refrigeration', type: 'refrigeration', props: {} },
  { id: 'me_systems', type: 'me_systems', props: {} },
  { id: 'data_center', type: 'data_center', props: {} },
  { id: 'products', type: 'product_categories', props: {} },
  { id: 'projects', type: 'featured_projects', props: {} },
  { id: 'service_lifecycle', type: 'service_lifecycle', props: {} },
  { id: 'news_events', type: 'news_events', props: {} },
  { id: 'contact', type: 'contact_form', props: {} }
];

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

const HomeContent = ({ slug }: { slug: string }) => {
  const { contentData } = useVisualEditor();
  
  // If we have builder sections in DB, use the renderer
  if (contentData?.sections && contentData.sections.length > 0) {
    return <VisualPageRenderer />;
  }

  // Fallback to defaults based on slug
  const defaults = slug === 'home_v2' ? DEFAULT_HOME_V2_SECTIONS : DEFAULT_HOME_SECTIONS;
  return <VisualPageRenderer customSections={defaults} />;
};

const HomePage = () => {
  const { getSetting, loading: settingsLoading } = useSettings();
  const { homePath, isLoading: navLoading } = useNavigation('header');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If the configured home path in Menu is NOT '/' and we are at '/', 
    // redirect to that path (e.g. /home_v2)
    if (!navLoading && homePath && homePath !== '/' && location.pathname === '/') {
      navigate(homePath, { replace: true });
    }
  }, [homePath, navLoading, location.pathname, navigate]);

  if (settingsLoading || navLoading) {
      return (
          <div className="flex justify-center items-center min-h-[60vh]">
              <div className="w-10 h-10 border-3 border-primary/10 border-t-primary rounded-full animate-spin"></div>
          </div>
      );
  }

  // Determine the slug based on Navigation Menu
  // 1. If explicitly at /home, we want 'home'
  // 2. If at /, we use the path configured in the menu's primary home item
  const isExplicitHome = location.pathname === '/home';
  
  // Extract slug from homePath (e.g. /home_v2 -> home_v2, / -> home)
  const menuHomeSlug = homePath && homePath !== '/' ? homePath.replace(/^\//, '') : 'home';
  const homeSlug = isExplicitHome ? 'home' : menuHomeSlug;

  return (
    <VisualEditorProvider slug={homeSlug}>
      <HomeContent slug={homeSlug} />
    </VisualEditorProvider>
  );
};

export default HomePage;
