-- 09_create_partners_table.sql
-- Create partners table for managing partner and client logos

CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Policies for public viewing
CREATE POLICY "Public can view active partners" ON public.partners
    FOR SELECT USING (is_active = true);

-- Policies for admin management (all operations)
CREATE POLICY "Admins can manage partners" ON public.partners
    USING (auth.role() = 'authenticated'); -- Simplified for this environment

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_partners_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners
    FOR EACH ROW EXECUTE FUNCTION update_partners_updated_at_column();
