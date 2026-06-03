/*
  # Add message notification trigger

  1. Changes
    - Create trigger to automatically notify when messages are inserted
    - Calls send-message-notification edge function via http
    - Sends email and push notifications based on user preferences

  2. Implementation
    - Uses pg_net extension to make HTTP calls
    - Trigger fires on INSERT to client_messages table
    - Passes message data to edge function
*/

-- Enable pg_net extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create function to trigger notifications
CREATE OR REPLACE FUNCTION trigger_message_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP request to notification edge function (async, fire and forget)
  PERFORM net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-message-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key')
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
END;
$$ LANGUAGE plpgsql;

-- Create trigger on client_messages
DROP TRIGGER IF EXISTS message_notification_trigger ON client_messages;

CREATE TRIGGER message_notification_trigger
AFTER INSERT ON client_messages
FOR EACH ROW
EXECUTE FUNCTION trigger_message_notification();
