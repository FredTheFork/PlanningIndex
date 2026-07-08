-- Create client_briefs table (from 20260517)
CREATE TABLE IF NOT EXISTS client_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  brief_content text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  risk_level text CHECK (risk_level IN ('Low', 'Medium', 'High')),
  error_message text,
  generated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by client
CREATE INDEX IF NOT EXISTS idx_client_briefs_client_id ON client_briefs(client_id);

-- Enable RLS
ALTER TABLE client_briefs ENABLE ROW LEVEL SECURITY;

-- Admin-only read access (checks JWT app_metadata role or email fallback)
CREATE POLICY "Admins can read client briefs"
  ON client_briefs
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin-only insert (for edge functions / server-side)
CREATE POLICY "Admins can insert client briefs"
  ON client_briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin-only update
CREATE POLICY "Admins can update client briefs"
  ON client_briefs
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Admin-only delete
CREATE POLICY "Admins can delete client briefs"
  ON client_briefs
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = 'admin'
    OR auth.email() = 'foundationarybusiness@gmail.com'
    OR EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Add version tracking
ALTER TABLE client_briefs
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

-- Add service_id for per-service briefs
ALTER TABLE client_briefs
  ADD COLUMN IF NOT EXISTS service_id text;

-- Add model_used to track which AI model generated the brief
ALTER TABLE client_briefs
  ADD COLUMN IF NOT EXISTS model_used text;