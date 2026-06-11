-- Social Media Platform Enhancement Migration
-- Adds TikTok/Pinterest support, image_dimensions, carousel_paths, selected_platforms

-- 1. Update platform CHECK constraint to include TikTok and Pinterest
ALTER TABLE social_media_posts
  DROP CONSTRAINT social_media_posts_platform_check;

ALTER TABLE social_media_posts
  ADD CONSTRAINT social_media_posts_platform_check
  CHECK (platform IN ('LinkedIn', 'Instagram', 'Facebook', 'X', 'TikTok', 'Pinterest'));

-- 2. Add image_dimensions column to social_media_posts
ALTER TABLE social_media_posts
  ADD COLUMN IF NOT EXISTS image_dimensions TEXT;

-- 3. Add carousel_paths column to social_media_posts (array of storage paths for Instagram carousels)
ALTER TABLE social_media_posts
  ADD COLUMN IF NOT EXISTS carousel_paths TEXT[] DEFAULT '{}';

-- 4. Add selected_platforms column to services_purchased
ALTER TABLE services_purchased
  ADD COLUMN IF NOT EXISTS selected_platforms TEXT[] DEFAULT '{}';

-- 5. Create storage bucket for carousel images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'social-media-carousels',
  'social-media-carousels',
  false,
  10485760, -- 10MB per carousel image
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 6. RLS policies for social-media-carousels bucket
-- Admins can manage all carousel images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'admins_manage_carousel_images'
  ) THEN
    CREATE POLICY "admins_manage_carousel_images" ON storage.objects
      FOR ALL TO authenticated
      USING (
        bucket_id = 'social-media-carousels'
        AND EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
      )
      WITH CHECK (
        bucket_id = 'social-media-carousels'
        AND EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
      );
  END IF;
END $$;

-- Users can read their own carousel images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'users_read_own_carousel_images'
  ) THEN
    CREATE POLICY "users_read_own_carousel_images" ON storage.objects
      FOR SELECT TO authenticated
      USING (
        bucket_id = 'social-media-carousels'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

-- 7. Add index for carousel_paths queries
CREATE INDEX IF NOT EXISTS idx_social_media_posts_carousel_paths
  ON social_media_posts USING GIN (carousel_paths);

-- 8. Add index for selected_platforms queries
CREATE INDEX IF NOT EXISTS idx_services_purchased_selected_platforms
  ON services_purchased USING GIN (selected_platforms);