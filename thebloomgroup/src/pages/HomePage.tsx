import React, { useEffect } from 'react';
import { VisualEditorProvider, useVisualEditor } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';
import { useSettings } from '../hooks/useSettings';
import { useNavigation } from '../hooks/useNavigation';
import { useLocation, useNavigate } from 'react-router-dom';

const HomeContent = () => {
  const { contentData, isLoading } = useVisualEditor();
  
  // While loading from DB, show a spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 border-primary/10 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  // If we have builder sections in DB, use the renderer
  if (contentData?.sections && contentData.sections.length > 0) {
    return <VisualPageRenderer />;
  }

  // If no sections found in DB, show a friendly message or empty state
  return (
    <div className="flex flex-col justify-center items-center min-h-[60vh] text-muted-foreground p-8 text-center">
      <h2 className="text-2xl font-semibold mb-2">Trang chưa có nội dung</h2>
      <p>Vui lòng sử dụng Visual Editor trong trang Admin để thiết kế giao diện cho trang chủ.</p>
    </div>
  );
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
      <HomeContent />
    </VisualEditorProvider>
  );
};

export default HomePage;
