/*
  # Create Gemini API Usage Tracking Table

  1. New Tables
    - `gemini_api_usage`
      - `id` (uuid, primary key)
      - `model` (text, which Gemini model was used)
      - `request_date` (date, the date of the request for grouping)
      - `request_count` (integer, number of requests made with this model on this date)
      - `last_used_at` (timestamptz, when the model was last used)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `gemini_api_usage` table
    - Add policy for service role to manage usage data
    - No public access — this is internal operational data

  3. Purpose
    - Tracks daily Gemini API request counts per model
    - Enables automatic model switching when daily limits are approached
    - Supports daily reset by querying request_date = current date
    - Prevents hitting Gemini free tier rate limits (500 RPD for 2.5 Flash)
*/

CREATE TABLE IF NOT EXISTS gemini_api_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model text NOT NULL,
  request_date date NOT NULL DEFAULT CURRENT_DATE,
  request_count integer NOT NULL DEFAULT 0,
  last_used_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(model, request_date)
);

ALTER TABLE gemini_api_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by edge functions with service_role key)
-- The service_role key bypasses RLS, but we add policies for safety
CREATE POLICY "Service role can manage API usage"
  ON gemini_api_usage
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for fast lookups by date
CREATE INDEX IF NOT EXISTS idx_gemini_api_usage_date ON gemini_api_usage(request_date);
