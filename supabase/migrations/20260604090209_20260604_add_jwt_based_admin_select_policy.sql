/*
  # Add JWT-based SELECT policy for admin realtime access

  1. Purpose
    - The existing "Admins can view all messages" policy uses a subquery:
      EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
    - This works for REST API queries but Supabase's realtime engine may not
      reliably evaluate RLS policies that contain subqueries to other tables
      when deciding whether to broadcast a row change to a connected client.
    - Adding a direct JWT-claim-based policy avoids the subquery and is
      known to work reliably with Supabase realtime.

  2. New Policy
    - "Admins can view all messages via JWT" on client_messages
    - SELECT for authenticated users where auth.jwt()->>'role' = 'admin'
    - This mirrors the existing "Admins can view all messages" policy but
      uses JWT claims instead of a subquery to admin_users

  3. Security
    - No security weakening: the same condition is checked (user is admin),
      just via a different mechanism (JWT app_metadata.role vs admin_users table)
    - The admin's role claim is set in raw_app_meta_data and cannot be modified
      by the user, making it secure for authorization checks
*/

CREATE POLICY "Admins can view all messages via JWT"
  ON client_messages
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
