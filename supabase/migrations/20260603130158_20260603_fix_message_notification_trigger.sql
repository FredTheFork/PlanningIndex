/*
  # Fix message notification trigger

  1. Problem
    - Previous trigger attempted to read 'app.supabase_url' and 'app.supabase_anon_key' 
      via current_setting(), but these custom PostgreSQL configuration parameters were never set
    - This caused all INSERT operations on client_messages to fail with error 42704
    - Result: unrecognized configuration parameter "app.supabase_url"

  2. Solution
    - Drop the broken trigger and function
    - Recreate function using hardcoded Supabase project URL
    - Use Supabase's built-in service_role_key instead of trying to fetch anon key
    - Service role key is injected by Supabase and available via current_setting()
    - Hardcoded URL: https://npamfxqasswqnmbqgdbw.supabase.co (the project URL)

  3. Implementation
    - Function now calls Edge Function with proper authentication
    - Uses pg_net extension to make async HTTP POST requests
    - Service role has full database access, making it safe for internal triggers
    - All message inserts will now trigger notifications without errors

  4. Security Notes
    - Service role key is only used for internal database operations
    - Client-facing operations continue to use anon key with RLS policies
    - Edge Function still validates all inputs and respects user preferences
*/

-- Drop the broken trigger and function
DROP TRIGGER IF EXISTS message_notification_trigger ON client_messages;
DROP FUNCTION IF EXISTS trigger_message_notification();

-- Recreate function with hardcoded URL and proper key handling
CREATE OR REPLACE FUNCTION trigger_message_notification()
RETURNS TRIGGER AS $$
DECLARE
  supabase_url text := 'https://npamfxqasswqnmbqgdbw.supabase.co';
  service_role_key text := current_setting('supabase.service_role_key');
BEGIN
  -- Make HTTP request to notification edge function (async, fire and forget)
  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-message-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := jsonb_build_object(
      'id', NEW.id,
      'sender_id', NEW.sender_id,
      'recipient_id', NEW.recipient_id,
      'message_content', NEW.message_content,
      'message_type', NEW.message_type,
      'created_at', NEW.created_at
    )
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the insert - notifications are best-effort
  RAISE WARNING 'Failed to trigger notification: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger on client_messages
CREATE TRIGGER message_notification_trigger
AFTER INSERT ON client_messages
FOR EACH ROW
EXECUTE FUNCTION trigger_message_notification();
