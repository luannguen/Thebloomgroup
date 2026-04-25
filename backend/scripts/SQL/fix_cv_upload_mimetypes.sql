-- ==========================================
-- FIX CV UPLOAD MIMETYPES & SIZE LIMIT
-- ==========================================

-- Cập nhật bucket 'media' để cho phép PDF và Word documents
-- Đồng thời nâng giới hạn file lên 10MB (10 * 1024 * 1024 = 10485760 bytes)

UPDATE storage.buckets
SET 
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY[
    'image/png', 
    'image/jpeg', 
    'image/jpg', 
    'image/webp', 
    'image/gif', 
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
WHERE id = 'media';

-- Đảm bảo policy cho phép public upload vào thư mục cvs/ nếu chưa có
-- (Dựa trên ultimate_storage_fix.sql đã có policy cho ALL, nhưng ta làm chắc chắn hơn)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND policyname = 'Allow public upload to cvs'
    ) THEN
        CREATE POLICY "Allow public upload to cvs" 
        ON storage.objects FOR INSERT 
        TO public 
        WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'cvs');
    END IF;
END
$$;
