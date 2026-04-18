import { supabase } from '@/lib/supabase';
import { Result, ErrorCodes, success, failure } from '@/components/data/types';

export interface Partner {
    id: string;
    name: string;
    logo_url?: string;
    website_url?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export const partnerService = {
    async getAll(): Promise<Partner[]> {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching partners:', error);
            throw error;
        }

        return data || [];
    },

    async getById(id: string): Promise<Partner | null> {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    async create(partner: Partial<Partner>): Promise<Result<Partner>> {
        const { data, error } = await supabase
            .from('partners')
            .insert([partner])
            .select()
            .single();

        if (error) {
            console.error('Error creating partner:', error);
            return failure(error.message, ErrorCodes.DB_ERROR);
        }

        return success(data);
    },

    async update(id: string, partner: Partial<Partner>): Promise<Result<Partner>> {
        const { data, error } = await supabase
            .from('partners')
            .update(partner)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating partner:', error);
            return failure(error.message, ErrorCodes.DB_ERROR);
        }

        return success(data);
    },

    async delete(id: string): Promise<Result<void>> {
        const { error } = await supabase
            .from('partners')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting partner:', error);
            return failure(error.message, ErrorCodes.DB_ERROR);
        }

        return success(undefined);
    },

    async updateOrder(items: { id: string; display_order: number }[]): Promise<Result<void>> {
        const updates = items.map(item =>
            supabase.from('partners').update({ display_order: item.display_order }).eq('id', item.id)
        );

        const results = await Promise.all(updates);
        const hasError = results.some(r => r.error);

        if (hasError) {
            return failure('Failed to update some orders', ErrorCodes.DB_ERROR);
        }

        return success(undefined);
    }
};
