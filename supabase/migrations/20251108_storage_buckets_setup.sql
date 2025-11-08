-- =====================================================
-- PULSE OF PEOPLE - SUPABASE STORAGE BUCKETS SETUP
-- Migration: 20251108_storage_buckets_setup.sql
-- Description: Storage buckets for photos, reports, media
-- Buckets: voter-photos, field-worker-photos, reports, social-media-archive, competitor-media
-- =====================================================

-- =====================================================
-- 1. VOTER PHOTOS BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voter-photos',
  'voter-photos',
  false, -- Private bucket
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload photos for voters in their tenant
CREATE POLICY "tenant_isolation_voter_photos_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'voter-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

-- RLS Policy: Users can view photos for voters in their tenant
CREATE POLICY "tenant_isolation_voter_photos_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'voter-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

-- RLS Policy: Users can update photos for voters in their tenant
CREATE POLICY "tenant_isolation_voter_photos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'voter-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

-- RLS Policy: Admin can delete photos
CREATE POLICY "admin_only_voter_photos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'voter-photos'
  AND EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- 2. FIELD WORKER PHOTOS BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'field-worker-photos',
  'field-worker-photos',
  false,
  3145728, -- 3MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies (same structure as voter-photos)
CREATE POLICY "tenant_isolation_field_worker_photos_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'field-worker-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "tenant_isolation_field_worker_photos_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'field-worker-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "tenant_isolation_field_worker_photos_update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'field-worker-photos'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "admin_only_field_worker_photos_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'field-worker-photos'
  AND EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- 3. REPORTS BUCKET (PDF/Excel/CSV)
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'reports',
  'reports',
  false,
  52428800, -- 50MB limit (for large Excel files)
  ARRAY[
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
CREATE POLICY "tenant_isolation_reports_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'reports'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "tenant_isolation_reports_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'reports'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "admin_only_reports_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'reports'
  AND EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- 4. SOCIAL MEDIA ARCHIVE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'social-media-archive',
  'social-media-archive',
  false,
  10485760, -- 10MB limit (screenshots, small videos)
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
CREATE POLICY "tenant_isolation_social_archive_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'social-media-archive'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "tenant_isolation_social_archive_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'social-media-archive'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "admin_only_social_archive_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'social-media-archive'
  AND EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- 5. COMPETITOR MEDIA BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'competitor-media',
  'competitor-media',
  false,
  20971520, -- 20MB limit (posters, videos)
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'video/mp4',
    'video/webm',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies
CREATE POLICY "tenant_isolation_competitor_media_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'competitor-media'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "tenant_isolation_competitor_media_select"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'competitor-media'
  AND (storage.foldername(name))[1] IN (
    SELECT tenant_id::text FROM user_tenants WHERE user_id = auth.uid()
  )
);

CREATE POLICY "admin_only_competitor_media_delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'competitor-media'
  AND EXISTS (
    SELECT 1 FROM user_tenants
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  )
);

-- =====================================================
-- STORAGE HELPER FUNCTIONS
-- =====================================================

-- Function: Get storage URL for voter photo
CREATE OR REPLACE FUNCTION get_voter_photo_url(voter_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  photo_path TEXT;
  bucket_url TEXT;
BEGIN
  SELECT photo_url INTO photo_path FROM voters WHERE id = voter_uuid;

  IF photo_path IS NULL THEN
    RETURN NULL;
  END IF;

  -- Return full Supabase Storage URL
  bucket_url := current_setting('app.supabase_url', true) || '/storage/v1/object/public/voter-photos/' || photo_path;
  RETURN bucket_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get storage URL for field worker avatar
CREATE OR REPLACE FUNCTION get_field_worker_avatar_url(worker_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  avatar_path TEXT;
  bucket_url TEXT;
BEGIN
  SELECT avatar_url INTO avatar_path FROM field_workers WHERE id = worker_uuid;

  IF avatar_path IS NULL THEN
    RETURN NULL;
  END IF;

  bucket_url := current_setting('app.supabase_url', true) || '/storage/v1/object/public/field-worker-photos/' || avatar_path;
  RETURN bucket_url;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STORAGE CLEANUP FUNCTION (for orphaned files)
-- =====================================================

-- Function: Delete orphaned files from storage (run via cron)
CREATE OR REPLACE FUNCTION cleanup_orphaned_storage_files()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Delete voter photos not referenced in voters table
  DELETE FROM storage.objects
  WHERE bucket_id = 'voter-photos'
    AND name NOT IN (SELECT photo_url FROM voters WHERE photo_url IS NOT NULL);

  GET DIAGNOSTICS deleted_count = ROW_COUNT;

  -- Delete field worker photos not referenced
  DELETE FROM storage.objects
  WHERE bucket_id = 'field-worker-photos'
    AND name NOT IN (SELECT avatar_url FROM field_workers WHERE avatar_url IS NOT NULL);

  GET DIAGNOSTICS deleted_count = deleted_count + ROW_COUNT;

  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ STORAGE BUCKETS CONFIGURED SUCCESSFULLY!';
  RAISE NOTICE '📸 5 buckets created: voter-photos, field-worker-photos, reports, social-media-archive, competitor-media';
  RAISE NOTICE '🔒 RLS policies applied to all storage buckets';
  RAISE NOTICE '📏 Size limits: Voter photos (5MB), Reports (50MB), Media (10-20MB)';
  RAISE NOTICE '🔐 Tenant isolation enforced on all uploads';
  RAISE NOTICE '🧹 Cleanup function ready: cleanup_orphaned_storage_files()';
END $$;
