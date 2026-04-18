-- 04_banners.sql
-- Add missing banners table and seed data
-- Generated: 2025-12-13

-- ==========================================
-- 1. CREATE BANNERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    link TEXT,
    position TEXT DEFAULT 'home_main' CHECK (position IN ('home_main', 'popup', 'sidebar', 'page_top')),
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 2. RLS POLICIES FOR BANNERS
-- ==========================================
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view active banners)
CREATE POLICY "Public can view active banners" ON public.banners
    FOR SELECT USING (is_active = true);

-- Admin full access
CREATE POLICY "Admins can manage banners" ON public.banners
    FOR ALL USING (public.is_admin());

-- ==========================================
-- 3. SEED BANNER DATA
-- ==========================================
INSERT INTO public.banners (title, description, image_url, link, position, order_index, is_active)
SELECT title, description, image_url, link, position, order_index, is_active
FROM (VALUES
(
    'Hệ thống điện lạnh công nghiệp',
    'Giải pháp hiện đại cho mọi quy mô doanh nghiệp',
    'https://images.unsplash.com/photo-1459767129954-1b1c1f9b9ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    '/products/industrial',
    'home_main',
    1,
    true
),
(
    'Công nghệ tiết kiệm năng lượng',
    'Giải pháp xanh cho tương lai bền vững',
    'https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    '/technology',
    'home_main',
    2,
    true
),
(
    'Dịch vụ bảo trì chuyên nghiệp',
    'Đội ngũ kỹ thuật hàng đầu, phục vụ 24/7',
    'https://images.unsplash.com/photo-1551038247-3d9af20df552?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    '/services',
    'home_main',
    3,
    true
)
) AS v(title, description, image_url, link, position, order_index, is_active)
WHERE NOT EXISTS (
    SELECT 1 FROM public.banners WHERE banners.title = v.title
);
