import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { HeroBlock } from "@/components/sections/HeroBlock";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const DEFAULT_SERVICES_SECTIONS = [
  { 
    id: "hero", 
    type: "hero", 
    props: {
      title: "Dịch vụ chuyên nghiệp",
      description: "Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao từ tư vấn, lắp đặt đến bảo trì và sửa chữa.",
      backgroundImage: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=2000"
    } 
  },
  { 
    id: "overview", 
    type: "media_section", 
    props: {
      title: "Dịch vụ toàn diện",
      description: "<p>Với hơn 20 năm kinh nghiệm trong lĩnh vực điện lạnh công nghiệp và dân dụng, Thebloomgroup đã trở thành đối tác tin cậy của hàng nghìn khách hàng trên cả nước. Chúng tôi tự hào cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên viên được đào tạo bài bản.</p>",
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
        description: "Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá các dịch vụ điện lạnh phù hợp với nhu cầu của bạn. Đội ngũ kỹ thuật của Thebloomgroup luôn sẵn sàng hỗ trợ.",
        badge: "Tư vấn miễn phí"
    } 
  }
];

const ServicesContent = () => {
    return (
        <main className="flex-grow">
            <VisualPageRenderer customSections={DEFAULT_SERVICES_SECTIONS} />
        </main>
    );
};

const Services = () => {
  return (
    <VisualEditorProvider slug="services">
      <ServicesContent />
    </VisualEditorProvider>
  );
};

export default Services;
