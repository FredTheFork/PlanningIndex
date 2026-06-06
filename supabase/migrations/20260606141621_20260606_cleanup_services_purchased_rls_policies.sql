/*
  # Cleanup Duplicate RLS Policies on services_purchased

  1. Problem
    - Two overlapping migrations created duplicate SELECT, UPDATE, INSERT, and DELETE
      policies on services_purchased. This causes policy evaluation confusion and
      makes maintenance harder.
    - The "Service role can insert purchased services" policy uses is_admin() check,
      which doesn't work for webhook writes (webhook uses service_role key that bypasses
      RLS). The user-owned INSERT policy is also present but unnecessary since the
      webhook bypasses RLS entirely.

  2. Changes
    - Drop ALL existing policies on services_purchased
    - Recreate a clean, minimal set:
      - SELECT: users can view own + admins can view all
      - INSERT: users can insert own (for edge function with user JWT context)
      - UPDATE: users can update own + admins can update all
      - DELETE: users can delete own + admins can delete all
    - Note: The webhook uses SUPABASE_SERVICE_ROLE_KEY which bypasses all RLS,
      so INSERT/UPDATE policies are only needed for authenticated user access
      from the frontend.

  3. Security
    - No security weakening. The service role key bypasses RLS entirely,
      so these policies only govern authenticated frontend access.
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Users can view their own services purchased" ON services_purchased;
DROP POLICY IF EXISTS "Admins can view all purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Service role can insert purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Users can insert their own services purchased (via webhook only)" ON services_purchased;
DROP POLICY IF EXISTS "Users can update own purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Users can update their own services purchased" ON services_purchased;
DROP POLICY IF EXISTS "Admins can update all purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Users can delete own purchased services" ON services_purchased;
DROP POLICY IF EXISTS "Admins can delete all purchased services" ON services_purchased;

-- Recreate clean SELECT policies
CREATE POLICY "Users can view own purchased services"
  ON services_purchased FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all purchased services"
  ON services_purchased FOR SELECT
  TO authenticated
  USING (is_admin());

-- Recreate clean INSERT policy
CREATE POLICY "Users can insert own purchased services"
  ON services_purchased FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Recreate clean UPDATE policies
CREATE POLICY "Users can update own purchased services"
  ON services_purchased FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all purchased services"
  ON services_purchased FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Recreate clean DELETE policies
CREATE POLICY "Users can delete own purchased services"
  ON services_purchased FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete all purchased services"
  ON services_purchased FOR DELETE
  TO authenticated
  USING (is_admin());
