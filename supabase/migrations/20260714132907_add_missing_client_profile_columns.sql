/*
# Add missing columns to client_profiles

## Problem
The seed-test-client edge function inserts `email`, `business_name`, `full_name`, and `phone`
into `client_profiles`, but those columns don't exist. PostgREST rejects the insert,
the error is swallowed, and the function reports success despite no row being created.

## Changes
1. Adds four columns to `client_profiles`:
   - `email` (text, nullable) — the client's email (mirrors auth.users.email for convenience)
   - `business_name` (text, nullable) — trading name shown in the admin dashboard
   - `full_name` (text, nullable) — legal name of the client
   - `phone` (text, nullable) — contact phone number

## Security
- No RLS policy changes. Existing policies remain intact.
- All columns are nullable so existing rows are unaffected.
*/

ALTER TABLE client_profiles
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS business_name text,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS phone text;