// Ingest endpoint for the UK planning scraper. Called by sync_to_pi.rb:
//   POST /api/ingest/planning-apps
//   Authorization: Bearer <PI_SYNC_KEY>
//   { "apps": [{ council_reference, authority_name, address, description,
//               status, decision, date_received, date_validated,
//               info_url, documents_url }, ...] }
// Upserts are idempotent on council_reference, so re-running the sync is
// safe. Batches should stay ≤ 1000 apps per request.

import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import {
  isPlanningDataConfigured,
  normalizeDate,
  upsertPlanningApplications,
  type PlanningAppInput,
} from '@/lib/server/planning-apps';

export const dynamic = 'force-dynamic';

const MAX_BATCH = 1000;

function text(value: unknown): string | null {
  if (value == null) return null;
  const s = String(value).trim();
  return s === '' ? null : s;
}

function isAuthorized(req: NextRequest): boolean {
  const key = process.env.PI_SYNC_KEY;
  if (!key || key === 'placeholder_not_configured') return false;
  const header = req.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!provided || provided.length !== key.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(key));
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isPlanningDataConfigured()) {
    return NextResponse.json(
      { error: 'Planning data store (Supabase) is not configured' },
      { status: 503 }
    );
  }

  let body: { apps?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const apps = Array.isArray(body.apps) ? body.apps : null;
  if (!apps || apps.length === 0) {
    return NextResponse.json({ error: 'Body must include a non-empty "apps" array' }, { status: 400 });
  }
  if (apps.length > MAX_BATCH) {
    return NextResponse.json(
      { error: `Batch too large (${apps.length}); send at most ${MAX_BATCH} apps per request` },
      { status: 400 }
    );
  }

  const errors: { council_reference: string; error: string }[] = [];
  const valid: PlanningAppInput[] = [];

  for (const [index, raw] of apps.entries()) {
    if (typeof raw !== 'object' || raw === null) {
      errors.push({ council_reference: `#${index}`, error: 'Not an object' });
      continue;
    }
    const a = raw as Record<string, unknown>;
    const councilReference = text(a.council_reference) ?? text(a.councilReference);
    if (!councilReference) {
      errors.push({ council_reference: `#${index}`, error: 'Missing council_reference' });
      continue;
    }
    valid.push({
      council_reference: councilReference,
      authority_name: text(a.authority_name ?? a.authorityName),
      address: text(a.address),
      description: text(a.description),
      status: text(a.status),
      decision: text(a.decision),
      date_received: normalizeDate(a.date_received ?? a.dateReceived),
      date_validated: normalizeDate(a.date_validated ?? a.dateValidated),
      info_url: text(a.info_url ?? a.infoUrl),
      documents_url: text(a.documents_url ?? a.documentsUrl),
    });
  }

  if (valid.length === 0) {
    return NextResponse.json({ processed: 0, errors }, { status: 400 });
  }

  try {
    const result = await upsertPlanningApplications(valid);
    return NextResponse.json({ processed: result.processed, errors: [...errors, ...result.errors] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ingest failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
