import { registerBlock } from '../admin/builder/SectionRegistry';
import { HeroBlock } from './HeroBlock';
import { RichTextBlock } from './RichTextBlock';
import { GridBlock } from './GridBlock';
import { CardBlock } from './CardBlock';
import { FeatureListBlock } from './FeatureListBlock';
import { ImageBlock } from './ImageBlock';
import { MediaSectionBlock } from './MediaSectionBlock';
import { 
  AboutHeroBlock, 
  HistoryBlock, 
  VisionMissionBlock, 
  CoreValuesBlock, 
  AchievementsBlock,
  ProductionFacilitiesBlock,
  QualityPrinciplesBlock,
  PartnersBlock
} from './AboutBlocks';
import { 
  AboutV2HeroBlock,
  AboutV2IntroBlock,
  AboutV2AccordionBlock,
  AboutV2TimelineBlock,
  AboutV2LocationBlock
} from './AboutV2Blocks';
import { TeamHeroBlock, TeamGridBlock } from './TeamBlocks';
import { 
  RefrigerationBlock, 
  MEBlock, 
  DataCenterBlock, 
  ServiceLifecycleBlock, 
  ColdStorageCatalogBlock,
  IndustrialExpertiseBlock,
  AdvancedTechShowcaseBlock,
  TechnicalDetailBlock,
  ContactFormBlock 
} from './IndustryBlocks';
import { NewsEventsBlock, ProjectsBlock, ProductsBlock } from './HomeSections';
import { HomeBannerSlider } from './HomeBannerSlider';
import { CapabilityProfileBlock } from './CapabilityProfileBlock';
import { ServiceHeroBlock } from './ServiceHeroBlock';
import { ServiceGridBlock } from './ServiceGridBlock';
import { CTASectionBlock } from './CTASectionBlock';
import { JobsListBlock } from './JobsListBlock';


// Function to register all blocks
export const registerAllBlocks = () => {
  registerBlock({
    type: 'hero',
    name: 'Hero Banner',
    component: HeroBlock,
    defaultProps: {
      title: 'New Page Hero',
      description: 'Engage your visitors with a powerful hero section.',
      alignment: 'center'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'backgroundImage', label: 'Ảnh nền', type: 'image' },
      { id: 'buttonText', label: 'Chữ trên nút 1', type: 'text' },
      { id: 'buttonLink', label: 'Liên kết nút 1', type: 'text' },
      { id: 'button2Text', label: 'Chữ trên nút 2', type: 'text' },
      { id: 'button2Link', label: 'Liên kết nút 2', type: 'text' },
      { id: 'badge', label: 'Badge/Tagline', type: 'text' },
      { id: 'alignment', label: 'Căn lề', type: 'select', options: [
        { label: 'Trái', value: 'left' },
        { label: 'Giữa', value: 'center' },
        { label: 'Phải', value: 'right' }
      ]}
    ]
  });

  registerBlock({
    type: 'rich_text',
    name: 'Rich Text',
    component: RichTextBlock,
    defaultProps: {
      content: '<h2>Heading</h2><p>Start writing your content here...</p>'
    },
    fields: [
      { id: 'content', label: 'Nội dung', type: 'rich-text' }
    ]
  });

  registerBlock({
    type: 'grid',
    name: 'Layout Grid',
    component: GridBlock,
    defaultProps: {
      columns: 2,
      gap: 8,
      padding: 'medium'
    },
    fields: [
      { id: 'columns', label: 'Số cột', type: 'number' },
      { id: 'gap', label: 'Khoảng cách', type: 'number' },
      { id: 'padding', label: 'Lề (Padding)', type: 'select', options: [
        { label: 'Nhỏ', value: 'small' },
        { label: 'Vừa', value: 'medium' },
        { label: 'Lớn', value: 'large' }
      ]}
    ]
  });

  registerBlock({
    type: 'cards',
    name: 'Card Collection',
    component: CardBlock,
    defaultProps: {
      title: 'Our Features',
      columns: 3,
      items: [
        { id: '1', title: 'Feature One', description: 'Description of feature one.' },
        { id: '2', title: 'Feature Two', description: 'Description of feature two.' },
        { id: '3', title: 'Feature Three', description: 'Description of feature three.' }
      ]
    },
    fields: [
      { id: 'title', label: 'Tiêu đề lưới card', type: 'text' },
      { id: 'columns', label: 'Số cột hiển thị', type: 'number' },
      { id: 'style', label: 'Kiểu dáng', type: 'select', options: [
        { label: 'Đổ bóng', value: 'elevated' },
        { label: 'Viền', value: 'bordered' },
        { label: 'Phẳng', value: 'flat' }
      ]}
    ]
  });

  registerBlock({
    type: 'features',
    name: 'Feature List',
    component: FeatureListBlock,
    defaultProps: {
      title: 'Why Choose Us',
      subtitle: 'We provide top-notch services for all your cooling needs.',
      items: [
        { id: '1', title: 'Experience', description: '20+ years in the industry.' },
        { id: '2', title: 'Technology', description: 'Advanced cooling solutions.' },
        { id: '3', title: 'Support', description: '24/7 dedicated support team.' }
      ]
    },
    fields: [
      { id: 'title', label: 'Tiêu đề chính', type: 'text' },
      { id: 'subtitle', label: 'Tiêu đề phụ', type: 'textarea' },
      { id: 'columns', label: 'Số cột', type: 'number' }
    ]
  });

  registerBlock({
    type: 'image',
    name: 'Image Content',
    component: ImageBlock,
    defaultProps: {
      url: 'https://via.placeholder.com/800x450',
      alt: 'Project Image',
      caption: '',
      width: 100
    },
    fields: [
      { id: 'url', label: 'Hình ảnh', type: 'image' },
      { id: 'alt', label: 'Mô tả (Alt)', type: 'text' },
      { id: 'caption', label: 'Chú thích', type: 'text' },
      { id: 'width', label: 'Độ rộng (%)', type: 'number' }
    ]
  });
  
  registerBlock({
    type: 'media_section',
    name: 'Media & Content',
    component: MediaSectionBlock,
    defaultProps: {
      title: 'Media Section Title',
      description: '<p>Edit your content here...</p>',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
      layout: 'image-right',
      imageWidth: 50,
      bgColor: 'white'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Nội dung', type: 'rich-text' },
      { id: 'image', label: 'Hình ảnh', type: 'image' },
      { id: 'layout', label: 'Bố cục', type: 'select', options: [
        { label: 'Ảnh bên trái', value: 'image-left' },
        { label: 'Ảnh bên phải', value: 'image-right' },
        { label: 'Ảnh ở trên', value: 'image-top' },
        { label: 'Ảnh ở dưới', value: 'image-bottom' }
      ]},
      { id: 'imageWidth', label: 'Độ rộng ảnh (%)', type: 'number' },
      { id: 'bgColor', label: 'Màu nền', type: 'select', options: [
        { label: 'Trắng', value: 'white' },
        { label: 'Muted', value: 'muted' },
        { label: 'Xanh nhạt', value: 'primary-light' }
      ]}
    ]
  });

  // --- About Page Blocks ---
  registerBlock({
    type: 'about_hero',
    name: 'About: Hero',
    component: AboutHeroBlock,
    defaultProps: { title: 'Giới thiệu', description: 'Tổng công ty Kỹ thuật lạnh Việt Nam (VVC)...' },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'about_history',
    name: 'About: Lịch sử',
    component: HistoryBlock,
    defaultProps: {
      title: 'Lịch sử phát triển',
      p1: 'Được thành lập vào năm 2003...',
      p2: 'Từ một đơn vị chuyên về lắp đặt...',
      image: '/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png',
      expYears: '20+',
      expText: 'Năm kinh nghiệm'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'p1', label: 'Đoạn văn 1', type: 'textarea' },
      { id: 'p2', label: 'Đoạn văn 2', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh', type: 'image' },
      { id: 'expYears', label: 'Số năm KN', type: 'text' },
      { id: 'expText', label: 'Text kinh nghiệm', type: 'text' }
    ]
  });

  registerBlock({
    type: 'about_vision',
    name: 'About: Tầm nhìn & Sứ mệnh',
    component: VisionMissionBlock,
    defaultProps: {
      visionTitle: 'Tầm nhìn',
      missionTitle: 'Sứ mệnh'
    },
    fields: [
      { id: 'visionTitle', label: 'Tiêu đề Tầm nhìn', type: 'text' },
      { id: 'missionTitle', label: 'Tiêu đề Sứ mệnh', type: 'text' }
    ]
  });

  registerBlock({
    type: 'about_values',
    name: 'About: Giá trị cốt lõi',
    component: CoreValuesBlock,
    defaultProps: { title: 'Giá trị cốt lõi' },
    fields: [{ id: 'title', label: 'Tiêu đề', type: 'text' }]
  });

  registerBlock({
    type: 'about_partners',
    name: 'About: Đối tác & Khách hàng',
    component: PartnersBlock,
    defaultProps: { title: 'Đối tác & Khách hàng' },
    fields: [{ id: 'title', label: 'Tiêu đề', type: 'text' }]
  });

  registerBlock({
    type: 'about_achievements',
    name: 'About: Thành tựu',
    component: AchievementsBlock,
    defaultProps: { title: 'Thành tựu nổi bật' },
    fields: [{ id: 'title', label: 'Tiêu đề', type: 'text' }]
  });

  registerBlock({
    type: 'about_facilities',
    name: 'About: Năng lực sản xuất',
    component: ProductionFacilitiesBlock,
    defaultProps: { 
      title: 'Cơ sở hạ tầng & Trung tâm sản xuất',
      description: 'VVC đầu tư mạnh mẽ vào hệ thống nhà xưởng hiện đại...' 
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'image1', label: 'Hình ảnh 1', type: 'image' },
      { id: 'image2', label: 'Hình ảnh 2', type: 'image' }
    ]
  });

  registerBlock({
    type: 'about_quality',
    name: 'About: Nguyên tắc chất lượng',
    component: QualityPrinciplesBlock,
    defaultProps: { title: 'Nguyên tắc chất lượng của VVC' },
    fields: [{ id: 'title', label: 'Tiêu đề', type: 'text' }]
  });

  // --- Team Page Blocks ---
  registerBlock({
    type: 'team_hero',
    name: 'Team: Hero',
    component: TeamHeroBlock,
    defaultProps: { 
      title: 'Đội ngũ chuyên gia', 
      description: 'Hội tụ những tinh hoa trong ngành kỹ thuật lạnh...' 
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'team_grid',
    name: 'Team: Danh sách',
    component: TeamGridBlock,
    defaultProps: { 
      title: 'Gặp gỡ đội ngũ của chúng tôi', 
      description: 'Đội ngũ kỹ sư và chuyên viên dày dặn kinh nghiệm...' 
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' }
    ]
  });

  // --- Industry Blocks ---
  registerBlock({
    type: 'refrigeration',
    name: 'Industry: Hệ thống lạnh',
    component: RefrigerationBlock,
    defaultProps: {
      title: 'Hệ Thống Lạnh Công Nghiệp',
      description: 'VVC cung cấp các giải pháp làm lạnh chuyên sâu...',
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh', type: 'image' }
    ]
  });

  registerBlock({
    type: 'cold_storage_catalog',
    name: 'Industry: Phân loại kho lạnh',
    component: ColdStorageCatalogBlock,
    defaultProps: {},
    fields: []
  });

  registerBlock({
    type: 'industrial_expertise',
    name: 'Industry: Chuyên gia công nghiệp',
    component: IndustrialExpertiseBlock,
    defaultProps: {},
    fields: []
  });

  registerBlock({
    type: 'me_systems',
    name: 'Industry: Cơ điện (M&E)',
    component: MEBlock,
    defaultProps: {
      title: 'Tổng Thầu Cơ Điện (M&E)',
      description: 'Giải pháp cơ điện toàn diện cho các công trình...',
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh', type: 'image' }
    ]
  });

  registerBlock({
    type: 'data_center',
    name: 'Industry: Trung tâm dữ liệu',
    component: DataCenterBlock,
    defaultProps: {
      title: 'Trung Tâm Dữ Liệu & Quản Lý Tập Trung',
      description: 'Tư vấn và triển khai hạ tầng trung tâm dữ liệu...',
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh', type: 'image' }
    ]
  });

  registerBlock({
    type: 'service_lifecycle',
    name: 'Industry: Vòng đời dịch vụ',
    component: ServiceLifecycleBlock,
    defaultProps: {
      title: 'Vòng Đời Dịch Vụ Toàn Diện',
      description: 'Chúng tôi đồng hành cùng khách hàng từ khâu lên ý tưởng...',
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'advanced_tech_showcase',
    component: AdvancedTechShowcaseBlock,
    name: 'Advanced tech showcase',
    defaultProps: {
      title: 'Công Nghệ Bảo Quản & Cấp Đông Chuyên Sâu',
      subtitle: 'VIETVINH tiên phong ứng dụng các giải pháp bảo quản tiên tiến nhất thế giới.',
      badge: 'Specialized Solutions'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' },
      { id: 'badge', label: 'Badge/Nhãn', type: 'text' }
    ]
  });

  registerBlock({
    type: 'technical_detail',
    component: TechnicalDetailBlock,
    name: 'Technical detail page',
    defaultProps: {
      techType: 'ca',
      accent: 'blue'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề trang', type: 'text' },
      { id: 'description', label: 'Mô tả chi tiết', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh chính', type: 'image' },
      { id: 'accent', label: 'Màu nhấn', type: 'select', options: [
        { label: 'Xanh dương', value: 'blue' },
        { label: 'Xanh lục', value: 'green' },
        { label: 'Xanh ngọc', value: 'cyan' },
        { label: 'Vàng hổ phách', value: 'amber' },
        { label: 'Tím Indigo', value: 'indigo' }
      ]},
      { id: 'techType', label: 'Loại công nghệ (Fallback)', type: 'select', options: [
        { label: 'CA (Khí quyển)', value: 'ca' },
        { label: 'IQF (Cấp đông nhanh)', value: 'iqf' },
        { label: 'Chín chuối', value: 'ripening' },
        { label: 'Hầm đông gió', value: 'blast' }
      ]}
    ]
  });

  registerBlock({
    type: 'contact_form',
    name: 'General: Contact Form',
    component: ContactFormBlock,
    defaultProps: {},
    fields: []
  });

  registerBlock({
    type: 'news_events',
    name: 'Home: Tin tức & Sự kiện',
    component: NewsEventsBlock,
    defaultProps: {
      title: 'Tin tức & Sự kiện',
      subtitle: 'Cập nhật những hoạt động mới nhất từ VietVinhCorp.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'subtitle', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'featured_projects',
    name: 'Home: Dự án tiêu biểu',
    component: ProjectsBlock,
    defaultProps: {
      title: 'Dự Án Tiêu Biểu',
      subtitle: 'Những công trình thực tế khẳng định năng lực VietVinhCorp.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'subtitle', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'product_categories',
    name: 'Home: Sản phẩm phân phối',
    component: ProductsBlock,
    defaultProps: {
      title: 'Sản Phẩm Phân Phối',
      subtitle: 'Đảm bảo hệ thống vật tư tiêu chuẩn quốc tế.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'subtitle', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'home_banner_slider',
    name: 'Home: Banner Slider',
    component: HomeBannerSlider,
    defaultProps: {},
    fields: [
      { id: 'info', label: 'Thông tin', type: 'text' }
    ]
  });

  registerBlock({
    type: 'capability_profile',
    name: 'Hồ sơ năng lực',
    component: CapabilityProfileBlock,
    defaultProps: {
      title: 'Hồ sơ năng lực Viet Vinh Corp',
      description: 'Tài liệu chi tiết về năng lực thiết kế, thi công và vận hành các hệ thống điện lạnh công nghiệp tiêu chuẩn quốc tế của VVC.',
      previewImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80',
      pdfUrl: '#',
      downloadText: 'Tải xuống Hồ sơ năng lực (PDF)',
      pdfFileName: '',
      pdfFileSize: ''
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'previewImage', label: 'Ảnh xem trước', type: 'image' },
      { id: 'pdfUrl', label: 'Link file PDF', type: 'text' },
      { id: 'downloadText', label: 'Chữ trên nút tải', type: 'text' },
      { id: 'pdfFileName', label: 'Tên file', type: 'text' },
      { id: 'pdfFileSize', label: 'Dung lượng', type: 'text' }
    ]
  });

  registerBlock({
    type: 'jobs_list',
    name: 'Tuyển dụng: Danh sách công việc',
    component: JobsListBlock,
    defaultProps: {
      title: 'Cơ hội nghề nghiệp tại Viet Vinh Corp',
      subtitle: 'Chúng tôi luôn tìm kiếm những tài năng đồng hành cùng sứ mệnh phát triển bền vững.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'subtitle', label: 'Mô tả phụ', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'service_hero',
    name: 'Dịch vụ: Hero',
    component: ServiceHeroBlock,
    defaultProps: {
      title: 'Dịch vụ chuyên nghiệp',
      description: 'Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'primaryButtonLabel', label: 'Nút chính', type: 'text' },
      { id: 'primaryButtonLink', label: 'Link nút chính', type: 'text' },
      { id: 'secondaryButtonLabel', label: 'Nút phụ', type: 'text' },
      { id: 'secondaryButtonLink', label: 'Link nút phụ', type: 'text' }
    ]
  });

  registerBlock({
    type: 'service_grid',
    name: 'Dịch vụ: Danh sách & Lọc',
    component: ServiceGridBlock,
    defaultProps: {
      title: 'Danh mục dịch vụ',
      description: 'Chúng tôi cung cấp đầy đủ các dịch vụ điện lạnh công nghiệp và dân dụng.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'cta_section',
    name: 'Chung: CTA Section',
    component: CTASectionBlock,
    defaultProps: {
      title: 'Bắt đầu với dịch vụ của chúng tôi',
      description: 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giáo.'
    },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'badge', label: 'Badge (Nhãn)', type: 'text' },
      { id: 'primaryButtonLabel', label: 'Nút chính', type: 'text' },
      { id: 'primaryButtonLink', label: 'Link nút chính', type: 'text' },
      { id: 'secondaryButtonLabel', label: 'Nút phụ', type: 'text' },
      { id: 'secondaryButtonLink', label: 'Link nút phụ', type: 'text' }
    ]
  });

  // --- Legacy Support Alises ---
  // These map old block types in existing database records to current components
  registerBlock({
    type: 'HeroBlock',
    name: 'Hero (Legacy)',
    component: ServiceHeroBlock,
    defaultProps: {},
    fields: []
  });

  registerBlock({
    type: 'ContentBlock',
    name: 'Content (Legacy)',
    component: MediaSectionBlock,
    defaultProps: {},
    fields: []
  });

  // --- About V2 Blocks ---
  registerBlock({
    type: 'about_v2_hero',
    name: 'About V2: Hero',
    component: AboutV2HeroBlock,
    defaultProps: { backgroundImage: '/assets/about-v2/about-banner.jpg' },
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'backgroundImage', label: 'Ảnh nền', type: 'image' }
    ]
  });

  registerBlock({
    type: 'about_v2_intro',
    name: 'About V2: Giới thiệu',
    component: AboutV2IntroBlock,
    defaultProps: {},
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' },
      { id: 'description', label: 'Mô tả', type: 'textarea' },
      { id: 'image', label: 'Hình ảnh', type: 'image' }
    ]
  });

  registerBlock({
    type: 'about_v2_accordion',
    name: 'About V2: Tầm nhìn/Sứ mệnh (Accordion)',
    component: AboutV2AccordionBlock,
    defaultProps: {},
    fields: [
      { id: 'vTitle', label: 'Tiêu đề Tầm nhìn', type: 'text' },
      { id: 'vContent', label: 'Nội dung Tầm nhìn', type: 'textarea' },
      { id: 'mTitle', label: 'Tiêu đề Sứ mệnh', type: 'text' },
      { id: 'mContent', label: 'Nội dung Sứ mệnh', type: 'textarea' },
      { id: 'cTitle', label: 'Tiêu đề Giá trị', type: 'text' },
      { id: 'cContent', label: 'Nội dung Giá trị', type: 'textarea' }
    ]
  });

  registerBlock({
    type: 'about_v2_timeline',
    name: 'About V2: Lịch sử (Timeline)',
    component: AboutV2TimelineBlock,
    defaultProps: {},
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' }
    ]
  });

  registerBlock({
    type: 'about_v2_location',
    name: 'About V2: Địa điểm văn phòng',
    component: AboutV2LocationBlock,
    defaultProps: {},
    fields: [
      { id: 'title', label: 'Tiêu đề', type: 'text' }
    ]
  });
};


export { 
  HeroBlock, 
  RichTextBlock, 
  GridBlock, 
  CardBlock, 
  FeatureListBlock,
  ImageBlock,
  MediaSectionBlock,
  AboutHeroBlock,
  HistoryBlock,
  VisionMissionBlock,
  CoreValuesBlock,
  AchievementsBlock,
  ProductionFacilitiesBlock,
  QualityPrinciplesBlock,
  PartnersBlock,
  TeamHeroBlock,
  TeamGridBlock,
  RefrigerationBlock,
  MEBlock,
  DataCenterBlock, 
  ServiceLifecycleBlock,
  ColdStorageCatalogBlock,
  IndustrialExpertiseBlock,
  NewsEventsBlock, 
  ProjectsBlock, 
  ProductsBlock, 
  ContactFormBlock, 
  HomeBannerSlider, 
  CapabilityProfileBlock,
  JobsListBlock,
  AboutV2HeroBlock,
  AboutV2IntroBlock,
  AboutV2AccordionBlock,
  AboutV2TimelineBlock,
  AboutV2LocationBlock
};
