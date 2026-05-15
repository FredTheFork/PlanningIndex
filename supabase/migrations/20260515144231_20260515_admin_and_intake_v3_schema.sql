/*
  # Admin System and Enhanced Intake Form Schema

  1. New Tables
    - `admin_users` — Maps Supabase auth users to admin role
    - `intake_uploads` — Stores file upload metadata for intake form attachments
    - `client_documents` — Stores admin-uploaded delivery documents for clients

  2. Modified Tables
    - `intake_responses` — Add `submitted_at` column, add `file_uploads` jsonb column
    - `client_profiles` — Add `admin_notes` column, add `purchased_upsells` text[] column

  3. Security
    - Enable RLS on all new tables
    - Admin-only policies for full access to all client data
    - Users can only access their own data
    - Admin users table is locked down

  4. Important Notes
    - Admin account will be created via Supabase auth
    - The admin_users table uses a simple role check
    - File uploads are stored in Supabase Storage buckets
*/

-- ============================================================
-- 1. Admin users table
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Service role can manage admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.role = 'super_admin')
  );

-- ============================================================
-- 2. Intake uploads table
-- ============================================================

CREATE TABLE IF NOT EXISTS intake_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id text NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  file_type text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE intake_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own intake uploads"
  ON intake_uploads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own intake uploads"
  ON intake_uploads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own intake uploads"
  ON intake_uploads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all intake uploads"
  ON intake_uploads FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- ============================================================
-- 3. Client documents table
-- ============================================================

CREATE TABLE IF NOT EXISTS client_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  file_type text NOT NULL DEFAULT '',
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own client documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all client documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can insert client documents"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete client documents"
  ON client_documents FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- ============================================================
-- 4. Add columns to existing tables
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intake_responses' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN submitted_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intake_responses' AND column_name = 'file_uploads'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN file_uploads jsonb DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_profiles' AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE client_profiles ADD COLUMN admin_notes text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'client_profiles' AND column_name = 'purchased_upsells'
  ) THEN
    ALTER TABLE client_profiles ADD COLUMN purchased_upsells text[] DEFAULT '{}';
  END IF;
END $$;

-- ============================================================
-- 5. Admin RLS policies for existing tables
-- ============================================================

CREATE POLICY "Admins can view all client profiles"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update all client profiles"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all intake responses"
  ON intake_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can update all intake responses"
  ON intake_responses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all stripe customers"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can view all stripe orders"
  ON stripe_orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- ============================================================
-- 6. Create storage buckets for file uploads
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('intake-uploads', 'intake-uploads', false, 10485760)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('client-documents', 'client-documents', false, 52428800)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for intake-uploads bucket
CREATE POLICY "Users can upload own intake files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'intake-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own intake files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'intake-uploads'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all intake files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'intake-uploads'
    AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- Storage policies for client-documents bucket
CREATE POLICY "Admins can upload client documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Users can view own client documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can view all client documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE POLICY "Admins can delete client documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- ============================================================
-- 7. Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_intake_uploads_user_id ON intake_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
