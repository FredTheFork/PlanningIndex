/*
  # Add additional_notes column to intake_responses

  1. Changes
    - Add `additional_notes` jsonb column to `intake_responses` table
      - Stores per-question notes as { "field_id": "note text", ... }
    - Defaults to empty jsonb object '{}'

  2. Security
    - No RLS changes needed — existing policies cover the table
*/

ALTER TABLE intake_responses ADD COLUMN IF NOT EXISTS additional_notes jsonb DEFAULT '{}';
