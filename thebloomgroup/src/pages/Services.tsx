import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";

const DEFAULT_SERVICES_SECTIONS = [
  { 
    id: "hero", 
    type: "service_hero", 
    props: {
      title: "Dịch vụ chuyên nghiệp",
      description: "Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao từ tư vấn, lắp đặt đến bảo trì và sửa chữa."
    } 
  },
  { 
    id: "overview", 
    type: "media_section", 
    props: {
      title: "Dịch vụ toàn diện",
      description: "<p>Với hơn 20 năm kinh nghiệm trong lĩnh vực điện lạnh công nghiệp và dân dụng, VVC đã trở thành đối tác tin cậy của hàng nghìn khách hàng trên cả nước. Chúng tôi tự hào cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên viên được đào tạo bài bản.</p>",
      image: "/assets/images/service-overview.jpg",
      layout: "image-right",
      imageWidth: 50
    } 
  },
  { 
    id: "grid", 
    type: "service_grid", 
    props: {
        title: "Danh mục dịch vụ",
        description: "Chúng tôi cung cấp đầy đủ các dịch vụ điện lạnh công nghiệp và dân dụng, từ tư vấn thiết kế đến lắp đặt, bảo trì và sửa chữa."
    } 
  },
  { 
    id: "cta", 
    type: "cta_section", 
    props: {
        title: "Bắt đầu với dịch vụ của chúng tôi",
        description: "Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá các dịch vụ điện lạnh phù hợp với nhu cầu của bạn. Đội ngũ kỹ thuật của VVC luôn sẵn sàng hỗ trợ.",
        badge: "Tư vấn miễn phí"
    } 
  }
];

const ServicesContent = () => {
  const { contentData } = useVisualEditor();
  
  // Smart merge logic: If the persistent database record is missing the grid or CTA 
  // (which used to be hardcoded but are now blocks), we re-inject them.
  if (contentData?.sections && contentData.sections.length > 0) {
    const hasGrid = contentData.sections.some((s: any) => s.type === "service_grid");
    const hasCTA = contentData.sections.some((s: any) => s.type === "cta_section");
    
    // Create a new merged array
    let displaySections = [...contentData.sections];
    
    // Inject missing essential sections if they don't exist in DB
    if (!hasGrid) {
      displaySections.push(DEFAULT_SERVICES_SECTIONS.find(s => s.id === "grid")!);
    }
    if (!hasCTA) {
      displaySections.push(DEFAULT_SERVICES_SECTIONS.find(s => s.id === "cta")!);
    }
    
    return <VisualPageRenderer customSections={displaySections} />;
  }

  // Fallback of last resort
  return <VisualPageRenderer customSections={DEFAULT_SERVICES_SECTIONS} />;
};

const Services = () => {
  return (
    <VisualEditorProvider slug="services">
      <ServicesContent />
    </VisualEditorProvider>
  );
};

export default Services;
