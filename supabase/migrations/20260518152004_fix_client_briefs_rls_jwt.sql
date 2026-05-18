/*
  # Fix client_briefs RLS policies to avoid auth.users join

  1. Problem
    - All 4 existing RLS policies on client_briefs join against auth.users
      to check the admin role, which causes "permission denied for table users"
      errors for non-service-role clients.

  2. Changes
    - Drop all 4 existing policies on client_briefs
    - Recreate them using auth.jwt() ->> 'role' = 'admin' instead of
      joining auth.users, which avoids the permission error entirely.

  3. Security
    - Policies remain restrictive: only authenticated users with
      app_metadata.role = 'admin' can read, insert, update, or delete.
    - The JWT-based check is secure because app_metadata can only be
      set by the service role, not by the user.
*/

-- Drop existing policies that join auth.users
DROP POLICY IF EXISTS "Admins can read client briefs" ON client_briefs;
DROP POLICY IF EXISTS "Admins can insert client briefs" ON client_briefs;
DROP POLICY IF EXISTS "Admins can update client briefs" ON client_briefs;
DROP POLICY IF EXISTS "Admins can delete client briefs" ON client_briefs;

-- Recreate using JWT check (no auth.users join needed)
CREATE POLICY "Admins can read client briefs"
  ON client_briefs FOR SELECT
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can insert client briefs"
  ON client_briefs FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can update client briefs"
  ON client_briefs FOR UPDATE
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

CREATE POLICY "Admins can delete client briefs"
  ON client_briefs FOR DELETE
  TO authenticated
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');
