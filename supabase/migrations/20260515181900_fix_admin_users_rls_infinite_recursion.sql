/*
  # Fix infinite recursion in admin_users RLS policy

  1. Problem
    - The SELECT policy on `admin_users` references `admin_users` in its USING clause,
      creating infinite recursion: to check if you can read admin_users, the policy
      queries admin_users, which triggers the same policy, which queries admin_users, etc.
    - This breaks ALL admin access because every other table's RLS policies
      (client_profiles, intake_responses, etc.) also check `admin_users` via EXISTS subqueries.

  2. Fix
    - Drop the recursive SELECT policy on `admin_users`
    - Replace with a simple policy: a user can read their own row in `admin_users`
      (WHERE user_id = auth.uid())
    - This breaks the cycle: the admin_users check no longer self-references
    - All other tables' policies that do `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`
      will now work because the admin_users SELECT policy is non-recursive

  3. Security
    - A user can only see their own admin_users row (if they have one)
    - This is sufficient for the useIsAdmin hook and all downstream RLS checks
    - The INSERT policy is also fixed to not self-reference
*/

-- Drop the recursive SELECT policy
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;

-- Drop the recursive INSERT policy
DROP POLICY IF EXISTS "Service role can manage admin users" ON admin_users;

-- New SELECT policy: users can read their own admin record
-- This is non-recursive and sufficient for all admin checks
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- New INSERT policy: only service role can insert (handled via edge functions with service_role key)
-- We use a restrictive policy that only allows the service role
CREATE POLICY "Service role can insert admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Also add a policy for the service role to do everything
-- This uses the anon role with service_role key bypassing RLS, but let's be explicit
CREATE POLICY "Service role can manage admin records"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);
