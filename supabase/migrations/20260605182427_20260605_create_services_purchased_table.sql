-- Create services_purchased table for tracking which services a user has purchased
-- This allows support for multiple, separate purchases and subscription tracking

CREATE TABLE IF NOT EXISTS services_purchased (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id text NOT NULL,
  stripe_checkout_session_id text,
  stripe_subscription_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'past_due')),
  purchased_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  next_billing_date timestamptz,
  subscription_period_start timestamptz,
  subscription_period_end timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_services_purchased_user_service ON services_purchased(user_id, service_id, status);
CREATE INDEX IF NOT EXISTS idx_services_purchased_subscription ON services_purchased(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_services_purchased_status ON services_purchased(status);

-- Enable RLS
ALTER TABLE services_purchased ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own services purchased"
  ON services_purchased
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services purchased (via webhook only)"
  ON services_purchased
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services purchased"
  ON services_purchased
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add missing columns to orders table if they don't exist
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS service_ids text[] DEFAULT '{}';

-- Add missing columns to intake_responses table if they don't exist
ALTER TABLE intake_responses
ADD COLUMN IF NOT EXISTS purchased_service_ids text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS form_section_completions jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS intake_complete_for_services text[] DEFAULT '{}';

-- Add missing columns to client_profiles if they don't exist
ALTER TABLE client_profiles
ADD COLUMN IF NOT EXISTS intake_complete_for_services text[] DEFAULT '{}';
