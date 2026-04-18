import { supabase } from "./supabase";
import { NavigationItem, Result, success, failure } from "@/components/data/types";

export const navigationService = {
    async getNavigationItems(): Promise<Result<NavigationItem[]>> {
        try {
            // 1. Fetch active navigation items
            const { data: navData, error: navError } = await supabase
                .from('navigation')
                .select('*')
                .eq('is_active', true)
                .order('order_index', { ascending: true });

            if (navError) throw navError;

            // 2. Fetch list of INACTIVE static pages to hide their menu items
            const { data: inactivePages, error: pagesError } = await supabase
                .from('static_pages')
                .select('slug')
                .eq('is_active', false);

            if (pagesError) {
                console.error('Error fetching inactive pages for menu sync:', pagesError);
                // Continue with navData if pages fetch fails, non-blocking
                return success(navData as NavigationItem[]);
            }

            const inactiveSlugs = inactivePages.map(p => p.slug);

            // 3. Filter navigation items
            const filteredNavData = (navData as NavigationItem[]).filter(item => {
                const path = item.path || '';
                // Check if path matches any inactive slug (handling leading slash)
                const isPointingToInactivePage = inactiveSlugs.some(slug => 
                    path === slug || 
                    path === `/${slug}` || 
                    path === `/page/${slug}`
                );
                
                return !isPointingToInactivePage;
            });

            return success(filteredNavData);
        } catch (error) {
            console.error('Error fetching navigation:', error);
            return failure('Failed to fetch navigation items');
        }
    }
};

