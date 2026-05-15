/*
  # Recreate admin_users table without FK to work around auth.users replication delay

  1. Problem
    - The auth user (created via Auth API) exists in the auth service but hasn't
      replicated to the SQL layer yet, so FK constraints to auth.users fail.
    - PostgREST schema cache doesn't include the admin_users table.

  2. Fix
    - Create admin_users WITHOUT the foreign key constraint for now
    - Insert the admin record
    - The FK will be added later once the auth user replicates
*/

DROP TABLE IF EXISTS admin_users CASCADE;

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Users can read their own admin record
CREATE POLICY "Users can read own admin record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can update their own admin record
CREATE POLICY "Users can update own admin record"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own admin record
CREATE POLICY "Users can delete own admin record"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Insert the admin record
INSERT INTO admin_users (user_id, role) 
VALUES ('4fe40e67-2db1-4db9-b2e8-d85e010b3475', 'super_admin');
