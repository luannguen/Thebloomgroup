
import { supabase } from '@/lib/supabase';
import { mediaService } from './mediaService';

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

export type PageFormData = Omit<StaticPage, 'id' | 'created_at' | 'updated_at'>;

export const pageService = {
    async getPages({ search, is_active }: { search?: string; is_active?: boolean } = {}) {
        let query = supabase
            .from('static_pages')
            .select('*');

        if (is_active !== undefined) {
             query = query.eq('is_active', is_active);
        }

        if (search) {
             query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        const { data, error } = await query.order('title');

        if (error) throw error;
        return data as StaticPage[];
    },

    async getPage(id: string) {
        const { data, error } = await supabase
            .from('static_pages')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as StaticPage;
    },

    async createPage(page: PageFormData) {
        const { data, error } = await supabase
            .from('static_pages')
            .insert(page)
            .select()
            .single();

        if (error) throw error;
        return data as StaticPage;
    },

    async updatePage(id: string, updates: Partial<PageFormData>) {
        const { data, error } = await supabase
            .from('static_pages')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as StaticPage;
    },

    async deletePage(id: string) {
        const { error } = await supabase
            .from('static_pages')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    async getPageBySlug(slug: string) {
        try {
            const { data, error } = await supabase
                .from('static_pages')
                .select('*')
                .eq('slug', slug)
                .maybeSingle();

            if (error) throw error;
            return { success: true, data: data as StaticPage | null };
        } catch (error: any) {
            console.error('Error fetching page by slug:', error);
            return { success: false, error: error.message };
        }
    },

    async uploadImage(file: File) {
        const result = await mediaService.uploadImage(file, 'pages');
        return result?.url || "";
    }
};
