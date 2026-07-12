/*
# Create admin_activity_log and admin_notes_entries tables

## 1. Purpose

This migration creates two new tables for the Foundationary admin system:

### admin_activity_log
A persistent audit trail of every admin action performed on a client account.
Every state-mutating operation (brief generation, document upload/delivery,
note changes, auto-delete settings, etc.) is recorded with the acting admin's
identity, the action type, a human-readable label, and optional JSON metadata.

### admin_notes_entries
A timeline-style note system replacing the single `admin_notes` text field on
`client_profiles`. Each note is a discrete entry with a category, pin flag,
and edit tracking — enabling a reverse-chronological timeline view in the
admin OverviewTab.

## 2. New Tables

### admin_activity_log
- `id` (uuid, primary key, auto-generated)
- `admin_id` (uuid, references auth.users, the admin who performed the action)
- `admin_email` (text, not null — denormalised for quick display without joins)
- `client_id` (uuid, references auth.users ON DELETE SET NULL — the affected client)
- `action_type` (text, not null — categorises the action, see CHECK constraint below)
- `action_label` (text, not null — human-readable description for display)
- `metadata` (jsonb, default '{}') — structured additional context (e.g. doc type, file kind, version)
- `created_at` (timestamptz, default now(), not null)

Indexes:
- `idx_admin_activity_log_client_id` on `client_id` — fast lookup per client
- `idx_admin_activity_log_created_at` on `created_at DESC` — chronological ordering
- `idx_admin_activity_log_admin_id` on `admin_id` — per-admin audit queries

### admin_notes_entries
- `id` (uuid, primary key, auto-generated)
- `client_id` (uuid, not null, references auth.users ON DELETE CASCADE)
- `admin_id` (uuid, not null, references auth.users)
- `admin_email` (text, not null — denormalised for display)
- `note_text` (text, not null)
- `category` (text, default 'general' — CHECK constraint: general, billing, intake, delivery, issue, resolved)
- `is_pinned` (boolean, default false)
- `created_at` (timestamptz, default now(), not null)
- `updated_at` (timestamptz, default now())

Indexes:
- `idx_admin_notes_entries_client_id` on `client_id` — fast lookup per client
- `idx_admin_notes_entries_created_at` on `created_at DESC` — chronological ordering

## 3. Security (RLS)

Both tables are admin-only. The existing admin RLS pattern uses JWT
`app_metadata.role = 'admin'` (established in migrations 20260515184448 and
20260515185103). Policies follow that pattern:

### admin_activity_log
- SELECT: admins only (role = 'admin')
- INSERT: admins only (role = 'admin')
- No UPDATE or DELETE policies — audit log entries are immutable once written.

### admin_notes_entries
- SELECT: admins only (role = 'admin')
- INSERT: admins only (role = 'admin')
- UPDATE: admins only (role = 'admin') — for editing note text / pinning
- DELETE: admins only (role = 'admin') — for note deletion

## 4. Important Notes

1. The `client_profiles.admin_notes` text column is NOT modified or removed.
   It remains as a legacy quick-note field. The OverviewTab will display both
   the new timeline and the legacy textarea.
2. The `action_type` CHECK constraint enforces a fixed vocabulary so the
   audit log stays queryable and consistent.
3. `admin_activity_log.client_id` uses ON DELETE SET NULL (not CASCADE) so
   deleting a user does not erase the audit history — the log entry remains
   with a null client_id.
4. `admin_notes_entries.client_id` uses ON DELETE CASCADE so notes are
   cleaned up when a client account is deleted.
5. All migrations are idempotent — uses IF NOT EXISTS and DROP POLICY IF EXISTS.
*/

-- ============================================================
-- admin_activity_log
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_activity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id),
  admin_email text NOT NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action_type text NOT NULL,
  action_label text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT chk_admin_activity_log_action_type CHECK (
    action_type IN (
      'brief_generated',
      'brief_regenerated',
      'brief_downloaded',
      'document_uploaded',
      'document_deleted',
      'document_delivered',
      'document_bulk_delivered',
      'zip_downloaded',
      'note_added',
      'note_edited',
      'note_deleted',
      'edit_access_granted',
      'auto_delete_set',
      'client_status_viewed',
      'intake_reviewed',
      'message_sent',
      'subscription_refresh_initiated',
      'file_replaced',
      'consistency_check_run',
      'completeness_check_run'
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_client_id ON admin_activity_log(client_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);

ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read activity log" ON admin_activity_log;
CREATE POLICY "Admins can read activity log"
  ON admin_activity_log FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

DROP POLICY IF EXISTS "Admins can insert activity log" ON admin_activity_log;
CREATE POLICY "Admins can insert activity log"
  ON admin_activity_log FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- ============================================================
-- admin_notes_entries
-- ============================================================

CREATE TABLE IF NOT EXISTS admin_notes_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL REFERENCES auth.users(id),
  admin_email text NOT NULL,
  note_text text NOT NULL,
  category text DEFAULT 'general' NOT NULL,
  is_pinned boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT chk_admin_notes_category CHECK (
    category IN ('general', 'billing', 'intake', 'delivery', 'issue', 'resolved')
  )
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entries_client_id ON admin_notes_entries(client_id);
CREATE INDEX IF NOT EXISTS idx_admin_notes_entries_created_at ON admin_notes_entries(created_at DESC);

ALTER TABLE admin_notes_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read notes entries" ON admin_notes_entries;
CREATE POLICY "Admins can read notes entries"
  ON admin_notes_entries FOR SELECT
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

DROP POLICY IF EXISTS "Admins can insert notes entries" ON admin_notes_entries;
CREATE POLICY "Admins can insert notes entries"
  ON admin_notes_entries FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

DROP POLICY IF EXISTS "Admins can update notes entries" ON admin_notes_entries;
CREATE POLICY "Admins can update notes entries"
  ON admin_notes_entries FOR UPDATE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin')
  WITH CHECK ((auth.jwt()->'app_metadata'->>'role') = 'admin');

DROP POLICY IF EXISTS "Admins can delete notes entries" ON admin_notes_entries;
CREATE POLICY "Admins can delete notes entries"
  ON admin_notes_entries FOR DELETE
  TO authenticated
  USING ((auth.jwt()->'app_metadata'->>'role') = 'admin');

-- ============================================================
-- updated_at trigger for admin_notes_entries
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_notes_entries_updated_at ON admin_notes_entries;
CREATE TRIGGER trg_admin_notes_entries_updated_at
  BEFORE UPDATE ON admin_notes_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
