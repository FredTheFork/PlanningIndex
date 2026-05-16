/*
  # Add missing RLS policies for admin setup and client profiles

  1. Changes to `admin_users`
    - Add INSERT policy so edge functions can create admin records
    - Add admin-wide SELECT policy so admins can view all admin records

  2. Changes to `client_profiles`
    - Add INSERT policy so users/edge functions can create client profiles
*/

-- ── admin_users: INSERT policy ──
CREATE POLICY "Authenticated users can insert admin records"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ── admin_users: Admin-wide SELECT policy ──
CREATE POLICY "Admins can view all admin records"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'foundationarybusiness@gmail.com'
  );

-- ── client_profiles: INSERT policy ──
CREATE POLICY "Users can insert own client profile"
  ON client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
