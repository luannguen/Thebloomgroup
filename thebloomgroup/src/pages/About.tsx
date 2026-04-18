import { useTranslation } from 'react-i18next';
import { VisualEditorProvider } from '../context/VisualEditorContext';
import { VisualPageRenderer } from '../components/admin/builder/VisualPageRenderer';

const AboutContent = () => {
  return (
    <main className="flex-grow">
      <VisualPageRenderer />
    </main>
  );
};

const About = () => {
  // About Us page always maps to 'about-us' slug in database
  // This ensures the Visual Editor correctly syncs with the static_pages record
  const effectiveSlug = 'about-us';

  return (
    <VisualEditorProvider slug={effectiveSlug}>
      <AboutContent />
    </VisualEditorProvider>
  );
};

export default About;