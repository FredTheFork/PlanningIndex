import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  if (!hasFeatureAccess(user.id, 'crm'))
    return forbidden('Your plan does not include access to this feature.');

  const db = getDb();
  const lead = db.leads.find((l) => l.id === params.id && l.userId === user.id);
  if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  return NextResponse.json({ lead });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  if (!hasFeatureAccess(user.id, 'crm'))
    return forbidden('Your plan does not include access to this feature.');

  try {
    const db = getDb();
    const lead = db.leads.find((l) => l.id === params.id && l.userId === user.id);
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    const body = await req.json();
    Object.assign(lead, body, { updatedAt: new Date().toISOString() });
    // Note: status-change activities are recorded by the client via
    // POST /api/activities (persisted + scoped server-side).
    saveDb();

    return NextResponse.json({ lead });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  if (!hasFeatureAccess(user.id, 'crm'))
    return forbidden('Your plan does not include access to this feature.');

  const db = getDb();
  const index = db.leads.findIndex((l) => l.id === params.id && l.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

  const leadId = db.leads[index].id;
  db.leads.splice(index, 1);
  db.activities = db.activities.filter((a) => !(a.leadId === leadId && a.userId === user.id));
  saveDb();

  return NextResponse.json({ success: true });
}
