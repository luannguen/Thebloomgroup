
import { useState, useEffect, useMemo } from "react";
import { pageService, StaticPage } from "@/services/pageService";
import { useToast } from "@/components/ui/use-toast";

export type SortField = "title" | "updated_at";
export type SortOrder = "asc" | "desc";
export type StatusFilter = "all" | "active" | "inactive";

export function usePages() {
    const [pages, setPages] = useState<StaticPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [sortBy, setSortBy] = useState<SortField>("updated_at");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    
    const { toast } = useToast();

    const fetchPages = async () => {
        try {
            setLoading(true);
            const data = await pageService.getPages();
            
            // Ensure Home and Home V2 are always present
            const hasHome = data.some(p => p.slug === 'home');
            const hasHomeV2 = data.some(p => p.slug === 'home_v2');
            
            let finalPages = [...data];

            if (!hasHome) {
                finalPages.push({
                    id: 'home-virtual',
                    slug: 'home',
                    title: 'Trang chủ (Mặc định)',
                    content: JSON.stringify({
                        sections: [
                            { id: 'banner', type: 'home_banner_slider', props: {} },
                            { id: 'refrigeration', type: 'refrigeration', props: {} },
                            { id: 'me_systems', type: 'me_systems', props: {} },
                            { id: 'data_center', type: 'data_center', props: {} },
                            { id: 'products', type: 'product_categories', props: {} },
                            { id: 'projects', type: 'featured_projects', props: {} },
                            { id: 'service_lifecycle', type: 'service_lifecycle', props: {} },
                            { id: 'news_events', type: 'news_events', props: {} },
                            { id: 'contact', type: 'contact_form', props: {} }
                        ]
                    }),
                    excerpt: 'Trang chủ chính của website',
                    image_url: null,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }

            if (!hasHomeV2) {
                finalPages.push({
                    id: 'home-v2-virtual',
                    slug: 'home_v2',
                    title: 'Trang chủ V2 (Hệ thống mới)',
                    content: JSON.stringify({
                        sections: [
                            { id: 'banner', type: 'home_banner_slider', props: {} },
                            { id: 'partnership', type: 'home_v2_partnership', props: {} },
                            { id: 'sectors', type: 'home_v2_sectors', props: {} },
                            { id: 'solutions', type: 'home_v2_solutions', props: {} },
                            { id: 'stats', type: 'home_v2_stats', props: {} },
                            { id: 'featured_projects', type: 'featured_projects', props: {} },
                            { id: 'news', type: 'news_events', props: {} },
                            { id: 'contact', type: 'contact_form', props: {} }
                        ]
                    }),
                    excerpt: 'Trang chủ phiên bản mới với cấu trúc công nghiệp',
                    image_url: null,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                });
            }

            setPages(finalPages);
        } catch (error) {
            console.error(error);
            toast({
                title: "Lỗi",
                description: "Không thể tải danh sách trang",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    // Filter and Sort Logic
    const filteredAndSortedPages = useMemo(() => {
        let result = [...pages];

        // 1. Filter by search term
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter(page => 
                page.title.toLowerCase().includes(lowerSearch) || 
                page.slug.toLowerCase().includes(lowerSearch)
            );
        }

        // 2. Filter by status
        if (statusFilter !== "all") {
            const isActive = statusFilter === "active";
            result = result.filter(page => page.is_active === isActive);
        }

        // 3. Sort
        result.sort((a, b) => {
            // Prioritize system pages (home) if not searching/filtering heavily? 
            // Or just follow the sort rules but keep home on top by default
            if (!searchTerm && statusFilter === "all" && sortBy === "updated_at" && sortOrder === "desc") {
                if (a.slug === 'home') return -1;
                if (b.slug === 'home') return 1;
                if (a.slug === 'home_v2') return -1;
                if (b.slug === 'home_v2') return 1;
            }

            let compare = 0;
            if (sortBy === "title") {
                compare = a.title.localeCompare(b.title);
            } else {
                compare = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
            }

            return sortOrder === "asc" ? compare : -compare;
        });

        return result;
    }, [pages, searchTerm, statusFilter, sortBy, sortOrder]);

    // Pagination Logic
    const totalItems = filteredAndSortedPages.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedPages = filteredAndSortedPages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        setCurrentPage(1);
    };

    return {
        pages: paginatedPages,
        allFilteredPages: filteredAndSortedPages,
        loading,
        fetchPages,
        searchTerm,
        setSearchTerm,
        statusFilter,
        setStatusFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        pagination: {
            currentPage,
            pageSize,
            totalPages,
            totalItems,
            handlePageChange,
            handlePageSizeChange
        }
    };
}
