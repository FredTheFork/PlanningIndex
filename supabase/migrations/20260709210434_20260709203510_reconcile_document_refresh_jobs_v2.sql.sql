/*
# Complete document_refresh_jobs Schema Reconciliation

Completes the schema changes for document_refresh_jobs table.
Skips the realtime publication step since it's already added.
*/

-- Step 1: Rename user_id to client_id if not already done
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_refresh_jobs' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE document_refresh_jobs RENAME COLUMN user_id TO client_id;
  END IF;
END $$;

-- Step 2: Rename documents_to_refresh to document_types if not already done
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'document_refresh_jobs' AND column_name = 'documents_to_refresh'
  ) THEN
    ALTER TABLE document_refresh_jobs RENAME COLUMN documents_to_refresh TO document_types;
  END IF;
END $$;

-- Step 3: Add update_instructions column if not exists
ALTER TABLE document_refresh_jobs 
  ADD COLUMN IF NOT EXISTS update_instructions text NOT NULL DEFAULT 'Legacy refresh job - no instructions recorded';

-- Step 4: Add documents_completed and documents_failed columns
ALTER TABLE document_refresh_jobs 
  ADD COLUMN IF NOT EXISTS documents_completed text[] DEFAULT '{}';

ALTER TABLE document_refresh_jobs 
  ADD COLUMN IF NOT EXISTS documents_failed text[] DEFAULT '{}';

-- Step 5: Make document_types NOT NULL if not already
ALTER TABLE document_refresh_jobs ALTER COLUMN document_types SET NOT NULL;

-- Step 6: Update RLS policies to use client_id
DROP POLICY IF EXISTS "admins_manage_refresh_jobs" ON document_refresh_jobs;
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

DROP POLICY IF EXISTS "clients_select_own_refresh_jobs" ON document_refresh_jobs;
CREATE POLICY "clients_select_own_refresh_jobs"
  ON document_refresh_jobs
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

-- Step 7: Add indexes
CREATE INDEX IF NOT EXISTS idx_refresh_jobs_client_id ON document_refresh_jobs (client_id);
CREATE INDEX IF NOT EXISTS idx_refresh_jobs_subscription_id ON document_refresh_jobs (subscription_id);

-- Step 8: ensure updated_at trigger exists
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