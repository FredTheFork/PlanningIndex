/*
  # Force PostgREST schema cache refresh

  Creates a simple function and then drops it to trigger PostgREST schema cache reload.
  Also adds comments to all tables to help PostgREST discover them.
*/

-- Add comments to all tables to help PostgREST discover them
COMMENT ON TABLE public.intake_responses IS 'Intake form responses - stores user answers to the intake questionnaire';
COMMENT ON TABLE public.client_profiles IS 'Client profiles - tracks purchase and delivery status';
COMMENT ON TABLE public.admin_users IS 'Admin users - stores admin role assignments';
COMMENT ON TABLE public.intake_uploads IS 'Intake uploads - stores file upload metadata';
COMMENT ON TABLE public.client_documents IS 'Client documents - stores document metadata';
COMMENT ON TABLE public.orders IS 'Orders - tracks purchase orders';
COMMENT ON TABLE public.stripe_customers IS 'Stripe customers - maps users to Stripe customer IDs';
COMMENT ON TABLE public.stripe_orders IS 'Stripe orders - tracks Stripe order status';
COMMENT ON TABLE public.stripe_subscriptions IS 'Stripe subscriptions - tracks subscription status';

-- Create a temporary function to trigger schema cache reload
CREATE OR REPLACE FUNCTION public.health_check()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'ok'::text;
$$;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
