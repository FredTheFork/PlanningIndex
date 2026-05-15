/*
  # Switch admin RLS policies from admin_users table to JWT app_metadata

  1. Problem
    - The admin_users table has a PostgREST schema cache issue (PGRST205)
      making it inaccessible via the REST API
    - RLS policies that reference admin_users cause infinite recursion or
      fail silently when the table is not in the schema cache

  2. Fix
    - Replace all RLS policies that check admin_users with JWT-based checks
    - Use auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' instead
    - This is more reliable, faster (no subquery), and avoids the schema cache issue
    - The admin role is set in auth.users.raw_app_meta_data via the Auth admin API

  3. Tables affected
    - client_profiles: SELECT, UPDATE admin policies
    - intake_responses: SELECT, UPDATE admin policies
    - intake_uploads: SELECT admin policy
    - client_documents: needs admin policies added
*/

-- ============================================
-- client_profiles
-- ============================================

-- Drop old admin policies
DROP POLICY IF EXISTS "Admins can view all client profiles" ON client_profiles;
DROP POLICY IF EXISTS "Admins can update all client profiles" ON client_profiles;

-- New admin policies using JWT
CREATE POLICY "Admins can view all client profiles"
  ON client_profiles
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update all client profiles"
  ON client_profiles
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- intake_responses
-- ============================================

DROP POLICY IF EXISTS "Admins can view all intake responses" ON intake_responses;
DROP POLICY IF EXISTS "Admins can update all intake responses" ON intake_responses;

CREATE POLICY "Admins can view all intake responses"
  ON intake_responses
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update all intake responses"
  ON intake_responses
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- intake_uploads
-- ============================================

DROP POLICY IF EXISTS "Admins can view all intake uploads" ON intake_uploads;

CREATE POLICY "Admins can view all intake uploads"
  ON intake_uploads
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- client_documents
-- ============================================

-- Add admin policies for client_documents
CREATE POLICY "Admins can view all client documents"
  ON client_documents
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can insert client documents"
  ON client_documents
  FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can update client documents"
  ON client_documents
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins can delete client documents"
  ON client_documents
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ============================================
-- Storage policies
-- ============================================

-- Drop old admin storage policies that reference admin_users
DROP POLICY IF EXISTS "Admins can view all intake files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all client documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete client documents" ON storage.objects;

-- New admin storage policies using JWT
CREATE POLICY "Admins can view all intake files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING ((bucket_id = 'intake-uploads') AND ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "Admins can upload client documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK ((bucket_id = 'client-documents') AND ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "Admins can view all client documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING ((bucket_id = 'client-documents') AND ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));

CREATE POLICY "Admins can delete client documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING ((bucket_id = 'client-documents') AND ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'));
