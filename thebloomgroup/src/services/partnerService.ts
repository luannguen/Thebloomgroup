import { supabase } from '@/supabase';
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
    async getAll(): Promise<Result<Partner[]>> {
        const { data, error } = await supabase
            .from('partners')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) {
            console.error('Error fetching partners:', error);
            return failure(error.message, ErrorCodes.DB_ERROR);
        }

        return success(data || []);
    }
};
