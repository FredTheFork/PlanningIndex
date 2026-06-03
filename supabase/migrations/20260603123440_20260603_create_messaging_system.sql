/*
  # Complete In-App Messaging System

  1. New Tables
    - `client_communication_preferences` - Store user contact preferences and opt-in status
    - `client_messages` - Store all messages between admins and clients
    - `conversation_metadata` - Track conversation threads and metadata
    - `notification_logs` - Log all notifications sent for compliance/debugging

  2. Features
    - Two-way messaging between admins and clients
    - Client-initiated contact capability
    - Context-aware messaging (can link to documents or intake questions)
    - Read receipts and timestamps
    - Notification preferences and opt-in tracking
    - Secure RLS policies for data access

  3. Security
    - Enable RLS on all tables
    - Users can only read messages they're part of
    - Users can only send messages as themselves
    - Admins can read all messages via role bypass
    - Communication preferences are user-specific

  4. Notification Strategy
    - Free via: Supabase Realtime (instant sync), Email (Resend), FCM push (web)
    - Optional paid SMS via Twilio in future
    - Full opt-in/opt-out compliance
*/

-- Create client communication preferences table
CREATE TABLE IF NOT EXISTS client_communication_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number text,
  email_notifications_enabled boolean DEFAULT true,
  push_notifications_enabled boolean DEFAULT true,
  sms_notifications_enabled boolean DEFAULT false,
  consent_timestamp timestamptz DEFAULT now(),
  consent_version text DEFAULT '1.0',
  notification_preferences jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_communication_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own communication preferences"
  ON client_communication_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own communication preferences"
  ON client_communication_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own communication preferences"
  ON client_communication_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all communication preferences"
  ON client_communication_preferences FOR SELECT
  TO authenticated
  USING (
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
    OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'foundationarybusiness@gmail.com'
  );

-- Create client messages table
CREATE TABLE IF NOT EXISTS client_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_content text NOT NULL,
  message_type text CHECK (message_type IN ('general', 'document_query', 'intake_query', 'client_initiated')) DEFAULT 'general',
  related_document_id uuid REFERENCES generated_documents(id) ON DELETE SET NULL,
  related_intake_field_key text,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can insert messages as sender"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update messages they own (mark as read)"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON client_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON client_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON client_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON client_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON client_messages(is_read) WHERE NOT is_read;
CREATE INDEX IF NOT EXISTS idx_messages_document ON client_messages(related_document_id);

-- Create conversation metadata table
CREATE TABLE IF NOT EXISTS conversation_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid UNIQUE NOT NULL,
  participant_1_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at timestamptz,
  last_message_preview text,
  archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversation_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversations they are part of"
  ON conversation_metadata FOR SELECT
  TO authenticated
  USING (
    auth.uid() = participant_1_id 
    OR auth.uid() = participant_2_id
    OR (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

-- Create notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id uuid REFERENCES client_messages(id) ON DELETE CASCADE,
  notification_type text CHECK (notification_type IN ('email', 'push', 'sms')) NOT NULL,
  delivery_status text CHECK (delivery_status IN ('pending', 'sent', 'failed', 'bounced')) DEFAULT 'pending',
  recipient_address text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  sent_at timestamptz
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all notification logs"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can view logs for their own notifications"
  ON notification_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for notification logs
CREATE INDEX IF NOT EXISTS idx_notification_logs_user ON notification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_message ON notification_logs(message_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_created ON notification_logs(created_at DESC);
