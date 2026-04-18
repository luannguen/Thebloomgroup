import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { projectService } from "@/services/projectService";
import { productService } from "@/services/productService";
import { pageService, StaticPage } from "@/services/pageService";
import { newsAPI } from "@/components/data/services/newsService";
import { Project, Product } from "@/components/data/types";
import { NewsItem } from "@/components/data/models/news";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CalendarIcon, ChevronRight, Package, FileText, Search as SearchIcon } from "lucide-react";

const SearchResults = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";

    const [projects, setProjects] = useState<Project[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [pages, setPages] = useState<Pick<StaticPage, 'id' | 'title' | 'slug' | 'excerpt' | 'image_url'>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!query) return;
            setLoading(true);

            try {
                const [projectResult, productResult, newsResult, pagesResult] = await Promise.all([
                    projectService.getProjects({ search: query }),
                    productService.getProducts({ search: query }),
                    newsAPI.getAll(query),
                    pageService.getAllPages({ search: query }).catch(() => [])
                ]);

                if (projectResult.success) {
                    setProjects(projectResult.data);
                }

                if (productResult.success) {
                    setProducts(productResult.data);
                }

                if (newsResult.success) {
                    setNews(newsResult.data);
                }
                
                if (pagesResult) {
                    setPages(pagesResult);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    if (loading) {
        return <div className="container-custom py-16 text-center">{t('search_loading')}</div>;
    }

    const hasResults = projects.length > 0 || news.length > 0 || products.length > 0 || pages.length > 0;
    const totalResults = projects.length + news.length + products.length + pages.length;

    return (
        <main className="flex-grow">
            <div className="bg-gray-50 py-12">
                <div className="container-custom">
                    <h1 className="text-3xl font-bold mb-4">{t('search_results_title')}: "{query}"</h1>
                    {!hasResults && (
                        <div className="text-muted-foreground flex flex-col items-center py-8 gap-4">
                            <SearchIcon size={48} className="text-gray-300" />
                            <p>{t('search_no_results')}</p>
                        </div>
                    )}
                </div>
            </div>

            {hasResults && (
                <div className="container-custom py-8">
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="mb-8 flex flex-wrap h-auto gap-2">
                            <TabsTrigger value="all">{t('search_all')} ({totalResults})</TabsTrigger>
                            {products.length > 0 && <TabsTrigger value="products">{t('search_products')} ({products.length})</TabsTrigger>}
                            {projects.length > 0 && <TabsTrigger value="projects">{t('search_projects')} ({projects.length})</TabsTrigger>}
                            {pages.length > 0 && <TabsTrigger value="pages">{t('search_services')} ({pages.length})</TabsTrigger>}
                            {news.length > 0 && <TabsTrigger value="news">{t('search_news')} ({news.length})</TabsTrigger>}
                        </TabsList>

                        <TabsContent value="all" className="space-y-12">
                            {products.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        {t('search_products')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.slice(0, 3).map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {projects.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        {t('search_projects')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {projects.slice(0, 3).map(project => (
                                            <ProjectCard key={project.id} project={project} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {pages.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                                        {t('search_services')}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pages.slice(0, 3).map(page => (
                                            <PageCard key={page.id} page={page} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {news.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-6">{t('search_news')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {news.slice(0, 3).map(item => (
                                            <NewsCard key={item.id} item={item} formatDate={formatDate} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="products">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="projects">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <ProjectCard key={project.id} project={project} />
                                ))}
                            </div>
                        </TabsContent>
                        
                        <TabsContent value="pages">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pages.map(page => (
                                    <PageCard key={page.id} page={page} />
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="news">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {news.map(item => (
                                    <NewsCard key={item.id} item={item} formatDate={formatDate} />
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </main>
    );
};

const ProjectCard = ({ project }: { project: Project }) => (
    <div className="group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        <Link to={`/project-details/${project.id}`} className="block aspect-video overflow-hidden">
            <img
                src={project.image_url || '/placeholder-project.jpg'}
                alt={project.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </Link>
        <div className="p-4">
            <div className="text-xs text-primary font-medium mb-2 uppercase tracking-wider">
                {project.category?.name || ''}
            </div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                <Link to={`/project-details/${project.id}`}>{project.name}</Link>
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {project.description}
            </p>
            <Link
                to={`/project-details/${project.id}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
                <ChevronRight size={16} className="ml-1" />
            </Link>
        </div>
    </div>
);

const ProductCard = ({ product }: { product: Product }) => (
    <div className="group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        <Link to={`/products/${product.slug}`} className="block aspect-video overflow-hidden bg-gray-50 flex items-center justify-center relative">
            {product.image_url ? (
                <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <Package size={48} className="text-gray-300" />
            )}
            {product.is_new && (
                <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded">MỚI</span>
            )}
        </Link>
        <div className="p-4">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                <Link to={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            {product.price && (
                <p className="font-semibold text-primary mb-2">Liên hệ báo giá</p>
            )}
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {product.description}
            </p>
            <Link
                to={`/products/${product.slug}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
                <ChevronRight size={16} className="ml-1" />
            </Link>
        </div>
    </div>
);

const PageCard = ({ page }: { page: Pick<StaticPage, 'id' | 'title' | 'slug' | 'excerpt' | 'image_url'> }) => (
    <div className="group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
        <Link to={`/page/${page.slug}`} className="block aspect-video overflow-hidden bg-gray-50 flex items-center justify-center">
            {page.image_url ? (
                <img
                    src={page.image_url}
                    alt={page.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            ) : (
                <FileText size={48} className="text-gray-300" />
            )}
        </Link>
        <div className="p-4">
            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                <Link to={`/page/${page.slug}`}>{page.title}</Link>
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {page.excerpt}
            </p>
            <Link
                to={`/page/${page.slug}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80"
            >
                <ChevronRight size={16} className="ml-1" />
            </Link>
        </div>
    </div>
);

const NewsCard = ({ item, formatDate }: { item: NewsItem, formatDate: (d?: string) => string }) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <Link to={item.type === "news" ? `/news/${item.id}` : `/event-details/${item.id}`} className="block aspect-[4/3] overflow-hidden">
            <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
            />
        </Link>

        <div className="p-4">
            <div className="flex items-center justify-between mb-2">
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {item.category}
                </span>
                <span className="text-xs text-muted-foreground flex items-center">
                    <CalendarIcon size={12} className="mr-1" />
                    {formatDate(item.publishDate)}
                </span>
            </div>

            <h3 className="text-lg font-bold text-primary mb-2 hover:text-accent">
                <Link to={item.type === "news" ? `/news/${item.id}` : `/event-details/${item.id}`}>
                    {item.title}
                </Link>
            </h3>

            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {item.summary}
            </p>
        </div>
    </div>
);

export default SearchResults;
