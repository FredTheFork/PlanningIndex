-- Create client_briefs table with service_id support from the start
-- Supports multiple briefs per client (one per service + one comprehensive)

CREATE TABLE IF NOT EXISTS client_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  service_id text,
  brief_content text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  risk_level text CHECK (risk_level IN ('Low', 'Medium', 'High')),
  error_message text,
  model_used text,
  generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- One brief per (client_id, service_id) combination; NULL service_id = comprehensive brief
CREATE UNIQUE INDEX IF NOT EXISTS client_briefs_client_service_uniq
  ON client_briefs (client_id, COALESCE(service_id, ''));

CREATE INDEX IF NOT EXISTS idx_client_briefs_client_id ON client_briefs(client_id);

ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;

-- Admin-only read access
CREATE POLICY "Admins can read client briefs"
  ON client_briefs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only insert
CREATE POLICY "Admins can insert client briefs"
  ON client_briefs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only update
CREATE POLICY "Admins can update client briefs"
  ON client_briefs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only delete
CREATE POLICY "Admins can delete client briefs"
  ON client_briefs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Create generated_documents table with file path columns from the start
CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_label text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  content_text text,
  content_html text,
  api_key_used text,
  model_used text,
  error_message text,
  generated_at timestamptz,
  files_generated_at timestamptz,
  pdf_path text,
  docx_path text,
  admin_edited boolean NOT NULL DEFAULT false,
  admin_edited_at timestamptz,
  delivered_to_client boolean NOT NULL DEFAULT false,
  delivered_at timestamptz,
  auto_delete_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, document_type)
);

ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Admin users can do everything with generated documents
CREATE POLICY "Admins can manage all generated documents"
  ON generated_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Clients can read their own delivered documents that haven't auto-deleted
CREATE POLICY "Clients can read own delivered documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid()
    AND delivered_to_client = true
    AND (auto_delete_at IS NULL OR auto_delete_at > now())
  );

CREATE INDEX IF NOT EXISTS idx_generated_documents_client ON generated_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);

-- Add missing columns to intake_responses if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'intake_responses' AND column_name = 'purchased_service_ids'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN purchased_service_ids text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'intake_responses' AND column_name = 'form_section_completions'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN form_section_completions jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'intake_responses' AND column_name = 'intake_complete_for_services'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN intake_complete_for_services text[] DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'intake_responses' AND column_name = 'additional_notes'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN additional_notes jsonb DEFAULT '{}';
  END IF;
END $$;

-- Add missing columns to client_profiles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'client_profiles' AND column_name = 'intake_complete_for_services'
  ) THEN
    ALTER TABLE client_profiles ADD COLUMN intake_complete_for_services text[] DEFAULT '{}';
  END IF;
END $$;

-- Create services_purchased table if it doesn't exist
CREATE TABLE IF NOT EXISTS services_purchased (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  stripe_checkout_session_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'past_due')),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  next_billing_date timestamptz,
  subscription_period_start timestamptz,
  subscription_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services_purchased ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchased services
CREATE POLICY "Users can read own purchased services"
  ON services_purchased FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins can read all purchased services
CREATE POLICY "Admins can read all purchased services"
  ON services_purchased FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can insert purchased services
CREATE POLICY "Admins can insert purchased services"
  ON services_purchased FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admins can update purchased services
CREATE POLICY "Admins can update purchased services"
  ON services_purchased FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_services_purchased_user_id ON services_purchased(user_id);
CREATE INDEX IF NOT EXISTS idx_services_purchased_service_id ON services_purchased(service_id);