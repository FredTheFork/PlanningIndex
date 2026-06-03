/*
  # Allow authenticated users to read admin_users

  1. Changes
    - Add new RLS policy on admin_users table to allow any authenticated user to read it
    - Clients need to query this table to get the admin's user_id for starting conversations
    - The table only contains user IDs, not sensitive information

  2. Security
    - Policy is restrictive: only authenticated users can read
    - Only allows SELECT, no write access for non-admins
    - Existing admin-only policies remain unchanged
*/

CREATE POLICY "Authenticated users can read admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (true);
