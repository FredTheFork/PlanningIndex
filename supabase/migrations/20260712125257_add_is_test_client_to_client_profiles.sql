-- Add is_test_client column to client_profiles for distinguishing AI-generated test clients
ALTER TABLE client_profiles ADD COLUMN IF NOT EXISTS is_test_client BOOLEAN DEFAULT FALSE NOT NULL;

-- Add index for fast filtering of test clients
CREATE INDEX IF NOT EXISTS idx_client_profiles_is_test_client ON client_profiles (is_test_client) WHERE is_test_client = true;
