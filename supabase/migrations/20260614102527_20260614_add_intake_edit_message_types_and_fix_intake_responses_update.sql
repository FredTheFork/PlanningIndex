/*
  # Fix intake edit control

  1. Add 'intake_edit_request' and 'intake_edit_granted' to client_messages.message_type CHECK constraint
  2. Add UPDATE policy for clients to update their own intake_responses 
     (for setting edit_requested_at — currently only UPDATE policy requires is_admin() 
     OR auth.uid() = user_id, but we need to verify no additional restrictions)
*/

-- Drop the existing CHECK constraint and recreate with new message types
ALTER TABLE client_messages DROP CONSTRAINT IF EXISTS client_messages_message_type_check;
ALTER TABLE client_messages ADD CONSTRAINT client_messages_message_type_check 
  CHECK (message_type IN ('general', 'document_query', 'intake_query', 'client_initiated', 'intake_edit_request', 'intake_edit_granted'));

-- Verify the existing UPDATE policy on intake_responses allows users to update their own row
-- (it does: "Users can update own intake responses" USING auth.uid() = user_id)
-- No additional migration needed for that
