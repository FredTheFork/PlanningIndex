/*
  # Force PostgREST schema cache reload via table alteration

  Adds a temporary column and removes it to trigger PostgREST schema cache reload.
  Also grants explicit permissions to the anon and authenticated roles.
*/

-- Grant explicit table permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Force table alteration to trigger schema cache reload
ALTER TABLE public.client_profiles ADD COLUMN IF NOT EXISTS _schema_reload_trigger text DEFAULT '';
ALTER TABLE public.client_profiles DROP COLUMN _schema_reload_trigger;

ALTER TABLE public.intake_responses ADD COLUMN IF NOT EXISTS _schema_reload_trigger text DEFAULT '';
ALTER TABLE public.intake_responses DROP COLUMN _schema_reload_trigger;

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS _schema_reload_trigger text DEFAULT '';
ALTER TABLE public.orders DROP COLUMN _schema_reload_trigger;

-- Notify PostgREST
NOTIFY pgrst, 'reload schema';
