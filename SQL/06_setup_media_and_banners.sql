-- ==========================================
-- 06_setup_media_and_banners.sql
-- Chạy script này trong Supabase SQL Editor
-- Script này sẽ khắc phục lỗi:
-- 1. Lỗi không upload được Logo (Tạo bucket)
-- 2. Lỗi trống Banners (Seed lại banners)
-- ==========================================

-- 1. SETUP THƯ MỤC LƯU TRỮ (MEDIA BUCKET)
-- Đảm bảo bucket 'media' tồn tại
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Xóa các policy cũ nếu có
DROP POLICY IF EXISTS "Public có thể xem media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users có thể upload/edit media" ON storage.objects;

-- Cho phép TẤT CẢ mọi người có quyền Đọc (XEM ảnh)
CREATE POLICY "Public có thể xem media"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'media' );

-- Cho phép NHỮNG NGƯỜI ĐÃ ĐĂNG NHẬP (VD: admin) có quyền quản lý thay đổi (INSERT/UPDATE/DELETE)
CREATE POLICY "Authenticated users có thể quản lý media"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'media' 
    AND auth.role() = 'authenticated'
  );


-- 2. SEED LẠI DỮ LIỆU BANNERS CHO CLIENT & ADMIN (Thêm dữ liệu nếu bảng trống)
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
