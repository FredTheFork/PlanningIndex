-- Fix website_deliveries RLS policies for admin insert/update
-- The previous policy was querying auth.users which causes permission denied

-- Drop the problematic admin policy
DROP POLICY IF EXISTS admins_full_access_website_deliveries ON website_deliveries;

-- Create new admin policy using JWT claims directly (no auth.users query)
CREATE POLICY admins_full_access_website_deliveries ON website_deliveries
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'app_role' = 'admin' OR auth.jwt() ->> 'app_role' = 'super_admin')
  )
  WITH CHECK (
    (auth.jwt() ->> 'app_role' = 'admin' OR auth.jwt() ->> 'app_role' = 'super_admin')
  );

-- Ensure RLS is enabled
ALTER TABLE website_deliveries ENABLE ROW LEVEL SECURITY;