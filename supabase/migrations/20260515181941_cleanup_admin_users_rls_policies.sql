/*
  # Clean up admin_users RLS policies

  1. Changes
    - Remove the overly restrictive "Service role can manage admin records" FOR ALL policy
      which blocks UPDATE/DELETE even for legitimate use cases
    - Remove the INSERT policy that blocks all inserts (service role bypasses RLS anyway)
    - Keep only the SELECT policy: users can read their own admin record
    - Add UPDATE/DELETE policies: users can update/delete their own admin record
      (though in practice only service role edge functions manage this table)

  2. Security
    - SELECT: user can only see their own row (user_id = auth.uid())
    - UPDATE/DELETE: user can only modify their own row
    - INSERT: handled by service role edge functions (bypasses RLS)
*/

DROP POLICY IF EXISTS "Service role can manage admin records" ON admin_users;
DROP POLICY IF EXISTS "Service role can insert admin users" ON admin_users;

CREATE POLICY "Users can update own admin record"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own admin record"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
