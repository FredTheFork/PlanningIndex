-- Add provider tracking columns to client_briefs
ALTER TABLE client_briefs 
  ADD COLUMN IF NOT EXISTS provider text,
  ADD COLUMN IF NOT EXISTS sections_generated jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS word_count integer,
  ADD COLUMN IF NOT EXISTS token_count integer,
  ADD COLUMN IF NOT EXISTS generation_started_at timestamptz,
  ADD COLUMN IF NOT EXISTS generation_completed_at timestamptz,
  ADD COLUMN IF NOT EXISTS generation_duration_ms integer,
  ADD COLUMN IF NOT EXISTS intake_sections_used text[] DEFAULT '{}'::text[];

-- Create chatz_api_usage table (mirrors gemini_api_usage)
CREATE TABLE IF NOT EXISTS chatz_api_usage (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model         text NOT NULL,
  request_date  date NOT NULL DEFAULT CURRENT_DATE,
  request_count integer NOT NULL DEFAULT 0,
  token_count   integer NOT NULL DEFAULT 0,
  last_used_at  timestamptz DEFAULT now(),
  UNIQUE (model, request_date)
);

ALTER TABLE chatz_api_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access_chatz_usage" ON chatz_api_usage
  FOR ALL
  USING (
    (auth.jwt() ->> 'role')::text = 'admin' 
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_briefs_client_service 
  ON client_briefs (client_id, service_id);

CREATE INDEX IF NOT EXISTS idx_client_briefs_status 
  ON client_briefs (status);

CREATE INDEX IF NOT EXISTS idx_chatz_usage_date_model 
  ON chatz_api_usage (request_date, model);

COMMENT ON COLUMN client_briefs.provider IS 'AI provider used: chatz, fallback_gemini, or gemini';
COMMENT ON COLUMN client_briefs.sections_generated IS 'JSON array of section names that were generated';
COMMENT ON COLUMN client_briefs.word_count IS 'Word count of the generated brief content';
COMMENT ON COLUMN client_briefs.token_count IS 'Token count from AI API response';
COMMENT ON COLUMN client_briefs.generation_started_at IS 'Timestamp when AI generation started';
COMMENT ON COLUMN client_briefs.generation_completed_at IS 'Timestamp when AI generation completed';
COMMENT ON COLUMN client_briefs.generation_duration_ms IS 'Duration of AI generation in milliseconds';
COMMENT ON COLUMN client_briefs.intake_sections_used IS 'Array of intake section IDs used to build the prompt';