import { supabase } from '@/lib/supabase';

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
    updated_at: string;
}

export interface JobFormData {
    title: string;
    slug: string;
    description?: string;
    requirements?: string;
    benefits?: string;
    location?: string;
    type?: string;
    salary?: string;
    status?: string;
    deadline?: string;
}

export interface JobApplication {
    id: string;
    job_id: string;
    full_name: string;
    email: string;
    phone: string;
    cv_url: string;
    message: string | null;
    status: string | null;
    created_at: string;
    job?: {
        title: string;
    };
}

export const recruitmentService = {
    // Job Management
    async getJobs() {
        const { data, error } = await supabase
            .from('jobs')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as Job[];
    },

    async createJob(jobData: JobFormData) {
        const { data, error } = await supabase
            .from('jobs')
            .insert([jobData])
            .select()
            .single();
        
        if (error) throw error;
        return data as Job;
    },

    async updateJob(id: string, jobData: Partial<JobFormData>) {
        const { data, error } = await supabase
            .from('jobs')
            .update({ ...jobData, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as Job;
    },

    async deleteJob(id: string) {
        const { error } = await supabase
            .from('jobs')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    },

    // Application Management
    async getApplications() {
        const { data, error } = await supabase
            .from('job_applications')
            .select('*, job:jobs(title)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data as JobApplication[];
    },

    async updateApplicationStatus(id: string, status: string) {
        const { data, error } = await supabase
            .from('job_applications')
            .update({ status })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data as JobApplication;
    },

    async deleteApplication(id: string) {
        const { error } = await supabase
            .from('job_applications')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return true;
    }
};
