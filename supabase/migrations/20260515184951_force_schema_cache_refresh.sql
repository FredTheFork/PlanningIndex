/*
  # Force PostgREST schema cache refresh

  Apply a trivial migration to trigger a schema cache reload.
*/

-- Create and immediately drop a temporary table to force schema cache refresh
CREATE TABLE IF NOT EXISTS _schema_cache_refresh_trigger (id int);
DROP TABLE IF EXISTS _schema_cache_refresh_trigger;

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
