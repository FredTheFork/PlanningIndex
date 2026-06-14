/*
  # Add submission_count to intake_responses for edit limit enforcement

  1. Purpose
    - Track how many times a client has submitted their intake form
    - Enforce a maximum of 3 submissions (initial + 2 edits)
    - Remove the 1-hour time window for edit requests (now always available up to limit)

  2. Changes
    - Add submission_count integer column defaulting to 0
    - Backfill existing rows: if submitted_at is set, count is 1; otherwise 0
*/

ALTER TABLE intake_responses
  ADD COLUMN IF NOT EXISTS submission_count integer NOT NULL DEFAULT 0;

-- Backfill: existing submitted rows get count of 1
UPDATE intake_responses
SET submission_count = 1
WHERE submitted_at IS NOT NULL AND submission_count = 0;
