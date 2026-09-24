import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { bannerService, Banner } from '@/services/bannerService';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { EditableElement } from '../admin/EditableElement';
import Autoplay from "embla-carousel-autoplay";
import { BloomHeroSplit } from './BloomHeroSplit';

interface HomeBannerSliderProps {
    sectionId?: string;
}

export const HomeBannerSlider = ({ sectionId }: HomeBannerSliderProps) => {
    const { t } = useTranslation();
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const result = await bannerService.getBanners('home_main');
                if (result.success) {
                    setBanners(result.data);
                }
            } catch (error) {
                console.error("Error fetching homepage banners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBanners();
    }, []);

    if (loading) {
        return (
            <div className="h-[70vh] flex items-center justify-center bg-muted/20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
        );
    }

    // Fallback if no banners are present: Render the exact TheBloom Group 3-column Hero
    if (banners.length === 0) {
        return <BloomHeroSplit sectionId={sectionId} />;
    }

    return (
        <section className="relative group">
            <Carousel 
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 6000,
                    }),
                ]}
                className="w-full"
            >
                <CarouselContent className="-ml-0">
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="pl-0">
                            <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden flex items-center">
                                {/* Background Image with Zoom effect */}
                                <div className="absolute inset-0 z-0 scale-105 animate-in zoom-in duration-[10000ms]">
                                    <img 
                                        src={banner.image_url} 
                                        alt={banner.title || "Banner"} 
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlays */}
                                    <div className="absolute inset-0 bg-black/40" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                                </div>

                                {/* Content */}
                                <div className="container-custom relative z-10 text-white">
                                    <div className="max-w-3xl space-y-6">
                                        <div className="overflow-hidden">
                                            <h2 
                                                className="text-4xl md:text-7xl font-extrabold tracking-tight leading-[1.1] animate-in slide-in-from-bottom-8 duration-1000"
                                                style={{ color: banner.title_color || 'inherit' }}
                                            >
                                                {banner.title}
                                            </h2>
                                        </div>
                                        
                                        <div className="overflow-hidden">
                                            <p 
                                                className="text-lg md:text-2xl opacity-90 max-w-2xl leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-300"
                                                style={{ color: banner.description_color || 'inherit' }}
                                            >
                                                {banner.description}
                                            </p>
                                        </div>


                                        <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                                            {banner.link && (
                                                <Button size="lg" className="rounded-full px-8 bg-secondary hover:bg-secondary/90 text-white shadow-xl group/btn transition-all active:scale-95" asChild>
                                                    <Link to={banner.link}>
                                                        {t('view_details', 'Xem chi tiết')}
                                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                                                    </Link>
                                                </Button>
                                            )}
                                            <Button size="lg" variant="outline" className="rounded-full px-8 bg-white/5 backdrop-blur-md border-white/20 hover:bg-white/10 text-white active:scale-95" asChild>
                                                <Link to="/contact">{t('get_consultancy', 'Nhận tư vấn')}</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative element */}
                                <div className="absolute bottom-0 right-0 p-12 hidden lg:block opacity-20 pointer-events-none">
                                    <h3 className="text-9xl font-black text-white/10 tracking-tighter select-none">
                                        THEBLOOM GROUP
                                    </h3>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {/* Navigation - hidden on mobile, visible on hover on desktop */}
                <div className="hidden md:block">
                    <CarouselPrevious className="left-8 bg-black/20 border-white/20 text-white hover:bg-primary hover:border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12" />
                    <CarouselNext className="right-8 bg-black/20 border-white/20 text-white hover:bg-primary hover:border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-12 w-12" />
                </div>

                {/* Indicators contextually handled by Embla but for simplicity here we keep it clean */}
            </Carousel>
        </section>
    );
};
