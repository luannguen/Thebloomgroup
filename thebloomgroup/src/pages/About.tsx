import { VisualEditorProvider, useVisualEditor } from "@/context/VisualEditorContext";
import { VisualPageRenderer } from "@/components/admin/builder/VisualPageRenderer";
import { HeroBlock } from "@/components/sections/HeroBlock";
import { useTranslation } from "react-i18next";

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
            {/* TheBloom Group Official Intro Banner */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white text-center">
                <div className="container-custom max-w-4xl mx-auto px-4">
                    <span className="inline-block px-4 py-1.5 bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-amber-500/30">
                        Về chúng tôi
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-8 tracking-tight">
                        GIỚI THIỆU VỀ THEBLOOM GROUP
                    </h1>
                    <div className="space-y-4 text-base sm:text-lg md:text-xl text-slate-300 leading-relaxed text-left bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl">
                        <p>
                            <strong className="text-white">TheBloom Group</strong> là doanh nghiệp hoạt động đa lĩnh vực trong sản xuất và cung ứng giải pháp công nghiệp – tiêu dùng, với trọng tâm gồm: <span className="text-amber-400 font-semibold">Thiết bị giặt là công nghiệp</span>, <span className="text-amber-400 font-semibold">May gia công & thời trang</span>, <span className="text-amber-400 font-semibold">Sản xuất đồ gia dụng & giải pháp không gian sống</span>.
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