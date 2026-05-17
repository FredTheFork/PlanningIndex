/*
  # Create client_briefs table

  1. New Tables
    - `client_briefs`
      - `id` (uuid, primary key, default gen_random_uuid())
      - `client_id` (uuid, foreign key to client_profiles.user_id)
      - `brief_content` (text, nullable)
      - `status` (text, default 'pending', check: pending/generating/completed/failed)
      - `risk_level` (text, nullable, check: Low/Medium/High)
      - `error_message` (text, nullable)
      - `generated_at` (timestamptz, nullable)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `client_briefs`
    - Admin-only SELECT policy (users with app_metadata.role = 'admin')
    - No INSERT/UPDATE/DELETE policies for client access (managed server-side only)
*/

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

-- Admin-only read access (checks JWT app_metadata role)
CREATE POLICY "Admins can read client briefs"
  ON client_briefs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only insert (for edge functions / server-side)
CREATE POLICY "Admins can insert client briefs"
  ON client_briefs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only update
CREATE POLICY "Admins can update client briefs"
  ON client_briefs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );

-- Admin-only delete
CREATE POLICY "Admins can delete client briefs"
  ON client_briefs
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_app_meta_data->>'role' = 'admin'
    )
  );
