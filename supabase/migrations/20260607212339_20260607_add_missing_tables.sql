-- services_purchased: tracks which services a user has purchased
CREATE TABLE IF NOT EXISTS services_purchased (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  stripe_checkout_session_id text,
  stripe_price_id text,
  purchased_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services_purchased ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_services" ON services_purchased FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_services" ON services_purchased FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_services" ON services_purchased FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_services" ON services_purchased FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Admin can read all services_purchased
CREATE POLICY "admin_read_services" ON services_purchased FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE INDEX idx_services_purchased_user_id ON services_purchased(user_id);
CREATE INDEX idx_services_purchased_service_id ON services_purchased(service_id);

-- generated_documents: tracks document generation and delivery
CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  brief_id uuid,
  file_path text,
  file_name text,
  file_size bigint DEFAULT 0,
  file_type text DEFAULT '',
  delivered_to_client boolean DEFAULT false,
  delivered_at timestamptz,
  auto_delete_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_documents" ON generated_documents FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_documents" ON generated_documents FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_documents" ON generated_documents FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_documents" ON generated_documents FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "admin_all_documents" ON generated_documents FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE INDEX idx_generated_documents_user_id ON generated_documents(user_id);
CREATE INDEX idx_generated_documents_document_type ON generated_documents(document_type);

-- client_briefs: stores generated briefs for each client
CREATE TABLE IF NOT EXISTS client_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brief_text text NOT NULL DEFAULT '',
  service_id text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_briefs" ON client_briefs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_briefs" ON client_briefs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_briefs" ON client_briefs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_all_briefs" ON client_briefs FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE INDEX idx_client_briefs_user_id ON client_briefs(user_id);

-- client_messages: real-time messaging between admin and clients
CREATE TABLE IF NOT EXISTS client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type text NOT NULL DEFAULT 'client',
  content text NOT NULL DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_messages" ON client_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_messages" ON client_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_messages" ON client_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_all_messages" ON client_messages FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE INDEX idx_client_messages_user_id ON client_messages(user_id);

-- client_communication_preferences: stores client notification preferences
CREATE TABLE IF NOT EXISTS client_communication_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_updates boolean DEFAULT true,
  sms_updates boolean DEFAULT false,
  whatsapp_updates boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE client_communication_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_prefs" ON client_communication_preferences FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_prefs" ON client_communication_preferences FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_prefs" ON client_communication_preferences FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_all_prefs" ON client_communication_preferences FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

-- contact_messages: stores messages from the contact form
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_contacts" ON contact_messages FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );
CREATE POLICY "insert_contacts" ON contact_messages FOR INSERT
  TO authenticated WITH CHECK (true);

-- document_refresh_jobs: tracks quarterly document refresh jobs
CREATE TABLE IF NOT EXISTS document_refresh_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text,
  document_types text[] NOT NULL DEFAULT '{}',
  update_instructions text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE document_refresh_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_refresh_jobs" ON document_refresh_jobs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_refresh_jobs" ON document_refresh_jobs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_refresh_jobs" ON document_refresh_jobs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admin_all_refresh_jobs" ON document_refresh_jobs FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_users WHERE admin_users.user_id = auth.uid())
  );

CREATE INDEX idx_document_refresh_jobs_user_id ON document_refresh_jobs(user_id);
