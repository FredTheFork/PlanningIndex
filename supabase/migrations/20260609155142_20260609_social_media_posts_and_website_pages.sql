-- Social Media Posts table
-- Stores individual social media posts for clients who purchased social_media_pack
CREATE TABLE IF NOT EXISTS social_media_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_number INTEGER NOT NULL CHECK (post_number >= 1 AND post_number <= 30),
  category TEXT NOT NULL CHECK (category IN ('educational', 'promotional', 'personal')),
  caption TEXT NOT NULL,
  hashtags TEXT,
  image_prompt TEXT,
  platform TEXT NOT NULL DEFAULT 'LinkedIn' CHECK (platform IN ('LinkedIn', 'Instagram', 'Facebook', 'X')),
  week INTEGER NOT NULL CHECK (week >= 1 AND week <= 6),
  day TEXT NOT NULL CHECK (day IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri')),
  image_path TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'edited', 'delivered')),
  delivered_to_client BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, post_number)
);

-- Website Page Contents table
-- Stores structured website copy for each page type
CREATE TABLE IF NOT EXISTS website_page_contents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('homepage', 'about', 'services', 'contact')),
  content_json JSONB NOT NULL DEFAULT '{}',
  tsx_code TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generated', 'edited', 'delivered')),
  delivered_to_client BOOLEAN DEFAULT FALSE,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, page_type)
);

-- Enable RLS
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_page_contents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_media_posts
-- Admins can do everything
CREATE POLICY "admin_all_social_media_posts" ON social_media_posts
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Users can read only their own delivered posts
CREATE POLICY "users_read_own_delivered_posts" ON social_media_posts
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() AND delivered_to_client = TRUE
  );

-- RLS Policies for website_page_contents
-- Admins can do everything
CREATE POLICY "admin_all_website_pages" ON website_page_contents
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );

-- Users can read only their own delivered pages
CREATE POLICY "users_read_own_delivered_pages" ON website_page_contents
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() AND delivered_to_client = TRUE
  );

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_social_media_posts_updated_at
  BEFORE UPDATE ON social_media_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_website_page_contents_updated_at
  BEFORE UPDATE ON website_page_contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for social media images
INSERT INTO storage.buckets (id, name, public)
VALUES ('social-media-images', 'social-media-images', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for social-media-images bucket
CREATE POLICY "admin_full_access_social_media_images" ON storage.objects
  FOR ALL TO authenticated
  USING (
    bucket_id = 'social-media-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  )
  WITH CHECK (
    bucket_id = 'social-media-images' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

CREATE POLICY "users_read_own_social_media_images" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'social-media-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create indexes for performance
CREATE INDEX idx_social_media_posts_user_id ON social_media_posts(user_id);
CREATE INDEX idx_social_media_posts_status ON social_media_posts(status);
CREATE INDEX idx_website_page_contents_user_id ON website_page_contents(user_id);
CREATE INDEX idx_website_page_contents_page_type ON website_page_contents(page_type);