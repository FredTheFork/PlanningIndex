/*
  # Add current_field_index to intake_responses

  1. Modified Tables
    - `intake_responses` — Add `current_field_index` integer column (default 0)
      This tracks the exact field within a section where the user left off,
      enabling precise resume functionality when returning to the intake form.

  2. Important Notes
    1. Combined with existing `current_section`, this gives exact position restore
    2. Default 0 means first field in the section, which is the safe fallback
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intake_responses' AND column_name = 'current_field_index'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN current_field_index integer NOT NULL DEFAULT 0;
  END IF;
END $$;
