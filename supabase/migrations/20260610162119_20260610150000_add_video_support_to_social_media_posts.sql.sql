-- Add video support to social_media_posts
-- Allows individual posts to support text, image, or video content

ALTER TABLE social_media_posts
  ADD COLUMN IF NOT EXISTS video_path TEXT,
  ADD COLUMN IF NOT EXISTS post_type TEXT DEFAULT 'text' CHECK (post_type IN ('text', 'image', 'video'));

-- Create storage bucket for social media videos if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'social-media-videos',
  'social-media-videos',
  false,
  52428800, -- 50MB limit for videos
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/avi']
)
ON CONFLICT (id) DO NOTHING;

-- Add RLS policies for social-media-videos bucket
DO $$
BEGIN
  -- authenticated users can upload videos for their own posts
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'authenticated users can upload social media videos'
  ) THEN
    CREATE POLICY "authenticated users can upload social media videos" ON storage.objects
      FOR INSERT TO authenticated
      WITH CHECK (bucket_id = 'social-media-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
  END IF;
END $$;

-- Allow admins to manage all social media videos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'admins can manage social media videos'
  ) THEN
    CREATE POLICY "admins can manage social media videos" ON storage.objects
      FOR ALL TO authenticated
      USING (
        bucket_id = 'social-media-videos'
        AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      );
  END IF;
END $$;
