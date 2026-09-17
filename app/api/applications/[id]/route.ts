// Single planning application by id — same plan gating as the search route.
//   GET /api/applications/[id]

import { NextRequest, NextResponse } from 'next/server';
import {
  isPlanningDataConfigured,
  getPlanningApplicationById,
} from '@/lib/server/planning-apps';
import { toSearchApplication, type PlanningAppRecord } from '@/lib/planning/enrich';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

  try {
    const row = await getPlanningApplicationById(params.id);
    if (!row) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    return NextResponse.json({
      application: toSearchApplication({
        ...(row as unknown as PlanningAppRecord),
        id: params.id,
      } as PlanningAppRecord),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Lookup failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
