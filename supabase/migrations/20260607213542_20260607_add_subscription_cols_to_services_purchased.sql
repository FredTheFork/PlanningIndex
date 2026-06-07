-- Add subscription-related columns to services_purchased for admin view convenience
ALTER TABLE services_purchased
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
  ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_period_start timestamptz,
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz;
