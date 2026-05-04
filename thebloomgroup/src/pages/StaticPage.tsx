import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { pageService } from '@/services/pageService';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import NotFound from './NotFound';
import { VisualSectionRenderer } from '@/components/visual-editor/VisualSectionRenderer';
import { VisualEditorProvider } from '@/context/VisualEditorContext';
import { VisualPageRenderer } from '@/components/admin/builder/VisualPageRenderer';
import { HeroBlock } from '@/components/sections/HeroBlock';

interface StaticPageProps {
    slug?: string;
}

const StaticPage: React.FC<StaticPageProps> = ({ slug: propSlug }) => {
    const { slug: paramSlug } = useParams<{ slug: string }>();
    const [searchParams] = useSearchParams();
    const { t, i18n } = useTranslation();
    const slug = propSlug || paramSlug;
    const isEditMode = searchParams.get('edit_mode') === 'true';

    const [page, setPage] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [editableData, setEditableData] = useState<any>(null);

    useEffect(() => {
        const fetchPage = async () => {
            if (!slug) {
                setLoading(false);
                setError(true);
                return;
            }

            try {
                setLoading(true);
                const data = await pageService.getPageBySlug(slug);
                console.log(`[StaticPage] Fetching slug "${slug}":`, data ? 'Found' : 'Not Found');
                if (data) {
                    setPage(data);
                    if (data.content && data.content.startsWith('{')) {
                        try {
                            setEditableData(JSON.parse(data.content));
                        } catch (e) {
                            console.error("Failed to parse page JSON content");
                        }
                    }
                } else {
                    console.warn(`[StaticPage] Page with slug "${slug}" not found in database.`);
                    setError(true);
                }
            } catch (err) {
                console.error("Failed to fetch page", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !page) {
        return <NotFound />;
    }

    const currentLang = i18n.language || 'vi';
    const isDefaultLang = currentLang === 'vi';
    const displayTitle = isDefaultLang ? page.title : (page[`title_${currentLang}`] || page.title);
    const displayExcerpt = isDefaultLang ? page.excerpt : (page[`excerpt_${currentLang}`] || page.excerpt);

    const displaySections = editableData?.sections || [];
    const heroSection = displaySections.find((s: any) => s.type === 'hero');
    const otherSections = displaySections.filter((s: any) => s.type !== 'hero');

    return (
        <VisualEditorProvider slug={slug || ''}>
            <main className="flex-grow">
                {isEditMode ? (
                    <VisualPageRenderer />
                ) : (
                    <>
                        {/* Dynamic Banner Handling */}
                        {heroSection ? (
                            <HeroBlock 
                                sectionId={heroSection.id} 
                                {...heroSection.props} 
                            />
                        ) : (
                            /* Improved Fallback Banner for Static Pages */
                            <div className="relative bg-primary pt-32 pb-16 md:pt-48 md:pb-24 text-white overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-blue-900 opacity-90"></div>
                                <div className="container-custom relative z-10">
                                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">{displayTitle}</h1>
                                    {displayExcerpt && (
                                        <p className="text-lg md:text-xl text-blue-100 max-w-3xl font-light leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                                            {displayExcerpt}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other Sections or Legacy Content */}
                        {otherSections.length > 0 ? (
                            <VisualSectionRenderer sections={otherSections} isEditMode={false} />
                        ) : (
                            /* Render legacy HTML content if no other sections exist */
                            !heroSection && (
                                <section className="py-12 md:py-16">
                                    <div className="container-custom">
                                        <div
                                            className="prose prose-lg max-w-none dark:prose-invert"
                                            dangerouslySetInnerHTML={{ __html: page.content || '' }}
                                        />
                                    </div>
                                </section>
                            )
                        )}
                    </>
                )}
            </main>
        </VisualEditorProvider>
    );
};

export default StaticPage;
