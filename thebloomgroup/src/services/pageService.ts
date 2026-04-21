
import { supabase } from '../supabase';

export interface StaticPage {
    id: string;
    slug: string;
    title: string;
    content: string | null;
    excerpt: string | null;
    image_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const pageService = {
    async getPageBySlug(slug: string) {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .maybeSingle();

        if (error) throw error;
        return data as StaticPage;
    },

    async getAllPages({ search }: { search?: string } = {}) {
        let query = supabase
            .from('static_pages')
            .select('id, title, slug, excerpt, image_url')
            .eq('is_active', true);

        if (search) {
             query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        const { data, error } = await query.order('title');

        if (error) throw error;
        return data as Pick<StaticPage, 'id' | 'title' | 'slug' | 'excerpt' | 'image_url'>[];
    }
};
