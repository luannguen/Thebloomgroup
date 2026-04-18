import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { navigationService } from '@/services/navigationService';
import { NavigationItem } from '@/components/data/types';
import { normalizePath } from '@/utils/urlUtils';

interface MainNavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

const MainNavigation = ({ isMobile = false, onItemClick }: MainNavigationProps) => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const fetchNav = async () => {
      setIsLoading(true);
      const result = await navigationService.getNavigationItems();
      if (result.success && result.data.length > 0) {
        // 1. Filter for header items (including Home '/')
        const allHeaderItems = result.data.filter(item => 
          (item.position === 'header' || !item.position)
        );

        // 2. Build the tree
        const itemMap: Record<string, NavigationItem> = {};
        const roots: NavigationItem[] = [];

        // First pass: Create a map of items with current data
        allHeaderItems.forEach(item => {
          itemMap[item.id] = { ...item, children: [] };
        });

        // Second pass: Assign children to parents or to root
        allHeaderItems.forEach(item => {
          const mappedItem = itemMap[item.id];
          if (item.parent_id && itemMap[item.parent_id]) {
            itemMap[item.parent_id].children?.push(mappedItem);
          } else if (!item.parent_id) {
            roots.push(mappedItem);
          }
        });

        // 3. Sort roots and all children recursively
        const sortItems = (items: NavigationItem[]) => {
          items.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
          items.forEach(item => {
            if (item.children && item.children.length > 0) {
              sortItems(item.children);
            }
          });
        };

        sortItems(roots);
        setNavItems(roots);
      }
      setIsLoading(false);
    };

    fetchNav();
  }, []);

  const getTranslatedLabel = (item: NavigationItem) => {
    const currentLang = i18n.language || 'vi';
    
    // 1. If language is Vietnamese, priority 100% to the label from database (Admin)
    // This ensures "HỆ THỐNG LẠNH" in Admin is "HỆ THỐNG LẠNH" on Frontend
    if (currentLang.startsWith('vi') && item.label) {
      return item.label;
    }

    // 2. Try translating the label directly for other languages (EN, etc.)
    if (item.label) {
      // Try direct label (case-sensitive)
      const translated = t(item.label);
      if (translated && translated !== item.label) {
        return translated;
      }
      
      // Try lowercase label (case-insensitive)
      const lowerTranslated = t(item.label.toLowerCase());
      if (lowerTranslated && lowerTranslated !== item.label.toLowerCase()) {
        return lowerTranslated;
      }
    }

    // 3. Map paths to keys (fallback for unknown labels or custom paths)
    const pathToKeyMap: Record<string, string> = {
      '/': 'home',
      '/about': 'about',
      '/about-us': 'about',
      '/products': 'products',
      '/news': 'news',
      '/contact': 'contact',
      '/services': 'services',
      '/projects': 'projects',
      '/team': 'team',
      '/recruitment': 'recruitment',
      '/publications': 'publications',
      '/technologies': 'technologies',
      '#': 'explore',
      '/he-thong-tich-hop': 'integrated_systems',
      '/ho-so-nang-luc': 'capability_experience',
    };

    // 4. Map common semantic labels to keys (backup fallback)
    const labelToKeyMap: Record<string, string> = {
      'trang chủ': 'home',
      'về chúng tôi': 'about',
      'giới thiệu': 'about',
      'sản phẩm': 'products',
      'tin tức': 'news',
      'liên hệ': 'contact',
      'dịch vụ': 'services',
      'dự án': 'projects',
      'nguồn lực': 'team',
      'đội ngũ': 'team',
      'tuyển dụng': 'recruitment',
      'tài liệu': 'publications',
      'ấn phẩm': 'publications',
      'công nghệ': 'technologies',
      'khám phá': 'explore',
      'liên kết nhanh': 'quick_links',
      'hệ thống lạnh': 'industry_refrigeration_title',
      'hệ thống lạnh công nghiệp': 'industry_refrigeration_title',
      'tổng thầu cơ điện': 'industry_me_title',
      'cơ điện': 'industry_me_title',
      'trung tâm dữ liệu': 'industry_dc_title',
      'trung tâm dữ liệu & quản lý tập trung': 'industry_dc_title',
      'hệ thống tích hợp': 'integrated_systems',
      'vòng đời dịch vụ': 'industry_lifecycle_title',
      'hồ sơ năng lực': 'capability_experience',
    };

    // Try path next
    if (item.path && pathToKeyMap[item.path]) {
      const key = pathToKeyMap[item.path];
      const translated = t(key);
      if (translated && translated !== key) return translated;
    }

    // Try normalized label map last
    const normalizedLabel = item.label?.toLowerCase().trim() || '';
    if (normalizedLabel && labelToKeyMap[normalizedLabel]) {
      const key = labelToKeyMap[normalizedLabel];
      const translated = t(key);
      if (translated && translated !== key) return translated;
    }

    return item.label;
  };

  /** Check if a nav item matches the current route */
  const isActive = (item: NavigationItem): boolean => {
    const currentPath = location.pathname;
    
    // Exact match for home
    if (item.path === '/') {
      return currentPath === '/';
    }
    
    // Prefix match for other routes (e.g. /products matches /products/industrial)
    if (item.path) {
      return currentPath === item.path || currentPath.startsWith(item.path + '/');
    }

    // Check children
    if (item.children && item.children.length > 0) {
      return item.children.some(child => 
        currentPath === child.path || currentPath.startsWith(child.path + '/')
      );
    }
    
    return false;
  };

  if (isLoading) {
    return null;
  }

  if (isMobile) {
    return (
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => (
          <div key={item.id}>
            <Link
              to={normalizePath(item.path)}
              onClick={onItemClick}
              className={`navbar-link text-lg block py-1 transition-colors ${
                isActive(item) 
                  ? 'text-secondary font-bold border-b-2 border-secondary' 
                  : 'text-gray-900 font-medium'
              }`}
            >
              {getTranslatedLabel(item)}
            </Link>
            {item.children && item.children.length > 0 && (
              <div className="pl-4 space-y-2 mt-2 border-l-2 border-primary/20">
                {item.children.map(child => (
                  <Link
                    key={child.id}
                    to={normalizePath(child.path)}
                    onClick={onItemClick}
                    className={`hover:text-primary block text-base py-0.5 transition-colors ${
                      isActive(child) 
                        ? 'text-primary font-semibold' 
                        : 'text-gray-600'
                    }`}
                  >
                    {getTranslatedLabel(child)}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden lg:flex items-center justify-end flex-1 gap-x-4 xl:gap-x-8 px-4">
      {navItems.map((item) => (
        <div key={item.id} className="relative group">
          {item.children && item.children.length > 0 ? (
            <>
              <button
                className={`navbar-link text-base font-medium flex items-center relative pb-1 ${
                  isActive(item) ? 'text-secondary' : ''
                }`}
              >
                <span>{getTranslatedLabel(item)}</span>
                <ChevronDown size={16} className="ml-1" />
                {isActive(item) && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary rounded-full" />
                )}
              </button>
              <div className="absolute hidden group-hover:block bg-white/95 backdrop-blur-sm shadow-lg p-4 rounded min-w-48 right-0 top-full z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex flex-col space-y-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.id}
                      to={normalizePath(child.path)}
                      className={`hover:text-primary transition-colors text-sm font-medium py-1 ${
                        isActive(child) ? 'text-primary font-bold' : 'text-gray-600'
                      }`}
                    >
                      {getTranslatedLabel(child)}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Link
              to={normalizePath(item.path)}
              className={`navbar-link text-base font-medium relative pb-1 ${
                isActive(item) ? 'text-secondary' : ''
              }`}
            >
              {getTranslatedLabel(item)}
              {isActive(item) && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary rounded-full" />
              )}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default MainNavigation;