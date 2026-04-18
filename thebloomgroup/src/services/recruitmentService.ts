import { supabase } from './supabase';

export interface Job {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    requirements: string | null;
    benefits: string | null;
    location: string | null;
    type: string | null;
    salary: string | null;
    status: string | null;
    deadline: string | null;
    created_at: string;
}

export interface ApplicationSubmission {
    job_id: string;
    full_name: string;
    email: string;
    phone: string;
    cv_url: string;
    message?: string;
}

export const recruitmentService = {
    async getActiveJobs() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('status', 'open')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Job[];
    },

    async getJobBySlug(slug: string) {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error) throw error;
        return data as Job;
    },

    async submitApplication(application: ApplicationSubmission & { b_address?: string }) {
        // Anti-spam honeypot check
        if (application.b_address && application.b_address.length > 0) {
            console.warn('Anti-spam: Backend honeypot triggered (Recruitment)');
            return { message: "Application submitted successfully" };
        }

        // Remove honeypot field
        const { b_address, ...cleanApplication } = application;

        const { data, error } = await supabase
            .from('job_applications')
            .insert([cleanApplication])
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async uploadCV(file: File) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `cvs/${fileName}`;

        const { data, error } = await supabase.storage
            .from('media') // Using existing media bucket if 'applications' doesn't exist
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
