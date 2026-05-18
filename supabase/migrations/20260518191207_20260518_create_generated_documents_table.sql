/*
  # Create Generated Documents Table

  1. New Tables
    - `generated_documents`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references client_profiles.user_id)
      - `document_type` (text, the type key e.g. 'terms_and_conditions')
      - `document_label` (text, human-readable name e.g. 'Terms and Conditions')
      - `status` (text: pending/generating/completed/failed)
      - `content_text` (text, the raw text/markdown output from Gemini)
      - `content_html` (text, HTML-rendered version for display)
      - `api_key_used` (text, which API key/project was used)
      - `model_used` (text, which Gemini model was used)
      - `error_message` (text, error details if failed)
      - `generated_at` (timestamptz, when generation completed)
      - `admin_edited` (boolean, whether admin has modified the content)
      - `admin_edited_at` (timestamptz, when last admin edit occurred)
      - `delivered_to_client` (boolean, whether document has been released to client)
      - `delivered_at` (timestamptz, when delivered to client)
      - `auto_delete_at` (timestamptz, when document auto-deletes from client view - 14 days after delivery)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `generated_documents` table
    - Admin users can read/write all documents
    - Clients can only read their own delivered documents (not yet auto-deleted)

  3. Purpose
    - Stores all AI-generated business documents per client
    - Tracks generation status, admin edits, and delivery state
    - Supports 14-day auto-deletion from client view
*/

CREATE TABLE IF NOT EXISTS generated_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES client_profiles(user_id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_label text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  content_text text,
  content_html text,
  api_key_used text,
  model_used text,
  error_message text,
  generated_at timestamptz,
  admin_edited boolean NOT NULL DEFAULT false,
  admin_edited_at timestamptz,
  delivered_to_client boolean NOT NULL DEFAULT false,
  delivered_at timestamptz,
  auto_delete_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, document_type)
);

ALTER TABLE generated_documents ENABLE ROW LEVEL SECURITY;

-- Admin users can do everything with generated documents
CREATE POLICY "Admins can manage all generated documents"
  ON generated_documents FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Clients can read their own delivered documents that haven't auto-deleted
CREATE POLICY "Clients can read own delivered documents"
  ON generated_documents FOR SELECT
  TO authenticated
  USING (
    client_id = auth.uid()
    AND delivered_to_client = true
    AND (auto_delete_at IS NULL OR auto_delete_at > now())
  );

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_generated_documents_client ON generated_documents(client_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_status ON generated_documents(status);
