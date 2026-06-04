/*
  # Fix Messaging RLS Policies for Realtime Compatibility

  1. Problem
    - Admin-side messages were not appearing in real-time or on load
    - Supabase Realtime cannot reliably evaluate RLS policies that use
      EXISTS subqueries to other tables (e.g., admin_users)
    - The existing "Admins can view all messages" policy uses EXISTS which
      silently fails during Realtime broadcast evaluation
    - Multiple overlapping SELECT policies (3 total) create confusion
      and potential evaluation conflicts

  2. Solution
    - Consolidate all 3 admin SELECT policies into a single clean policy
      that uses only the is_admin() helper function (which checks JWT
      claims directly, no subqueries to other tables)
    - Remove the EXISTS subquery-based policy entirely
    - Remove the separate JWT-only policy (is_admin() already covers it)
    - Keep the participant-based policy (sender_id/recipient_id) as the
      most reliable for Realtime since it uses direct column comparison
    - Add explicit admin INSERT and UPDATE policies
    - Consolidate all UPDATE policies similarly

  3. Security
    - No security weakening: is_admin() checks JWT app_metadata.role
      and falls back to email check, same as before
    - The participant-based policy is preserved for non-admin users
    - Admin can still see all messages (via is_admin())
    - Admin can insert messages when authenticated as themselves
*/

-- ============================================================
-- Step 1: Clean up all existing client_messages policies
-- ============================================================
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON client_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON client_messages;
DROP POLICY IF EXISTS "Admins can view all messages via JWT" ON client_messages;
DROP POLICY IF EXISTS "Users can insert messages as sender" ON client_messages;
DROP POLICY IF EXISTS "Users can update read status on their messages" ON client_messages;
DROP POLICY IF EXISTS "Admins can update all messages" ON client_messages;
DROP POLICY IF EXISTS "Service role can read all messages" ON client_messages;

-- ============================================================
-- Step 2: Create clean, Realtime-compatible SELECT policies
-- ============================================================

-- Primary SELECT: participants can see their own conversation messages
-- Uses only auth.uid() = column comparison (most reliable for Realtime)
CREATE POLICY "Participants can view their messages"
  ON client_messages FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

-- Admin SELECT: uses is_admin() which checks JWT claims directly
-- No subqueries to other tables - fully Realtime compatible
CREATE POLICY "Admins can view all messages via role"
  ON client_messages FOR SELECT
  TO authenticated
  USING (is_admin());

-- Service role SELECT
CREATE POLICY "Service role can read all messages"
  ON client_messages FOR SELECT
  TO service_role
  USING (true);

-- ============================================================
-- Step 3: Create clean INSERT policies
-- ============================================================

-- Users (including admins) can insert messages as themselves
CREATE POLICY "Authenticated users can send messages as themselves"
  ON client_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- ============================================================
-- Step 4: Create clean UPDATE policies
-- ============================================================

-- Recipients can mark messages as read
CREATE POLICY "Recipients can mark messages as read"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = recipient_id);

-- Admins can update any message (e.g., mark as read from admin side)
CREATE POLICY "Admins can update all messages"
  ON client_messages FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
