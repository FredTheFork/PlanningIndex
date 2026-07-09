/*
# Create chatz_api_usage table

1. New Tables
- `chatz_api_usage`
- `id` (uuid, primary key)
- `model` (text, model identifier)
- `request_date` (date, for daily tracking)
- `request_count` (integer, default 0)
- `token_count` (integer, default 0)
- `last_used_at` (timestamptz)
- `created_at` (timestamptz)

2. Purpose
- Tracks usage of the Chatz API for document generation and refresh operations
- Companion to the existing gemini_api_usage table
*/

CREATE TABLE IF NOT EXISTS chatz_api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL,
  request_date date NOT NULL DEFAULT CURRENT_DATE,
  request_count integer NOT NULL DEFAULT 0,
  token_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE chatz_api_usage ENABLE ROW LEVEL SECURITY;

-- Admin policy: full access for admins
DROP POLICY IF EXISTS "admins_manage_chatz_usage" ON chatz_api_usage;
CREATE POLICY "admins_manage_chatz_usage"
  ON chatz_api_usage
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

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_chatz_api_usage_date_model ON chatz_api_usage (request_date, model);