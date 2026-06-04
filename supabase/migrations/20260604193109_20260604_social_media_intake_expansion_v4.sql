/*
  # Social Media Intake Expansion — Form Version v4

  1. Purpose
    - Signals that the intake form structure has been expanded with 9 new
      social media fields (SM4–SM13) for standalone-capable social media
      intake. The responses JSONB column requires no schema change — new
      field keys are stored automatically. This migration updates the
      default form_version to v4 so that new intake records are tagged
      with the correct version.

  2. Changes
    - Update `intake_responses.form_version` default from 'v2' to 'v4'

  3. Backward Compatibility
    - Existing rows with form_version 'v2' or 'v3' are unaffected.
    - The JSONB `responses` column stores all answers as key-value pairs;
      missing keys simply mean the user has not yet answered those fields.
    - No data is lost or altered.

  4. New Fields (stored as JSONB keys in `responses`)
    - sm4_posting_frequency (single_choice: 3x/week, 5x/week, Daily, 2x/day, Not sure)
    - sm5_content_pillars (long_text)
    - sm6_personal_boundaries (long_text)
    - sm7_hashtag_strategy (single_choice: Broad reach, Niche targeted, Mixed, No preference)
    - sm8_competitor_accounts (long_text, optional)
    - sm9_content_tone (single_choice: Same as overall brand tone, More casual/personal, More professional, More promotional)
    - sm10_call_to_action (long_text, optional)
    - sm11_existing_accounts (long_text, optional)
    - sm12_content_calendar (single_choice: Weekly themed, Rotating pillars, Mix of types, No preference)
    - sm13_upcoming_launches (long_text, optional)
*/

ALTER TABLE intake_responses
  ALTER COLUMN form_version SET DEFAULT 'v4';
