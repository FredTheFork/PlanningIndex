-- Application state store for the serverless deployment (Vercel).
--
-- The app keeps its users, sessions, profiles, subscriptions and CRM data as
-- a single JSON document (lib/server/db.ts). Vercel's serverless filesystem is
-- read-only, so when Supabase credentials are configured the document is
-- persisted to this table instead of the local .data/db.json file.
--
-- Access is service-role only: RLS is enabled with no policies, so anon and
-- authenticated requests are denied. The single row has id 'default'.

CREATE TABLE IF NOT EXISTS app_state (
  id text PRIMARY KEY DEFAULT 'default',
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_state ENABLE ROW LEVEL SECURITY;
