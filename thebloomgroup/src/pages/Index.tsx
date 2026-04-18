import { VisualEditorProvider, useVisualEditor } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';
import { 
  RefrigerationBlock, 
  MEBlock, 
  DataCenterBlock, 
  ServiceLifecycleBlock 
} from '../components/sections';

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

const IndexContent = () => {
  const { contentData } = useVisualEditor();
  
  // If we have builder sections, use the renderer
  if (contentData?.sections && contentData.sections.length > 0) {
    return <VisualPageRenderer />;
  }

  // If no sections in DB, we can still use VisualPageRenderer with defaults 
  // to allow the editor to work immediately with a pre-defined layout
  return <VisualPageRenderer customSections={DEFAULT_HOME_SECTIONS} />;
};

const Index = () => {
  return (
    <VisualEditorProvider slug="home">
      <IndexContent />
    </VisualEditorProvider>
  );
};

export default Index;
