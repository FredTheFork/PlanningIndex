/*
  # Create newsletter_subscribers table

  1. New Tables
    - `newsletter_subscribers`
      - `id` (uuid, primary key)
      - `email` (text, unique, not null)
      - `source` (text) - where they signed up (footer, exit-intent, etc.)
      - `subscribed_at` (timestamp)
      - `confirmed` (boolean, default false)
      - `unsubscribed_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `newsletter_subscribers` table
    - Allow public insert (for signups)
    - Restrict read/update/delete to service role only
*/

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  source text DEFAULT 'footer',
  subscribed_at timestamptz DEFAULT now(),
  confirmed boolean DEFAULT false,
  unsubscribed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (subscribe)
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Only service role can read/update/delete (for admin purposes)
CREATE POLICY "Service role can manage subscribers"
  ON newsletter_subscribers
  FOR ALL
  TO service_role
  USING (true);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers (email);