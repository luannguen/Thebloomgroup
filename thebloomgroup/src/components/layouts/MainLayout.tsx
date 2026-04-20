import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import FooterV2 from '../FooterV2';
import BackToTop from '../BackToTop';
import { useSettings } from '@/hooks/useSettings';

const MainLayout = () => {
  const { settings } = useSettings();
  const footerVersion = settings['footer_version'] || 'v1';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      {footerVersion === 'v2' ? <FooterV2 /> : <Footer />}
      <BackToTop />
    </div>
  );
};

export default MainLayout;