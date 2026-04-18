-- 012_services_extended_schema.sql
-- Add Services, Service Categories and Service Inquiries

-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    icon TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    category_id UUID REFERENCES public.service_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create service_inquiries table
CREATE TABLE IF NOT EXISTS public.service_inquiries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'processing', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable RLS
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_inquiries ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for service_categories
DROP POLICY IF EXISTS "Allow public read access for active service_categories" ON public.service_categories;
CREATE POLICY "Allow public read access for active service_categories"
ON public.service_categories FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Allow all for admin on service_categories" ON public.service_categories;
CREATE POLICY "Allow all for admin on service_categories"
ON public.service_categories FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 6. RLS Policies for services
DROP POLICY IF EXISTS "Allow public read access for active services" ON public.services;
CREATE POLICY "Allow public read access for active services"
ON public.services FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Allow all for admin on services" ON public.services;
CREATE POLICY "Allow all for admin on services"
ON public.services FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 7. RLS Policies for service_inquiries
DROP POLICY IF EXISTS "Allow public insert for service_inquiries" ON public.service_inquiries;
CREATE POLICY "Allow public insert for service_inquiries"
ON public.service_inquiries FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for admin on service_inquiries" ON public.service_inquiries;
CREATE POLICY "Allow all for admin on service_inquiries"
ON public.service_inquiries FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
