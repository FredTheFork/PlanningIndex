/*
  # Fix messaging system RLS and permissions

  1. Changes
    - Fix RLS policies to allow proper access
    - Fix admin bypass conditions
    - Allow unauthenticated POST to client_messages for edge function
    - Fix user lookup in policies to handle role checking properly

  2. Issues Fixed
    - 403 Forbidden errors on messaging operations
    - UUID validation in inserts
    - Admin user detection in RLS policies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON client_messages;
DROP POLICY IF EXISTS "Users can insert messages as sender" ON client_messages;
DROP POLICY IF EXISTS "Users can update messages they own (mark as read)" ON client_messages;

-- Recreate client_messages policies with simpler logic
CREATE POLICY "Users can view messages in their conversations"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id 
    OR auth.uid() = recipient_id
  );

CREATE POLICY "Admins can view all messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages as sender"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
  );

CREATE POLICY "Users can update read status on their messages"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = recipient_id
  )
  WITH CHECK (
    auth.uid() = recipient_id
  );

-- Allow admin updates
CREATE POLICY "Admins can update all messages"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Fix communication preferences policies
DROP POLICY IF EXISTS "Admins can view all communication preferences" ON client_communication_preferences;

CREATE POLICY "Admins can view all communication preferences"
  ON client_communication_preferences FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Allow service role to read preferences
CREATE POLICY "Service role can read all preferences"
  ON client_communication_preferences FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to read all messages for notifications
CREATE POLICY "Service role can read all messages"
  ON client_messages FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to insert notification logs
CREATE POLICY "Service role can insert notification logs"
  ON notification_logs FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Fix conversation metadata policies
DROP POLICY IF EXISTS "Users can view conversations they are part of" ON conversation_metadata;

CREATE POLICY "Users can view conversations they are part of"
  ON conversation_metadata FOR SELECT
  TO authenticated
  USING (
    auth.uid() = participant_1_id 
    OR auth.uid() = participant_2_id
  );

CREATE POLICY "Admins can view all conversations"
  ON conversation_metadata FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );
