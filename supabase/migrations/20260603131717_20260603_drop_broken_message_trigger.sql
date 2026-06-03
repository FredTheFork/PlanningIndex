/*
  # Drop broken message notification trigger

  1. Changes
    - Drop the broken trigger and function that attempted to call Edge Function from database
    - Notification logic has been moved to server action (app/actions/messaging.ts)
    - Server action has access to SUPABASE_SERVICE_ROLE_KEY and can properly authenticate

  2. Why This Change
    - Previous trigger tried to read non-existent PostgreSQL config parameters (app.supabase_url, app.supabase_anon_key, supabase.service_role_key)
    - Supabase doesn't expose these parameters via current_setting()
    - New approach: notifications are triggered via server action after INSERT succeeds
    - Server action has proper access to credentials and can call Edge Function reliably

  3. Flow After This Change
    - Admin/client sends message via UI
    - Message INSERT to client_messages succeeds (no trigger failures)
    - Client calls server action triggerMessageNotification() with message data
    - Server action calls Edge Function with SUPABASE_SERVICE_ROLE_KEY
    - Edge Function sends notifications based on user preferences
    - No database trigger needed
*/

-- Drop the broken trigger
DROP TRIGGER IF EXISTS message_notification_trigger ON client_messages;

-- Drop the broken function
DROP FUNCTION IF EXISTS trigger_message_notification();
