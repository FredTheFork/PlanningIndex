-- Admin Dashboard Performance Indexes
-- Improve query performance for the admin dashboard's common filter/sort operations

-- Composite index for delivery_status + has_submitted_intake filtering
CREATE INDEX IF NOT EXISTS idx_client_profiles_delivery_intake
  ON client_profiles (delivery_status, has_submitted_intake);

-- Index on created_at for default sorting
CREATE INDEX IF NOT EXISTS idx_client_profiles_created_desc
  ON client_profiles (created_at DESC);

-- Index on intake_complete_for_services for GIN array operations
CREATE INDEX IF NOT EXISTS idx_client_profiles_intake_complete_gin
  ON client_profiles USING GIN (intake_complete_for_services);

-- Index on client_briefs for status lookups
CREATE INDEX IF NOT EXISTS idx_client_briefs_status
  ON client_briefs (client_id, status);

-- Index on services_purchased for tier/industry lookups
CREATE INDEX IF NOT EXISTS idx_services_purchased_user_service
  ON services_purchased (user_id, service_id, status);

-- Index on generated_documents for delivery counts
CREATE INDEX IF NOT EXISTS idx_generated_documents_client_delivered
  ON generated_documents (client_id, delivered_to_client);
