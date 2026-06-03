/*
  # Fix conversation_id UUID type issue

  1. Changes
    - Change conversation_id from uuid to text type (or keep as uuid but generate properly)
    - Make conversation_id nullable on insert to let database generate it
    - Or: change to use text for conversation_id

  2. Issue
    - We're trying to insert "userid1_userid2" string but column expects UUID
    - Solution: Change conversation_id to text type
*/

-- Change conversation_id to text type
ALTER TABLE client_messages ALTER COLUMN conversation_id TYPE text;
ALTER TABLE conversation_metadata ALTER COLUMN conversation_id TYPE text;

-- Update the index
DROP INDEX IF EXISTS idx_messages_conversation;
CREATE INDEX idx_messages_conversation ON client_messages(conversation_id);
