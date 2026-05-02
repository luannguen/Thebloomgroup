import { supabase } from '../supabase';
import { Result, success, failure, ErrorCodes } from '../components/data/types';

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    display_order: number;
}

export interface Service {
    id: string;
    slug: string;
    title: string;
    description?: string;
    content?: string;
    icon?: string;
    image_url?: string;
    image_width?: number;
    icon_size?: number;
    image_position?: string;
    category_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    service_categories?: ServiceCategory;
}

export interface CreateInquiryDTO {
    service_id?: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
}

export const serviceService = {
    async getCategories(): Promise<Result<ServiceCategory[]>> {
        try {
            const { data, error } = await supabase
                .from('service_categories')
                .select('*')
                .eq('is_active', true)
                .order('display_order', { ascending: true });

            if (error) return failure(error.message, ErrorCodes.DB_ERROR, error);
            return success(data || []);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR, err);
        }
    },

    async getServices(categoryId?: string): Promise<Result<Service[]>> {
        try {
            let query = supabase
                .from('services')
                .select('*, service_categories(*)')
                .eq('is_active', true);
            
            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) return failure(error.message, ErrorCodes.DB_ERROR, error);
            return success(data || []);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR, err);
        }
    },

    async getServiceBySlug(slug: string): Promise<Result<Service>> {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, service_categories(*)')
                .eq('slug', slug)
                .eq('is_active', true)
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR, error);
            if (!data) return failure('Service not found', ErrorCodes.NOT_FOUND);

            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR, err);
        }
    },

    async submitInquiry(inquiry: CreateInquiryDTO & { b_address?: string }): Promise<Result<void>> {
        try {
            // Anti-spam honeypot check
            if (inquiry.b_address && inquiry.b_address.length > 0) {
                console.warn('Anti-spam: Backend honeypot triggered (ServiceInquiry)');
                return success(undefined);
            }

            // Remove honeypot field
            const { b_address, ...cleanInquiry } = inquiry;

            const { error } = await supabase
                .from('service_inquiries')
                .insert([cleanInquiry]);

            if (error) return failure(error.message, ErrorCodes.DB_ERROR, error);
            return success(undefined);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR, err);
        }
    }
};

