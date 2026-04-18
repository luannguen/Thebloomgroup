import { supabase } from '@/lib/supabase';
import { Result, success, failure, ErrorCodes } from '@/components/data/types';

export interface ServiceCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Service {
    id: string;
    slug: string;
    title: string;
    description?: string;
    content?: string;
    icon?: string;
    image_url?: string;
    category_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    service_categories?: ServiceCategory;
}

export interface ServiceInquiry {
    id: string;
    service_id?: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message?: string;
    status: 'new' | 'processing' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
    services?: { title: string };
}

export type CreateServiceDTO = Omit<Service, 'id' | 'created_at' | 'updated_at' | 'service_categories'>;
export type UpdateServiceDTO = Partial<CreateServiceDTO>;

export type CreateServiceCategoryDTO = Omit<ServiceCategory, 'id' | 'created_at' | 'updated_at'>;
export type UpdateServiceCategoryDTO = Partial<CreateServiceCategoryDTO>;

export const serviceService = {
    // Services
    async getServices(): Promise<Result<Service[]>> {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, service_categories(name)')
                .order('created_at', { ascending: false });

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data || []);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async getService(id: string): Promise<Result<Service>> {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*, service_categories(name)')
                .eq('id', id)
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async createService(service: CreateServiceDTO): Promise<Result<Service>> {
        try {
            const { data, error } = await supabase
                .from('services')
                .insert([service])
                .select()
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async updateService(id: string, updates: UpdateServiceDTO): Promise<Result<Service>> {
        try {
            const { data, error } = await supabase
                .from('services')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async deleteService(id: string): Promise<Result<void>> {
        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(undefined);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    // Categories
    async getCategories(): Promise<Result<ServiceCategory[]>> {
        try {
            const { data, error } = await supabase
                .from('service_categories')
                .select('*')
                .order('display_order', { ascending: true });

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data || []);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async createCategory(category: CreateServiceCategoryDTO): Promise<Result<ServiceCategory>> {
        try {
            const { data, error } = await supabase
                .from('service_categories')
                .insert([category])
                .select()
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async updateCategory(id: string, updates: UpdateServiceCategoryDTO): Promise<Result<ServiceCategory>> {
        try {
            const { data, error } = await supabase
                .from('service_categories')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async deleteCategory(id: string): Promise<Result<void>> {
        try {
            const { error } = await supabase
                .from('service_categories')
                .delete()
                .eq('id', id);

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(undefined);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    // Inquiries
    async getInquiries(): Promise<Result<ServiceInquiry[]>> {
        try {
            const { data, error } = await supabase
                .from('service_inquiries')
                .select('*, services(title)')
                .order('created_at', { ascending: false });

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data || []);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async updateInquiryStatus(id: string, status: ServiceInquiry['status']): Promise<Result<ServiceInquiry>> {
        try {
            const { data, error } = await supabase
                .from('service_inquiries')
                .update({ status })
                .eq('id', id)
                .select()
                .single();

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(data);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    },

    async deleteInquiry(id: string): Promise<Result<void>> {
        try {
            const { error } = await supabase
                .from('service_inquiries')
                .delete()
                .eq('id', id);

            if (error) return failure(error.message, ErrorCodes.DB_ERROR);
            return success(undefined);
        } catch (err: any) {
            return failure(err.message, ErrorCodes.UNKNOWN_ERROR);
        }
    }
};

