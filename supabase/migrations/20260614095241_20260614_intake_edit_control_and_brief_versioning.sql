-- Add intake edit control fields to intake_responses
ALTER TABLE intake_responses
  ADD COLUMN IF NOT EXISTS edit_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS edit_granted_at timestamptz,
  ADD COLUMN IF NOT EXISTS edit_granted_by uuid;

-- Add version tracking to client_briefs
ALTER TABLE client_briefs
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- Set existing briefs to version 1 (they were the first version)
UPDATE client_briefs SET version = 1 WHERE version IS NULL OR version = 0;

-- Add index for checking edit access
CREATE INDEX IF NOT EXISTS idx_intake_responses_edit_granted
  ON intake_responses (user_id, edit_granted_at)
  WHERE edit_granted_at IS NOT NULL;

-- RLS policies for the new columns are already covered by existing intake_responses policies