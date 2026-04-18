
-- ==========================================
-- STORAGE RLS POLICIES FOR MEDIA BUCKET
-- ==========================================

-- 1. Ensure bucket 'media' exists and is public
UPDATE storage.buckets SET public = true WHERE id = 'media';

-- 2. Drop all existing conflicting policies on storage.objects
DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN (
        SELECT policyname FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- 3. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create clean policies for 'media' bucket
-- SELECT: Anyone can view files in 'media' bucket
CREATE POLICY "media_select_public" ON storage.objects 
FOR SELECT TO public USING (bucket_id = 'media');

-- INSERT: Anyone can upload files to 'media' bucket  
CREATE POLICY "media_insert_public" ON storage.objects
FOR INSERT TO public WITH CHECK (bucket_id = 'media');

-- UPDATE: Anyone can update files in 'media' bucket
CREATE POLICY "media_update_public" ON storage.objects
FOR UPDATE TO public USING (bucket_id = 'media') WITH CHECK (bucket_id = 'media');

-- DELETE: Anyone can delete files from 'media' bucket
CREATE POLICY "media_delete_public" ON storage.objects
FOR DELETE TO public USING (bucket_id = 'media');

-- 5. Also set policies on storage.buckets so anon can list buckets
DROP POLICY IF EXISTS "media_bucket_select" ON storage.buckets;
CREATE POLICY "media_bucket_select" ON storage.buckets
FOR SELECT TO public USING (id = 'media');

SELECT 'SUCCESS: All storage RLS policies applied!' as status;
