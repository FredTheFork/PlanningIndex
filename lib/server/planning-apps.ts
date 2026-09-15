// Server-side data access for the planning_applications table (Supabase
// Postgres). Uses the service-role key — this module is only imported by
// API routes, never shipped to the client. When Supabase is not configured
// the routes return 503 (same pattern as the Stripe helpers in lib/stripe).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { normalizeSupabaseUrl } from '@/lib/supabase/url';

const SUPABASE_URL = normalizeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const isPlaceholder = (v: string) =>
  !v || v === 'placeholder_not_configured' || v.includes('placeholder.supabase.co');

export function isPlanningDataConfigured(): boolean {
  return !isPlaceholder(SUPABASE_URL) && !isPlaceholder(SERVICE_ROLE_KEY);
}

let client: SupabaseClient | null = null;

export function getPlanningDb(): SupabaseClient {
  if (!isPlanningDataConfigured()) {
    throw new Error('Planning data store is not configured.');
  }
  client ??= createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

// ---------------------------------------------------------------------------
// Ingest (called by /api/ingest/planning-apps)
// ---------------------------------------------------------------------------

export interface PlanningAppInput {
  council_reference: string;
  authority_name: string | null;
  address: string | null;
  description: string | null;
  status: string | null;
  decision: string | null;
  date_received: string | null; // ISO
  date_validated: string | null; // ISO
  info_url: string | null;
  documents_url: string | null;
}

/** Best-effort date normalization — invalid/unparseable dates become null. */
export function normalizeDate(value: unknown): string | null {
  if (value == null || value === '') return null;
  if (typeof value === 'number') {
    const d = new Date(value < 1e12 ? (value as number) * 1000 : (value as number));
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  if (typeof value !== 'string') return null;
  const d = new Date(value.trim());
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// Upsert is atomic per batch: on a Postgres error nothing is written and
// the error is thrown so callers can retry the whole batch (sync_to_pi.rb
// retries with backoff on HTTP 5xx).
export async function upsertPlanningApplications(apps: PlanningAppInput[]): Promise<number> {
  const db = getPlanningDb();
  const now = new Date().toISOString();

  const rows = apps.map((a) => ({
    council_reference: a.council_reference,
    authority_name: a.authority_name,
    address: a.address,
    description: a.description,
    status: a.status,
    decision: a.decision,
    date_received: a.date_received,
    date_validated: a.date_validated,
    info_url: a.info_url,
    documents_url: a.documents_url,
    raw: a,
    updated_at: now,
  }));

  const { error } = await db
    .from('planning_applications')
    .upsert(rows, { onConflict: 'council_reference' });

  if (error) throw new Error(error.message);
  return rows.length;
}

// ---------------------------------------------------------------------------
// Search (called by /api/applications)
// ---------------------------------------------------------------------------

export interface SearchQuery {
  keyword?: string;
  council?: string; // authority_name (exact, case-insensitive)
  status?: string; // raw status (case-insensitive)
  dateFrom?: string; // ISO — inclusive lower bound on date_received
  page?: number;
  pageSize?: number;
}

export interface SearchPage {
  applications: PlanningAppInput[];
  ids: string[];
  total: number;
  page: number;
  pageSize: number;
}

export async function searchPlanningApplications(query: SearchQuery): Promise<SearchPage> {
  const db = getPlanningDb();
  const page = Math.max(0, (query.page ?? 0) | 0);
  const pageSize = Math.min(500, Math.max(1, query.pageSize ?? 100));
  const from = page * pageSize;

  let req = db
    .from('planning_applications')
    .select(
      'id, council_reference, authority_name, address, description, status, decision, date_received, date_validated, info_url, documents_url',
      { count: 'exact' }
    )
    .order('date_received', { ascending: false, nullsFirst: false })
    .range(from, from + pageSize - 1);

  if (query.keyword?.trim()) {
    const kw = `%${query.keyword.trim()}%`;
    req = req.or(
      `description.ilike.${kw},address.ilike.${kw},council_reference.ilike.${kw},authority_name.ilike.${kw}`
    );
  }
  if (query.council && query.council !== 'all') {
    req = req.ilike('authority_name', query.council);
  }
  if (query.status && query.status !== 'all') {
    req = req.ilike('status', query.status);
  }
  if (query.dateFrom) {
    req = req.gte('date_received', query.dateFrom);
  }

  const { data, error, count } = await req;
  if (error) throw new Error(error.message);

  return {
    applications: (data ?? []) as PlanningAppInput[],
    ids: (data ?? []).map((r: { id: string }) => r.id),
    total: count ?? 0,
    page,
    pageSize,
  };
}

export async function getPlanningApplicationById(id: string): Promise<PlanningAppInput | null> {
  const db = getPlanningDb();
  const { data, error } = await db
    .from('planning_applications')
    .select(
      'id, council_reference, authority_name, address, description, status, decision, date_received, date_validated, info_url, documents_url'
    )
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as PlanningAppInput & { id: string }) ?? null;
}
