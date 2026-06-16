/*
  # Service Tiers, Industry Categories, and Bundle Support

  1. New Enums
    - `service_tier`: foundation, operations, industry
    - `industry_category`: coach, photographer, consultant, contractor, general

  2. services_purchased additions
    - `tier` (service_tier) — which pricing tier this service belongs to
    - `industry` (industry_category) — which industry this service is for
    - `service_group` (text) — which bundle group this purchase belongs to

  3. stripe_orders additions
    - `is_bundle` (boolean) — whether this order was a bundle purchase
    - `bundle_discount_percent` (integer) — discount % applied for the bundle

  4. stripe_subscriptions additions
    - `subscription_interval` (text) — 'month' or 'year' to distinguish monthly care vs quarterly

  5. client_profiles additions
    - `industry` (industry_category) — client's primary industry context
    - `purchased_tier` (service_tier) — highest tier the client has purchased

  6. intake_responses update
    - Change form_version default from 'v2' to 'v5'

  7. Indexes for new columns on services_purchased
*/

-- ============================================================
-- 1. Create new enums
-- ============================================================

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_tier') THEN
    CREATE TYPE service_tier AS ENUM ('foundation', 'operations', 'industry');
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'industry_category') THEN
    CREATE TYPE industry_category AS ENUM ('coach', 'photographer', 'consultant', 'contractor', 'general');
  END IF;
END $$;

-- ============================================================
-- 2. services_purchased: add tier, industry, service_group
-- ============================================================

ALTER TABLE services_purchased
  ADD COLUMN IF NOT EXISTS tier service_tier DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS industry industry_category DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS service_group text DEFAULT NULL;

-- ============================================================
-- 3. stripe_orders: add bundle tracking
-- ============================================================

ALTER TABLE stripe_orders
  ADD COLUMN IF NOT EXISTS is_bundle boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bundle_discount_percent integer DEFAULT NULL;

-- ============================================================
-- 4. stripe_subscriptions: add subscription interval
-- ============================================================

ALTER TABLE stripe_subscriptions
  ADD COLUMN IF NOT EXISTS subscription_interval text DEFAULT NULL
  CHECK (subscription_interval IS NULL OR subscription_interval IN ('month', 'year', 'quarter'));

-- ============================================================
-- 5. client_profiles: add industry and purchased_tier
-- ============================================================

ALTER TABLE client_profiles
  ADD COLUMN IF NOT EXISTS industry industry_category DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS purchased_tier service_tier DEFAULT NULL;

-- ============================================================
-- 6. intake_responses: update form_version default
-- ============================================================

ALTER TABLE intake_responses
  ALTER COLUMN form_version SET DEFAULT 'v5';

-- ============================================================
-- 7. Indexes for new columns
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_services_purchased_tier ON services_purchased(tier);
CREATE INDEX IF NOT EXISTS idx_services_purchased_industry ON services_purchased(industry);
CREATE INDEX IF NOT EXISTS idx_services_purchased_service_group ON services_purchased(service_group);
CREATE INDEX IF NOT EXISTS idx_client_profiles_industry ON client_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_client_profiles_purchased_tier ON client_profiles(purchased_tier);

-- ============================================================
-- 8. Backfill existing data
-- ============================================================

-- Set tier for existing foundation services
UPDATE services_purchased
SET tier = 'foundation'
WHERE service_id IN ('business_foundations_pack', 'website_copy_pack', 'social_media_pack')
  AND tier IS NULL;

-- Set tier for quarterly_refresh (foundation add-on)
UPDATE services_purchased
SET tier = 'foundation'
WHERE service_id = 'quarterly_refresh'
  AND tier IS NULL;

-- Set subscription_interval for existing quarterly subscriptions
UPDATE stripe_subscriptions
SET subscription_interval = 'quarter'
WHERE subscription_interval IS NULL
  AND status IN ('active', 'trialing');

-- Set purchased_tier for existing client_profiles based on their services
UPDATE client_profiles cp
SET purchased_tier = 'foundation'
WHERE EXISTS (
  SELECT 1 FROM services_purchased sp
  WHERE sp.user_id = cp.user_id
    AND sp.status = 'active'
    AND sp.tier = 'foundation'
)
AND cp.purchased_tier IS NULL;

-- ============================================================
-- 9. RLS note
-- ============================================================
-- New columns inherit existing RLS policies from their parent tables.
-- No additional policies needed: users see own rows, admins see all.