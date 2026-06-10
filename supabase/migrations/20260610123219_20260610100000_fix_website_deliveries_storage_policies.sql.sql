-- Update website-deliveries storage policies to use admin_users table check
-- This ensures consistency with other bucket policies and handles JWT fallback

-- Drop existing policies that use JWT claims
DROP POLICY IF EXISTS admins_read_all_website_deliveries ON storage.objects;
DROP POLICY IF EXISTS admins_upload_website_deliveries ON storage.objects;
DROP POLICY IF EXISTS admins_delete_website_deliveries ON storage.objects;

-- Create new policies using admin_users table check (consistent with other buckets)

-- Admins can read all website deliveries
CREATE POLICY "admins_read_all_website_deliveries" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'website-deliveries' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Admins can upload website deliveries
CREATE POLICY "admins_upload_website_deliveries" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'website-deliveries' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Admins can delete website deliveries  
CREATE POLICY "admins_delete_website_deliveries" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'website-deliveries' AND
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Client policy remains unchanged (they can read their own folder)
-- This one was already correct:
-- CREATE POLICY "clients_read_own_website_deliveries" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (
--     bucket_id = 'website-deliveries' AND
--     (storage.foldername(name))[1] = auth.uid()::text
--   );