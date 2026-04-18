-- ==========================================
-- OPTIMIZED STORAGE RLS FIX (BYPASS SYSTEM TABLES)
-- Chạy đoạn code này trong Supabase SQL Editor
-- ==========================================

-- 1. Cấp quyền Schema (Dùng cho quyền truy cập cơ bản)
GRANT USAGE ON SCHEMA storage TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA storage TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA storage TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA storage TO anon, authenticated;

-- 2. TỰ ĐỘNG MỞ KHÓA CÁC BẢNG DỮ LIỆU (Bỏ qua bảng hệ thống admin-only)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' 
        -- Bỏ qua các bảng hệ thống mà role postgres không có quyền thay đổi policy
        AND table_name NOT IN ('migrations', 's3_multipart_uploads', 's3_multipart_uploads_parts')
    ) LOOP
        BEGIN
            -- Thử tắt RLS
            EXECUTE format('ALTER TABLE storage.%I DISABLE ROW LEVEL SECURITY', r.table_name);
            RAISE NOTICE 'Disabled RLS on table: %', r.table_name;
        EXCEPTION WHEN OTHERS THEN
            -- Nếu không tắt được, tạo policy cho phép ALL
            EXECUTE format('DROP POLICY IF EXISTS "allow_all_access" ON storage.%I', r.table_name);
            EXECUTE format('CREATE POLICY "allow_all_access" ON storage.%I FOR ALL TO public USING (true) WITH CHECK (true)', r.table_name);
            RAISE NOTICE 'Applied policy on table: %', r.table_name;
        END;
    END LOOP;
END
$$;

-- 3. Cấu hình đặc thù cho buckets và objects
-- Cho phép mọi người đọc bucket 'media'
DROP POLICY IF EXISTS "Public Access" ON storage.buckets;
CREATE POLICY "Public Access" ON storage.buckets FOR SELECT TO public USING (name = 'media');

-- Cho phép ALL thao tác trên objects trong bucket 'media'
DROP POLICY IF EXISTS "Admin Media Access" ON storage.objects;
CREATE POLICY "Admin Media Access" ON storage.objects FOR ALL TO public 
USING (bucket_id = 'media') 
WITH CHECK (bucket_id = 'media');

-- 4. Đặt SEARCH_PATH để Supabase client tìm thấy bảng
ALTER ROLE anon SET search_path = public, storage;
ALTER ROLE authenticated SET search_path = public, storage;

SELECT 'Storage RLS Fix (Optimized) applied.' as status;
