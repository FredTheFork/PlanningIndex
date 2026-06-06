/*
  # Cleanup: Drop unused columns from intake_responses

  1. form_section_completions (jsonb) — overlaps with section_progress (jsonb)
     which is the active column used by the intake wizard. Never referenced in code.

  2. current_section (integer) — replaced by current_section_id (text DEFAULT 'intro')
     which is the active column used by the intake wizard. Never referenced in code.

  3. Security
     - No security impact — these are dead columns that waste storage and cause confusion.
*/

ALTER TABLE intake_responses
  DROP COLUMN IF EXISTS form_section_completions,
  DROP COLUMN IF EXISTS current_section;