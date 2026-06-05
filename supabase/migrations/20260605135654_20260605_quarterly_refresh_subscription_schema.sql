-- ─────────────────────────────────────────────────────────────────────────────
-- QUARTERLY REFRESH: Subscription tracking + refresh job management
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add subscription billing columns to services_purchased
ALTER TABLE services_purchased
  ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_period_start timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;

-- 2. Widen the status CHECK constraint to allow 'past_due'
--    (drop the existing inline check and replace it)
ALTER TABLE services_purchased
  DROP CONSTRAINT IF EXISTS services_purchased_status_check;

ALTER TABLE services_purchased
  ADD CONSTRAINT services_purchased_status_check
  CHECK (status = ANY (ARRAY['active','cancelled','expired','past_due']));

-- 3. Create document_refresh_jobs table
CREATE TABLE IF NOT EXISTS document_refresh_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text,
  service_id text NOT NULL DEFAULT 'quarterly_refresh',
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','in_progress','completed','failed','cancelled')),
  documents_to_refresh text[] DEFAULT '{}',
  client_notes text,
  admin_notes text,
  admin_id uuid REFERENCES auth.users(id),
  requested_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE document_refresh_jobs ENABLE ROW LEVEL SECURITY;

-- 5. Admins can do everything (JWT app_metadata role OR email fallback)
CREATE POLICY "admins_manage_refresh_jobs"
  ON document_refresh_jobs
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  )
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR auth.jwt() ->> 'email' = 'foundationarybusiness@gmail.com'
  );

-- 6. Clients can view their own refresh jobs
CREATE POLICY "clients_select_own_refresh_jobs"
  ON document_refresh_jobs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- 7. Performance indexes
CREATE INDEX IF NOT EXISTS idx_document_refresh_jobs_user_id
  ON document_refresh_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_document_refresh_jobs_status
  ON document_refresh_jobs(status);

-- 8. updated_at auto-update trigger
CREATE OR REPLACE FUNCTION update_document_refresh_jobs_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_document_refresh_jobs_updated_at ON document_refresh_jobs;
CREATE TRIGGER trg_document_refresh_jobs_updated_at
  BEFORE UPDATE ON document_refresh_jobs
  FOR EACH ROW EXECUTE FUNCTION update_document_refresh_jobs_updated_at();

-- 9. Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE document_refresh_jobs;
