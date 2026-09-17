// Serverless persistence for the app's JSON state (users, sessions, profiles,
// subscriptions, CRM data). On hosts with a read-only filesystem (Vercel
// serverless functions) the file store in db.ts cannot be written, so when
// Supabase credentials are present the whole state is persisted to a single
// `app_state` row (service-role only — RLS enabled, no policies).
//
// This module is imported by db.ts only, never shipped to the client.
// When Supabase is not configured, db.ts falls back to the local file store.

import { normalizeSupabaseUrl } from '@/lib/supabase/url';
import type { Database } from './db';

const APP_STATE_ROW_ID = 'default';

const SUPABASE_URL = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isPlaceholder = (v: string) =>
  !v || v === 'placeholder_not_configured' || v.includes('placeholder.supabase.co');

export function isAppStateConfigured(): boolean {
  return !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SERVICE_ROLE_KEY);
}

function authHeaders(): Record<string, string> {
  return {
    apikey: SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Load the persisted state. Returns null when the row does not exist yet
 * (fresh table — the caller seeds it). Throws with an actionable message when
 * the table is missing or the request fails — never silently falls back to
 * seed data, which would overwrite real users with a fresh database on save.
 */
export async function loadAppState(): Promise<Database | null> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/app_state?id=eq.${APP_STATE_ROW_ID}&select=data`,
    { headers: authHeaders(), signal: AbortSignal.timeout(10_000) }
  );
  if (res.status === 404) {
    throw new Error(
      'Supabase table "app_state" does not exist. Apply supabase/migrations/20260917190000_create_app_state.sql to the hosted Supabase project.'
    );
  }
  if (!res.ok) {
    throw new Error(`Failed to load app state from Supabase (HTTP ${res.status}).`);
  }
  const rows = (await res.json()) as { data: Database }[];
  return rows.length > 0 ? rows[0].data : null;
}

/** Upsert the state row (last write wins — see AGENTS.md concurrency note). */
export async function saveAppState(db: Database): Promise<void> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/app_state`, {
    method: 'POST',
    headers: { ...authHeaders(), Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      id: APP_STATE_ROW_ID,
      data: db,
      updated_at: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Failed to save app state to Supabase (HTTP ${res.status}). ${detail.slice(0, 200)}`);
  }
}
