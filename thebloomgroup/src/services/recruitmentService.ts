import { supabase } from '../supabase';

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

// Backend API base URL - reads from env, falls back to /api for production (same-origin Vercel functions)
const BACKEND_API = import.meta.env.VITE_API_URL || '/api';

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

    async uploadCV(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `cvs/${fileName}`;

        console.log('🚀 Getting signed upload URL for:', filePath);

        // 1. Get signed upload URL via backend API (bypass RLS using service_role key)
        const response = await fetch(`${BACKEND_API}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'getUploadUrl',
                path: filePath,
                bucket: 'cv_uploads'
            })
        });

        if (!response.ok) {
            let errorMsg = 'Failed to get upload URL';
            try {
                const error = await response.json();
                errorMsg = error.error || errorMsg;
            } catch { /* response might not be JSON */ }
            console.error('❌ Failed to get signed URL:', errorMsg);
            throw new Error(errorMsg);
        }

        const result = await response.json();
        const signedUrl = result.data?.signedUrl;
        
        if (!signedUrl) {
            throw new Error('Signed URL not found in response');
        }

        console.log('✅ Got signed URL, uploading file data...');

        // 2. Upload file directly to signed URL
        const uploadResponse = await fetch(signedUrl, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type
            }
        });

        if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.text();
            console.error('❌ PUT upload failed:', uploadError);
            throw new Error('Failed to upload file data to storage');
        }

        console.log('🎉 Upload successful, getting public URL...');

        // 3. Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('cv_uploads')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
