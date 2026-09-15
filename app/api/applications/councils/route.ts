// Distinct authority names present in planning_applications — powers the
// council filter dropdown with real authorities instead of a fixed list.
//   GET /api/applications/councils

import { NextRequest, NextResponse } from 'next/server';
import { isPlanningDataConfigured, getPlanningDb } from '@/lib/server/planning-apps';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  if (!hasFeatureAccess(user.id, 'crm'))
    return forbidden('Your plan does not include planning application search.');
  if (!isPlanningDataConfigured()) {
    return NextResponse.json(
      { error: 'Planning data store is not configured' },
      { status: 503 }
    );
  }

  try {
    const { data, error } = await getPlanningDb()
      .from('planning_applications')
      .select('authority_name')
      .not('authority_name', 'is', null)
      .order('authority_name', { ascending: true })
      .limit(1000);

    if (error) throw new Error(error.message);

    const councils = [...new Set((data ?? []).map((r) => r.authority_name as string))];
    return NextResponse.json({ councils });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load councils';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
