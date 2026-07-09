/*
# Reconcile document_refresh_jobs Schema

This migration reconciles two conflicting earlier migrations that both created
the `document_refresh_jobs` table with different schemas. The unified schema
combines the best of both versions to support the full subscription refresh workflow.

## Changes

### 1. Drops Existing Table (if exists)
The previous migrations created conflicting table structures. This drops any
existing `document_refresh_jobs` table and recreates it with the correct schema.

### 2. Creates Unified `document_refresh_jobs` Table
Columns:
- `id` (uuid, primary key, auto-generated)
- `client_id` (uuid, NOT NULL, references auth.users with CASCADE delete)
- `subscription_id` (text, optional - links to services_purchased.stripe_subscription_id)
- `service_id` (text, NOT NULL - identifies which service type this refresh is for)
- `status` (text, NOT NULL, default 'pending' - CHECK constraint for status values)
- `document_types` (text[], NOT NULL - array of document type IDs to refresh)
- `documents_completed` (text[], default '{}' - tracks successful document refreshes)
- `documents_failed` (text[], default '{}' - tracks failed document refreshes)
- `update_instructions` (text, NOT NULL - admin instructions for what changed)
- `client_notes` (text, optional - notes visible to client)
- `admin_notes` (text, optional - internal admin-only notes)
- `admin_id` (uuid, optional - admin who initiated, references auth.users)
- `error_message` (text, optional - stores error details on failure)
- `created_at` (timestamptz, default now())
- `started_at` (timestamptz, optional - when processing began)
- `completed_at` (timestamptz, optional - when job finished)
- `updated_at` (timestamptz, default now() - auto-updates on change)

### 3. Row Level Security
- Enables RLS on the table
- Admin policy: full CRUD access for users with admin role in JWT app_metadata
  or the fallback admin email
- Client policy: SELECT only for their own jobs (via client_id = auth.uid())

### 4. Indexes
- `idx_refresh_jobs_client_id` - for client lookups
- `idx_refresh_jobs_status` - for status filtering
- `idx_refresh_jobs_subscription_id` - for subscription-based queries

### 5. Updated_at Trigger
- Auto-updates `updated_at` column on any row modification

### 6. Realtime
- Adds table to supabase_realtime publication for live updates

## Notes
1. This table stores document refresh job metadata only - actual document content
   is stored in `generated_documents` table
2. The status values are: pending, in_progress, completed, failed, cancelled
3. Document types are matched against `supportsRefresh: true` in document-configs.ts
*/

-- Drop existing table if it exists (from conflicting migrations)
DROP TABLE IF EXISTS document_refresh_jobs CASCADE;

-- Create unified document_refresh_jobs table
CREATE TABLE document_refresh_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text,
  service_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'cancelled')),
  document_types text[] NOT NULL,
  documents_completed text[] DEFAULT '{}',
  documents_failed text[] DEFAULT '{}',
  update_instructions text NOT NULL,
  client_notes text,
  admin_notes text,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  error_message text,
  created_at timestamptz DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE document_refresh_jobs ENABLE ROW LEVEL SECURITY;

-- Admin policy: full CRUD access via JWT role check or email fallback
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

-- Client policy: SELECT only for own jobs
DROP POLICY IF EXISTS "clients_select_own_refresh_jobs" ON document_refresh_jobs;
CREATE POLICY "clients_select_own_refresh_jobs"
  ON document_refresh_jobs
  FOR SELECT
  TO authenticated
  USING (client_id = auth.uid());

-- Performance indexes
CREATE INDEX idx_refresh_jobs_client_id ON document_refresh_jobs (client_id);
CREATE INDEX idx_refresh_jobs_status ON document_refresh_jobs (status);
CREATE INDEX idx_refresh_jobs_subscription_id ON document_refresh_jobs (subscription_id);

-- Auto-update trigger for updated_at
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

-- Enable realtime for live updates in admin dashboard
ALTER PUBLICATION supabase_realtime ADD TABLE document_refresh_jobs;