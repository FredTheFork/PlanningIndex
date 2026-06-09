-- Add website pages columns to services_purchased table
-- This allows tracking which website pages were selected at checkout

ALTER TABLE public.services_purchased
ADD COLUMN IF NOT EXISTS website_pages_selected text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS website_page_count integer DEFAULT NULL;

-- Also add social_media_post_count for completeness (was previously only in metadata)
ALTER TABLE public.services_purchased
ADD COLUMN IF NOT EXISTS social_media_post_count integer DEFAULT NULL;