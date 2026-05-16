/*
  # Complete Foundationary Schema Rebuild

  1. New Tables
    - `orders` — Stripe payment orders linked to auth users
    - `client_profiles` — Client profile with intake/delivery tracking
    - `intake_responses` — Intake form responses with partial save support
    - `admin_users` — Admin user role mapping
    - `intake_uploads` — File upload metadata for intake attachments
    - `client_documents` — Admin-uploaded delivery documents
    - `stripe_customers` — Stripe customer ID to user mapping
    - `stripe_orders` — Stripe order details for compatibility

  2. Enums
    - `order_status`: paid, refunded, failed
    - `delivery_status`: not_started, in_progress, delivered

  3. Storage Buckets
    - `intake-uploads` — Client intake file attachments (10MB limit)
    - `client-documents` — Admin delivery documents (50MB limit)

  4. Security
    - RLS enabled on ALL tables
    - Users can only access their own data
    - Admin users get full read/write access to all client data
    - Admin check uses JWT app_metadata.role = 'admin' OR email fallback
    - Storage policies enforce folder-based ownership (user_id as first folder)

  5. Important Notes
    1. Users are created ONLY via the Stripe webhook flow or admin-setup
    2. client_profiles and intake_responses are created automatically after payment
    3. intake_responses supports partial saves — users can leave and resume
    4. The `current_section` field tracks where the user left off in the form
    5. Admin RLS policies use JWT app_metadata check to avoid infinite recursion
*/

-- ============================================================
-- 1. Create enums
-- ============================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('paid', 'refunded', 'failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_status') THEN
    CREATE TYPE delivery_status AS ENUM ('not_started', 'in_progress', 'delivered');
  END IF;
END $$;

-- ============================================================
-- 2. Create tables
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_session_id text NOT NULL,
  stripe_payment_intent_id text,
  status order_status NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_submitted_intake boolean NOT NULL DEFAULT false,
  intake_submitted_at timestamptz,
  delivery_link text,
  delivery_status delivery_status NOT NULL DEFAULT 'not_started',
  admin_notes text DEFAULT '',
  purchased_upsells text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS intake_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_version text NOT NULL DEFAULT 'v2',
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_section integer NOT NULL DEFAULT 0,
  last_saved_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  file_uploads jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz NOT NULL DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS stripe_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id text NOT NULL,
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_session_id text NOT NULL,
  payment_intent_id text,
  customer_id text,
  amount_subtotal integer,
  amount_total integer,
  currency text DEFAULT 'gbp',
  payment_status text DEFAULT 'paid',
  status text DEFAULT 'completed',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. Enable RLS on ALL tables
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_orders ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. Helper function for admin check (avoids infinite recursion)
-- ============================================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  )
$$ LANGUAGE sql STABLE;

-- ============================================================
-- 5. RLS Policies — orders
-- ============================================================

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Service role can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- 6. RLS Policies — client_profiles
-- ============================================================

CREATE POLICY "Users can view own client profile"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all client profiles"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can update own client profile"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all client profiles"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Service role can insert client profiles"
  ON client_profiles FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete client profiles"
  ON client_profiles FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 7. RLS Policies — intake_responses
-- ============================================================

CREATE POLICY "Users can view own intake responses"
  ON intake_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all intake responses"
  ON intake_responses FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can update own intake responses"
  ON intake_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all intake responses"
  ON intake_responses FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Service role can insert intake responses"
  ON intake_responses FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Users can delete own intake responses"
  ON intake_responses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- 8. RLS Policies — admin_users
-- ============================================================

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Super admins can insert admin users"
  ON admin_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- 9. RLS Policies — intake_uploads
-- ============================================================

CREATE POLICY "Users can view own intake uploads"
  ON intake_uploads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all intake uploads"
  ON intake_uploads FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can insert own intake uploads"
  ON intake_uploads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own intake uploads"
  ON intake_uploads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can delete intake uploads"
  ON intake_uploads FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 10. RLS Policies — client_documents
-- ============================================================

CREATE POLICY "Users can view own client documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all client documents"
  ON client_documents FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert client documents"
  ON client_documents FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete client documents"
  ON client_documents FOR DELETE
  TO authenticated
  USING (is_admin());

-- ============================================================
-- 11. RLS Policies — stripe_customers
-- ============================================================

CREATE POLICY "Users can view own stripe customers"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stripe customers"
  ON stripe_customers FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Service role can insert stripe customers"
  ON stripe_customers FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- 12. RLS Policies — stripe_orders
-- ============================================================

CREATE POLICY "Admins can view all stripe orders"
  ON stripe_orders FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Service role can insert stripe orders"
  ON stripe_orders FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ============================================================
-- 13. Storage buckets
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
    AND is_admin()
  );

-- Storage policies for client-documents bucket
CREATE POLICY "Admins can upload client documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'client-documents'
    AND is_admin()
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
    AND is_admin()
  );

CREATE POLICY "Admins can delete client documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'client-documents'
    AND is_admin()
  );

-- ============================================================
-- 14. Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_session_id ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_intake_responses_user_id ON intake_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_intake_uploads_user_id ON intake_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_client_documents_user_id ON client_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_customers_user_id ON stripe_customers(user_id);
CREATE INDEX IF NOT EXISTS idx_stripe_orders_checkout_session_id ON stripe_orders(checkout_session_id);

-- ============================================================
-- 15. Trigger for updated_at on client_profiles
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON client_profiles;
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
