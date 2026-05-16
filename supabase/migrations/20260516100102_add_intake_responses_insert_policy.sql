/*
  # Add INSERT policy for intake_responses

  1. Problem
    - Users cannot create their own intake_responses row because there's no INSERT policy
    - The row is only created by the stripe-webhook, but if the user is an admin or
      the webhook fails, no row exists
    - The PersonalIntake component only does UPDATE, which silently fails when no row exists
    - This causes all form data to be lost when the user navigates away

  2. Fix
    - Add INSERT policy: users can insert their own intake_responses row
    - This allows the frontend to create the row on first save if it doesn't exist
*/

CREATE POLICY "Users can insert own intake responses"
  ON intake_responses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
