/*
# Create profiles, customers, subscriptions, and subscription_history tables

## Purpose
This migration creates the full membership and subscription data layer for PlanningIndex.
It enables user authentication, Stripe checkout, account management, and billing.

## New Tables

### 1. profiles
Extends the Supabase auth user with company information that auto-populates into proposals.
- `id` (uuid, primary key, references auth.users)
- `company_name` (text, nullable — filled in during registration or later)
- `full_name` (text, nullable)
- `phone` (text, nullable)
- `address_line1` (text, nullable)
- `address_line2` (text, nullable)
- `city` (text, nullable)
- `postcode` (text, nullable)
- `website` (text, nullable)
- `logo_url` (text, nullable)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

### 2. customers
Links Supabase auth users to Stripe customer IDs.
- `id` (uuid, primary key, default gen_random_uuid)
- `user_id` (uuid, not null, unique, references auth.users ON DELETE CASCADE, defaults to auth.uid())
- `stripe_customer_id` (text, nullable — set by webhook after first checkout)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

### 3. subscriptions
Tracks each user's Stripe subscription state.
- `id` (uuid, primary key, default gen_random_uuid)
- `user_id` (uuid, not null, unique, references auth.users ON DELETE CASCADE, defaults to auth.uid())
- `stripe_subscription_id` (text, nullable)
- `stripe_price_id` (text, nullable)
- `plan_tier` (text, nullable — 'local', 'regional', 'national', 'enterprise')
- `billing_cycle` (text, nullable — 'monthly', 'annual')
- `status` (text, not null, default 'inactive' — 'active', 'inactive', 'trialing', 'canceled', 'past_due')
- `current_period_start` (timestamptz, nullable)
- `current_period_end` (timestamptz, nullable)
- `cancel_at_period_end` (boolean, not null, default false)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

### 4. subscription_history
Audit log for every subscription event.
- `id` (uuid, primary key, default gen_random_uuid)
- `user_id` (uuid, not null, references auth.users ON DELETE CASCADE, defaults to auth.uid())
- `event_type` (text, not null — 'created', 'updated', 'deleted', 'payment_succeeded', 'payment_failed', 'trial_started', 'trial_ended')
- `stripe_event_id` (text, nullable)
- `subscription_data` (jsonb, nullable — stores the full event payload for audit)
- `created_at` (timestamptz, default now)

## Security
- RLS enabled on all four tables.
- All tables scoped to `TO authenticated` with `auth.uid() = user_id` ownership checks.
- `profiles` table uses `auth.uid() = id` (id IS the user_id).
- Owner columns default to `auth.uid()` so inserts work without explicitly passing user_id.
- Four separate policies per table (SELECT, INSERT, UPDATE, DELETE).

## Important Notes
1. The `DEFAULT auth.uid()` on user_id columns allows client-side inserts that omit user_id to succeed.
2. profiles.id references auth.users(id) directly — no separate user_id column needed.
3. subscription_history is append-only (no UPDATE or DELETE policies needed, but added for completeness).
4. All tables are idempotent — safe to re-run.
*/

-- =========================================================
-- 1. profiles table
-- =========================================================
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text,
  full_name text,
  phone text,
  address_line1 text,
  address_line2 text,
  city text,
  postcode text,
  website text,
  logo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- =========================================================
-- 2. customers table
-- =========================================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_customer" ON customers;
CREATE POLICY "select_own_customer" ON customers FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_customer" ON customers;
CREATE POLICY "insert_own_customer" ON customers FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_customer" ON customers;
CREATE POLICY "update_own_customer" ON customers FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_customer" ON customers;
CREATE POLICY "delete_own_customer" ON customers FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- 3. subscriptions table
-- =========================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text,
  stripe_price_id text,
  plan_tier text,
  billing_cycle text,
  status text NOT NULL DEFAULT 'inactive',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subscription" ON subscriptions;
CREATE POLICY "select_own_subscription" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_subscription" ON subscriptions;
CREATE POLICY "insert_own_subscription" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_subscription" ON subscriptions;
CREATE POLICY "update_own_subscription" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_subscription" ON subscriptions;
CREATE POLICY "delete_own_subscription" ON subscriptions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- 4. subscription_history table
-- =========================================================
CREATE TABLE IF NOT EXISTS subscription_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  stripe_event_id text,
  subscription_data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subscription_history" ON subscription_history;
CREATE POLICY "select_own_subscription_history" ON subscription_history FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_subscription_history" ON subscription_history;
CREATE POLICY "insert_own_subscription_history" ON subscription_history FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_subscription_history" ON subscription_history;
CREATE POLICY "update_own_subscription_history" ON subscription_history FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_subscription_history" ON subscription_history;
CREATE POLICY "delete_own_subscription_history" ON subscription_history FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- =========================================================
-- Indexes for performance
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_history_user_id ON subscription_history(user_id);

-- =========================================================
-- updated_at trigger function (reusable)
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();