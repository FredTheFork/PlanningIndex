/*
  # Add additional_notes column to intake_responses

  1. Changes
    - Add `additional_notes` jsonb column to `intake_responses` table
      - Stores per-question notes as { "field_id": "note text", ... }
    - Add `current_field_index` integer column (if not exists)
      - Tracks which field within a section the user is on

  2. Security
    - No RLS changes needed — existing policies cover the table

  3. Notes
    - additional_notes defaults to '{}' so it's always a valid jsonb object
    - current_field_index defaults to 0
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intake_responses' AND column_name = 'additional_notes'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN additional_notes jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'intake_responses' AND column_name = 'current_field_index'
  ) THEN
    ALTER TABLE intake_responses ADD COLUMN current_field_index integer DEFAULT 0;
  END IF;
END $$;
