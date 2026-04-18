-- ==========================================
-- FIX: Media Bucket Public Access
-- Chạy trong Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================

-- 1. Make the media bucket PUBLIC (cho phép truy cập ảnh qua public URL)
UPDATE storage.buckets 
SET public = true 
WHERE id = 'media';

-- 2. Policy cho phép đọc public objects trong bucket media
DROP POLICY IF EXISTS "Public Read Media Objects" ON storage.objects;
CREATE POLICY "Public Read Media Objects" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'media');

-- 3. Policy cho phép authenticated users upload/delete
DROP POLICY IF EXISTS "Authenticated Media Write" ON storage.objects;
CREATE POLICY "Authenticated Media Write" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Media Update" ON storage.objects;
CREATE POLICY "Authenticated Media Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Media Delete" ON storage.objects;
CREATE POLICY "Authenticated Media Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'media');

-- 4. Verify
SELECT id, name, public FROM storage.buckets WHERE id = 'media';
