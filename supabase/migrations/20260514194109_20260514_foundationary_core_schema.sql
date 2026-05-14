/*
  # Foundationary Core Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key) - Order identifier
      - `user_id` (uuid, foreign key → auth.users) - The user who placed the order
      - `stripe_checkout_session_id` (text) - Stripe checkout session ID
      - `stripe_payment_intent_id` (text) - Stripe payment intent ID
      - `status` (enum: paid | refunded | failed) - Order status
      - `created_at` (timestamptz) - When the order was created

    - `client_profiles`
      - `id` (uuid, primary key) - Profile identifier
      - `user_id` (uuid, unique, foreign key → auth.users) - The user this profile belongs to
      - `has_submitted_intake` (boolean) - Whether the intake form has been submitted
      - `intake_submitted_at` (timestamptz, nullable) - When intake was submitted
      - `delivery_link` (text, nullable) - Link to delivered documents
      - `delivery_status` (enum: not_started | in_progress | delivered) - Document delivery status
      - `created_at` (timestamptz) - When the profile was created
      - `updated_at` (timestamptz) - When the profile was last updated

    - `intake_responses`
      - `id` (uuid, primary key) - Response record identifier
      - `user_id` (uuid, foreign key → auth.users) - The user who owns these responses
      - `form_version` (text) - Version of the intake form (e.g. "v2")
      - `responses` (jsonb) - Structured form responses, supports partial saves
      - `current_section` (integer) - Current section index for resuming
      - `last_saved_at` (timestamptz) - When responses were last autosaved
      - `created_at` (timestamptz) - When the record was created

  2. Enums
    - `order_status`: paid, refunded, failed
    - `delivery_status`: not_started, in_progress, delivered

  3. Security
    - RLS enabled on all new tables
    - Users can only read/write their own rows
    - No public access
    - Intake responses never public
    - Delivery links visible only to owner

  4. Important Notes
    1. Users are created ONLY via the Stripe webhook flow - no free signup
    2. client_profiles and intake_responses are created automatically after payment
    3. intake_responses supports partial saves - users can leave and resume later
    4. The `current_section` field tracks where the user left off in the form
*/

-- Create enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('paid', 'refunded', 'failed');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_status') THEN
    CREATE TYPE delivery_status AS ENUM ('not_started', 'in_progress', 'delivered');
  END IF;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_checkout_session_id text NOT NULL,
  stripe_payment_intent_id text,
  status order_status NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create client_profiles table
CREATE TABLE IF NOT EXISTS client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_submitted_intake boolean NOT NULL DEFAULT false,
  intake_submitted_at timestamptz,
  delivery_link text,
  delivery_status delivery_status NOT NULL DEFAULT 'not_started',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create intake_responses table
CREATE TABLE IF NOT EXISTS intake_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  form_version text NOT NULL DEFAULT 'v2',
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  current_section integer NOT NULL DEFAULT 0,
  last_saved_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;

-- Orders: users can only see their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No INSERT/DELETE policies for users on orders - only the webhook creates orders

-- Client profiles: users can only see their own profile
CREATE POLICY "Users can view own client profile"
  ON client_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own client profile"
  ON client_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No INSERT/DELETE policies for users on client_profiles - only the webhook creates profiles

-- Intake responses: users can read and update their own responses
CREATE POLICY "Users can view own intake responses"
  ON intake_responses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own intake responses"
  ON intake_responses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- No INSERT/DELETE policies for users on intake_responses - only the webhook creates records

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_session_id ON orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_intake_responses_user_id ON intake_responses(user_id);

-- Add updated_at trigger for client_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_client_profiles_updated_at ON client_profiles;
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
