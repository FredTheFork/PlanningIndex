-- Add missing columns to intake_responses
ALTER TABLE intake_responses
  ADD COLUMN IF NOT EXISTS current_section_id text DEFAULT 'intro',
  ADD COLUMN IF NOT EXISTS section_progress jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS purchased_service_ids text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS intake_complete_for_services text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS last_visited_at timestamptz;

-- Add missing column to client_profiles
ALTER TABLE client_profiles
  ADD COLUMN IF NOT EXISTS intake_complete_for_services text[] DEFAULT '{}';
