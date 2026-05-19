/*
  # Add file storage columns to generated_documents

  1. Modified Tables
    - `generated_documents`
      - `pdf_path` (text, nullable) - path to PDF in Supabase Storage
      - `docx_path` (text, nullable) - path to DOCX in Supabase Storage
      - `files_generated_at` (timestamptz, nullable) - when PDF/DOCX were last generated

  2. Purpose
    - After admin reviews text content, they can generate PDF and DOCX files
    - Files are stored in Supabase Storage bucket 'generated-documents'
    - Paths follow pattern: {user_id}/{document_type}.pdf and {user_id}/{document_type}.docx
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_documents' AND column_name = 'pdf_path'
  ) THEN
    ALTER TABLE generated_documents ADD COLUMN pdf_path text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_documents' AND column_name = 'docx_path'
  ) THEN
    ALTER TABLE generated_documents ADD COLUMN docx_path text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'generated_documents' AND column_name = 'files_generated_at'
  ) THEN
    ALTER TABLE generated_documents ADD COLUMN files_generated_at timestamptz;
  END IF;
END $$;
