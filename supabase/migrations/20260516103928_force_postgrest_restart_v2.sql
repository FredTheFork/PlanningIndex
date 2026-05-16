/*
  # Force PostgREST restart via schema change

  Drops and recreates the health_check function with a different signature
  to force PostgREST to reload its schema cache.
*/

-- Drop the existing function
DROP FUNCTION IF EXISTS public.health_check();

-- Create a function with a parameter (different signature)
CREATE OR REPLACE FUNCTION public.health_check(p_text text DEFAULT 'ok')
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT p_text;
$$;

-- Multiple NOTIFY attempts
NOTIFY pgrst, 'reload schema';
