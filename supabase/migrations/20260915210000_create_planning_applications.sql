/*
# Create planning_applications table

## Purpose
This migration creates the data layer for scraped UK planning applications.
`sync_to_pi.rb` pushes batches of scraped applications to
`POST /api/ingest/planning-apps`, which upserts them here (idempotent on
council_reference). The workspace search reads from this table through the
plan-gated `/api/applications` route.

## Table
### planning_applications
One row per council planning application, unique per council reference.
- `id` (uuid, primary key, default gen_random_uuid)
- `council_reference` (text, not null, unique — the council's own reference)
- `authority_name` (text, nullable — the local planning authority)
- `address` (text, nullable)
- `description` (text, nullable — the works description)
- `status` (text, nullable — raw council status)
- `decision` (text, nullable — raw council decision)
- `date_received` (timestamptz, nullable)
- `date_validated` (timestamptz, nullable)
- `info_url` (text, nullable — council portal page)
- `documents_url` (text, nullable — council documents page)
- `raw` (jsonb, nullable — the full scraped record for audit)
- `created_at` (timestamptz, default now)
- `updated_at` (timestamptz, default now)

## Indexes
- unique on `council_reference` (upsert conflict target)
- on `authority_name` (council filter)
- on `date_received` (date-range filter, newest-first sort)
- on `status`

## Security
- RLS enabled with no policies: only the service role (used by the
  server-side API routes) can read/write. No anon/authenticated access —
  all client access goes through plan-gated API routes.
*/

CREATE TABLE IF NOT EXISTS public.planning_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  council_reference text NOT NULL UNIQUE,
  authority_name text,
  address text,
  description text,
  status text,
  decision text,
  date_received timestamptz,
  date_validated timestamptz,
  info_url text,
  documents_url text,
  raw jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS planning_applications_council_reference_idx
  ON public.planning_applications (council_reference);

CREATE INDEX IF NOT EXISTS planning_applications_authority_name_idx
  ON public.planning_applications (authority_name);

CREATE INDEX IF NOT EXISTS planning_applications_date_received_idx
  ON public.planning_applications (date_received);

CREATE INDEX IF NOT EXISTS planning_applications_status_idx
  ON public.planning_applications (status);

ALTER TABLE public.planning_applications ENABLE ROW LEVEL SECURITY;
