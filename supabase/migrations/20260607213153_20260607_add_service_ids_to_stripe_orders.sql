-- Add service_ids column to stripe_orders so webhook can store which services were purchased
ALTER TABLE stripe_orders
  ADD COLUMN IF NOT EXISTS service_ids text[] DEFAULT '{}';
