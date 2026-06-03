/*
  # Enable Supabase Realtime for Messaging

  1. Purpose
    - Enable real-time change notifications for the client_messages table
    - This is critical for instant message delivery without page reloads
    - Allows clients and admins to receive messages immediately via Supabase subscriptions

  2. Implementation
    - Add client_messages table to the default supabase_realtime publication
    - This enables PostgreSQL LISTEN/NOTIFY for real-time change events

  3. Note
    - Other tables (notification_logs, conversation_metadata, client_communication_preferences) don't need realtime
    - Only client_messages requires real-time delivery for the chat system to work
*/

-- Enable realtime on client_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE client_messages;