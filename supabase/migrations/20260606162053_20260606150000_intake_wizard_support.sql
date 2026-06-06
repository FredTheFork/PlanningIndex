/*
  # Intake Wizard Support

  1. Purpose
    - Add columns to support the multi-step intake form wizard:
      section navigation, progress tracking, and last visited timestamp.
    - Set DEFAULT auth.uid() on intake_responses.user_id so new rows
      are automatically scoped to the authenticated user.
    - Ensure the INSERT policy exists (idempotent).

  2. Changes
    - Add current_section_id (text DEFAULT 'intro') — tracks which section the user is on
    - Add section_progress (jsonb DEFAULT '{}') — tracks per-section completion status
    - Add last_visited_at (timestamptz) — tracks when user last visited the form
    - Alter user_id to DEFAULT auth.uid() — auto-populates on INSERT

  3. Backward Compatibility
    - Existing rows get 'intro' as current_section_id and '{}' as section_progress
    - The form_version column and all existing data are untouched
*/

-- Add wizard navigation columns
ALTER TABLE intake_responses
  ADD COLUMN IF NOT EXISTS current_section_id text DEFAULT 'intro',
  ADD COLUMN IF NOT EXISTS section_progress jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_visited_at timestamptz;

-- Set DEFAULT auth.uid() on user_id so INSERT from client auto-populates
ALTER TABLE intake_responses
  ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Idempotent: ensure INSERT policy exists (will fail silently if already present)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'intake_responses'
      AND policyname = 'Users can insert own intake responses'
  ) THEN
    CREATE POLICY "Users can insert own intake responses"
      ON intake_responses
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Update last_visited_at on every write to intake_responses
CREATE OR REPLACE FUNCTION update_intake_last_visited()
RETURNS trigger AS $$
BEGIN
  NEW.last_visited_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_intake_last_visited ON intake_responses;
CREATE TRIGGER trg_intake_last_visited
  BEFORE UPDATE ON intake_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_intake_last_visited();
