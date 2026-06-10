-- Add service_id column to support per-service briefs
ALTER TABLE client_briefs ADD COLUMN IF NOT EXISTS service_id text;
ALTER TABLE client_briefs ADD COLUMN IF NOT EXISTS model_used text;

-- Add unique constraint for upsert conflict resolution
CREATE UNIQUE INDEX IF NOT EXISTS client_briefs_client_service_uniq ON client_briefs (client_id, service_id);

-- Make status nullable since existing rows have it
-- (already nullable based on schema check)