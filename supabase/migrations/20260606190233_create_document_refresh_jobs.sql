CREATE TABLE document_refresh_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  document_types text[] NOT NULL,
  update_instructions text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  documents_completed text[] DEFAULT '{}',
  documents_failed text[] DEFAULT '{}',
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE document_refresh_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_own_refresh_jobs" ON document_refresh_jobs FOR SELECT
  TO authenticated USING (auth.uid() = client_id);
CREATE POLICY "insert_own_refresh_jobs" ON document_refresh_jobs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "update_own_refresh_jobs" ON document_refresh_jobs FOR UPDATE
  TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);
CREATE POLICY "delete_own_refresh_jobs" ON document_refresh_jobs FOR DELETE
  TO authenticated USING (auth.uid() = client_id);

CREATE INDEX idx_refresh_jobs_client_id ON document_refresh_jobs (client_id);
CREATE INDEX idx_refresh_jobs_status ON document_refresh_jobs (status);