/*
  # Add profile pictures to admin users

  1. New Columns
    - `admin_users.profile_picture_url` - URL to admin's profile picture
    - `admin_users.display_name` - Display name for the team member

  2. Changes
    - Allows admins to have profile pictures visible in chat interface
    - Display names for better personalization
*/

ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS profile_picture_url text;
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS display_name text DEFAULT 'Team';
