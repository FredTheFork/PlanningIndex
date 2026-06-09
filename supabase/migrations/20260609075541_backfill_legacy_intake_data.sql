-- Backfill intake_complete_for_services and purchased_service_ids for legacy rows
-- where submitted_at is set but these newer columns are null/empty.
-- This fixes "Application error" crashes for older accounts.

-- 1. Backfill intake_responses.purchased_service_ids
-- For rows with submitted_at but no purchased_service_ids, derive from client data
UPDATE intake_responses ir
SET purchased_service_ids = COALESCE(
  derived.ids,
  ARRAY['business_foundations_pack']::text[]
)
FROM (
  SELECT
    ir2.id AS target_id,
    CASE
      -- Try to derive from stripe_orders → services_purchased
      WHEN sp_ids.ids IS NOT NULL AND array_length(sp_ids.ids, 1) > 0 THEN sp_ids.ids
      -- Try to derive from stripe_orders (legacy, no service_ids column)
      WHEN so_count.cnt > 0 THEN ARRAY['business_foundations_pack']::text[]
      -- Try client_profiles.purchased_upsells
      WHEN cp.purchased_upsells IS NOT NULL AND array_length(cp.purchased_upsells, 1) > 0
        THEN ARRAY['business_foundations_pack']::text[] || cp.purchased_upsells
      ELSE NULL
    END AS ids
  FROM intake_responses ir2
  LEFT JOIN client_profiles cp ON cp.user_id = ir2.user_id
  LEFT JOIN LATERAL (
    SELECT array_agg(DISTINCT sp.service_id) AS ids
    FROM services_purchased sp
    WHERE sp.user_id = ir2.user_id AND sp.status = 'active'
  ) sp_ids ON true
  LEFT JOIN LATERAL (
    SELECT count(*) AS cnt
    FROM stripe_orders so
    JOIN stripe_customers sc ON sc.customer_id = so.customer_id
    WHERE sc.user_id = ir2.user_id AND so.status = 'completed'
  ) so_count ON true
  WHERE ir2.submitted_at IS NOT NULL
    AND (ir2.purchased_service_ids IS NULL OR array_length(ir2.purchased_service_ids, 1) IS NULL OR array_length(ir2.purchased_service_ids, 1) = 0)
) derived
WHERE ir.id = derived.target_id;

-- 2. Backfill intake_responses.intake_complete_for_services
-- For submitted rows, set this equal to purchased_service_ids (if they submitted, all services they had were complete)
UPDATE intake_responses ir
SET intake_complete_for_services = ir.purchased_service_ids
WHERE ir.submitted_at IS NOT NULL
  AND (ir.intake_complete_for_services IS NULL
    OR array_length(ir.intake_complete_for_services, 1) IS NULL
    OR array_length(ir.intake_complete_for_services, 1) = 0)
  AND ir.purchased_service_ids IS NOT NULL
  AND array_length(ir.purchased_service_ids, 1) > 0;

-- 3. Backfill client_profiles.intake_complete_for_services
-- Same logic: if they submitted intake, all services they had at that time were complete
UPDATE client_profiles cp
SET intake_complete_for_services = COALESCE(
  ir.purchased_service_ids,
  ARRAY['business_foundations_pack']::text[]
)
FROM intake_responses ir
WHERE ir.user_id = cp.user_id
  AND ir.submitted_at IS NOT NULL
  AND (cp.intake_complete_for_services IS NULL
    OR array_length(cp.intake_complete_for_services, 1) IS NULL
    OR array_length(cp.intake_complete_for_services, 1) = 0);

-- 4. Backfill client_profiles.has_submitted_intake for any that are missing
UPDATE client_profiles cp
SET has_submitted_intake = true,
    intake_submitted_at = COALESCE(cp.intake_submitted_at, ir.submitted_at)
FROM intake_responses ir
WHERE ir.user_id = cp.user_id
  AND ir.submitted_at IS NOT NULL
  AND (cp.has_submitted_intake IS NULL OR cp.has_submitted_intake = false);
