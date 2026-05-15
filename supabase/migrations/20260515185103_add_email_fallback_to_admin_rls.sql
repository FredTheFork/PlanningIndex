/*
  # Add email-based fallback to admin RLS policies

  1. Problem
    - JWT app_metadata doesn't have the admin role yet (edge functions not propagating)
    - RLS policies that only check JWT app_metadata will block admin access

  2. Fix
    - Update all admin RLS policies to also check the user's email
    - This provides a reliable fallback until the JWT app_metadata can be set
    - Uses auth.jwt() -> 'email' which IS available in the JWT
*/

-- ============================================
-- client_profiles
-- ============================================

DROP POLICY IF EXISTS "Admins can view all client profiles" ON client_profiles;
DROP POLICY IF EXISTS "Admins can update all client profiles" ON client_profiles;

CREATE POLICY "Admins can view all client profiles"
  ON client_profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

CREATE POLICY "Admins can update all client profiles"
  ON client_profiles
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

-- ============================================
-- intake_responses
-- ============================================

DROP POLICY IF EXISTS "Admins can view all intake responses" ON intake_responses;
DROP POLICY IF EXISTS "Admins can update all intake responses" ON intake_responses;

CREATE POLICY "Admins can view all intake responses"
  ON intake_responses
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

CREATE POLICY "Admins can update all intake responses"
  ON intake_responses
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

-- ============================================
-- intake_uploads
-- ============================================

DROP POLICY IF EXISTS "Admins can view all intake uploads" ON intake_uploads;

CREATE POLICY "Admins can view all intake uploads"
  ON intake_uploads
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

-- ============================================
-- client_documents
-- ============================================

DROP POLICY IF EXISTS "Admins can view all client documents" ON client_documents;
DROP POLICY IF EXISTS "Admins can insert client documents" ON client_documents;
DROP POLICY IF EXISTS "Admins can update client documents" ON client_documents;
DROP POLICY IF EXISTS "Admins can delete client documents" ON client_documents;

CREATE POLICY "Admins can view all client documents"
  ON client_documents
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

CREATE POLICY "Admins can insert client documents"
  ON client_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

CREATE POLICY "Admins can update client documents"
  ON client_documents
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

CREATE POLICY "Admins can delete client documents"
  ON client_documents
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

-- ============================================
-- Storage policies
-- ============================================

DROP POLICY IF EXISTS "Admins can view all intake files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload client documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all client documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete client documents" ON storage.objects;

CREATE POLICY "Admins can view all intake files"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    (bucket_id = 'intake-uploads') AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
    )
  );

CREATE POLICY "Admins can upload client documents"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (bucket_id = 'client-documents') AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
    )
  );

CREATE POLICY "Admins can view all client documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    (bucket_id = 'client-documents') AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
    )
  );

CREATE POLICY "Admins can delete client documents"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    (bucket_id = 'client-documents') AND (
      (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
    )
  );
