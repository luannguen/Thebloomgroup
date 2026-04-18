-- Recruitment Schema

-- Create Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    requirements TEXT,
    benefits TEXT,
    location TEXT DEFAULT 'TP. Hồ Chí Minh',
    type TEXT DEFAULT 'Full-time', -- Full-time, Part-time, Contract, Internship
    salary TEXT DEFAULT 'Thỏa thuận',
    status TEXT DEFAULT 'open', -- open, closed, draft
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Job Applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    cv_url TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, interviewed, rejected, hired
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policies for Jobs
CREATE POLICY "Public can view open jobs" ON public.jobs
    FOR SELECT USING (status = 'open');

CREATE POLICY "Admins have full access to jobs" ON public.jobs
    USING (true)
    WITH CHECK (true);

-- Policies for Applications
CREATE POLICY "Public can submit applications" ON public.job_applications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have full access to applications" ON public.job_applications
    USING (true)
    WITH CHECK (true);

-- Create storage bucket for CVs (optional, typically done via Supabase dashboard or API)
-- insert into storage.buckets (id, name, public) values ('applications', 'applications', true);

-- Add to navigation or pages if needed (handled via seed/scripts)
