import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { HeroBlock } from "@/components/sections/HeroBlock";
import { useTranslation } from "react-i18next";

import PageBanner from "@/components/common/PageBanner";

const AboutContent = () => {
    const { contentData, isLoading } = useVisualEditor();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="w-10 h-10 border-3 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    const sections = contentData?.sections || [];

    // If we have sections in DB (e.g. about_hero, history, etc.), use the VisualPageRenderer
    if (sections.length > 0) {
        return (
            <main className="flex-grow">
                <VisualPageRenderer />
            </main>
        );
    }

    return (
        <main className="flex-grow">
            <PageBanner
                title="GIỚI THIỆU VỀ THEBLOOM GROUP"
                subtitle="TheBloom Group là doanh nghiệp hoạt động đa lĩnh vực trong sản xuất và cung ứng giải pháp công nghiệp – tiêu dùng: Thiết bị giặt là công nghiệp, May gia công & thời trang, Sản xuất đồ gia dụng & giải pháp không gian sống."
                badge="Về Chúng Tôi"
                backgroundImage="/images/bloom/thiet-bi-giat-la.jpg"
                breadcrumbs={[
                    { label: 'Giới thiệu' }
                ]}
            />
            <div className="py-16 md:py-24 bg-white">
                <div className="container-custom max-w-4xl mx-auto px-4">
                    <div className="space-y-6 text-base sm:text-lg md:text-xl text-slate-600 leading-relaxed bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-sm">
                        <p>
                            <strong className="text-slate-900 font-bold">TheBloom Group</strong> là doanh nghiệp hoạt động đa lĩnh vực trong sản xuất và cung ứng giải pháp công nghiệp – tiêu dùng, với trọng tâm gồm: <span className="text-primary font-bold">Thiết bị giặt là công nghiệp</span>, <span className="text-primary font-bold">May gia công & thời trang</span>, <span className="text-primary font-bold">Sản xuất đồ gia dụng & giải pháp không gian sống</span>.
                        </p>
                        <p>
                            Với nền tảng năng lực sản xuất mạnh mẽ cùng tư duy phát triển bền vững, TheBloom Group hướng đến trở thành đối tác chiến lược toàn diện cho doanh nghiệp và khách hàng trong nước & quốc tế.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
};

const About = () => {
  return (
    <VisualEditorProvider slug="about-us">
      <AboutContent />
    </VisualEditorProvider>
  );
};

export default About;