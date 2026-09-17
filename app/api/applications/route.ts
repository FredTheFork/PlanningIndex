// Plan-gated search over real planning applications (Supabase Postgres).
//   GET /api/applications?keyword=&council=&status=&dateFrom=&page=&pageSize=
// Requires an authenticated session with an active membership (same gating
// as /api/leads). Returns UI-shaped SearchApplication records.

import { NextRequest, NextResponse } from 'next/server';
import {
  isPlanningDataConfigured,
  searchPlanningApplications,
} from '@/lib/server/planning-apps';
import { toSearchApplication } from '@/lib/planning/enrich';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';
import type { SearchApplication } from '@/lib/mock/applications';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return unauthorized();
  if (!(await hasFeatureAccess(user.id, 'crm')))
    return forbidden('Your plan does not include planning application search.');
  if (!isPlanningDataConfigured()) {
    return NextResponse.json(
      { error: 'Planning data store is not configured' },
      { status: 503 }
    );
  }

  const { searchParams } = new URL(req.url);
  let dateFrom: string | undefined;
  const rawDateFrom = searchParams.get('dateFrom');
  if (rawDateFrom) {
    const d = new Date(rawDateFrom);
    if (!Number.isNaN(d.getTime())) dateFrom = d.toISOString();
  }

  try {
    const page = await searchPlanningApplications({
      keyword: searchParams.get('keyword') ?? undefined,
      council: searchParams.get('council') ?? undefined,
      status: searchParams.get('status') ?? undefined,
      dateFrom,
      page: parseInt(searchParams.get('page') ?? '0', 10) || 0,
      pageSize: parseInt(searchParams.get('pageSize') ?? '100', 10) || 100,
    });

    const applications: SearchApplication[] = page.applications.map((row) =>
      toSearchApplication({
        id: (row as unknown as { id: string }).id ?? row.council_reference,
        council_reference: row.council_reference,
        authority_name: row.authority_name,
        address: row.address,
        description: row.description,
        status: row.status,
        decision: row.decision,
        date_received: row.date_received,
        date_validated: row.date_validated,
        info_url: row.info_url,
        documents_url: row.documents_url,
      })
    );

    return NextResponse.json({
      applications,
      total: page.total,
      page: page.page,
      pageSize: page.pageSize,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Search failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
