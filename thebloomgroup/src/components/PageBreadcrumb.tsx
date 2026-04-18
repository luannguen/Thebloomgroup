import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/** Map of route segments to Vietnamese labels */
const ROUTE_LABELS: Record<string, string> = {
  '': 'Trang chủ',
  'about': 'Giới thiệu',
  'about-us': 'Giới thiệu',
  'intro': 'Giới thiệu chung',
  'products': 'Sản phẩm',
  'industrial': 'Công nghiệp',
  'commercial': 'Thương mại',
  'residential': 'Dân dụng',
  'cold-storage': 'Kho lạnh',
  'auxiliary': 'Phụ trợ',
  'projects': 'Dự án',
  'specialized': 'Chuyên biệt',
  'services': 'Dịch vụ',
  'installation': 'Lắp đặt',
  'maintenance': 'Bảo trì',
  'repair': 'Sửa chữa',
  'consulting': 'Tư vấn',
  'service-support': 'Hỗ trợ dịch vụ',
  'technologies': 'Công nghệ',
  'energy-efficiency': 'Hiệu quả năng lượng',
  'news': 'Tin tức',
  'events': 'Sự kiện',
  'contact': 'Liên hệ',
  'team': 'Đội ngũ',
  'publications': 'Ấn phẩm',
  'search': 'Tìm kiếm',
  'legal': 'Pháp lý',
  'privacy': 'Chính sách bảo mật',
  'terms': 'Điều khoản sử dụng',
  'cookies': 'Chính sách Cookie',
  'sitemap': 'Sơ đồ trang',
  'data': 'Dữ liệu',
  'statistics': 'Thống kê',
  'tools': 'Công cụ',
  'category': 'Danh mục',
  'inverter-technology': 'Công nghệ Inverter',
  'heat-recovery-solutions': 'Giải pháp thu hồi nhiệt',
  'green-building-standards': 'Tiêu chuẩn công trình xanh',
  'energy-efficiency-report': 'Báo cáo hiệu quả năng lượng',
  'page': 'Trang',
};

const PageBreadcrumb = () => {
  const location = useLocation();

  // Breadcrumb is disabled globally as per user request
  return null;

  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = ROUTE_LABELS[segment] || decodeURIComponent(segment).replace(/-/g, ' ');
    const isLast = index === pathSegments.length - 1;

    return { path, label, isLast };
  });

  return (
    <div className="bg-gray-50 border-b border-gray-100">
      <div className="container-custom">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center py-3 text-sm text-muted-foreground overflow-x-auto"
        >
          {/* Home */}
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-primary transition-colors shrink-0"
          >
            <Home size={14} />
            <span>Trang chủ</span>
          </Link>

          {/* Segments */}
          {breadcrumbItems.map((item) => (
            <span key={item.path} className="flex items-center shrink-0">
              <ChevronRight size={14} className="mx-2 text-gray-300" />
              {item.isLast ? (
                <span className="text-primary font-medium capitalize">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className="hover:text-primary transition-colors capitalize"
                >
                  {item.label}
                </Link>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default PageBreadcrumb;
