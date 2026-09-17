import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, newId, type DbLead } from '@/lib/server/db';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';
import { pickAllowed } from '@/lib/server/rate-limit';
import { LEAD_CREATABLE_FIELDS } from '@/lib/server/fields';

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return unauthorized();
  if (!(await hasFeatureAccess(user.id, 'crm')))
    return forbidden('Your plan does not include CRM access.');

  const db = await getDb();
  const leads = db.leads
    .filter((l) => l.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return unauthorized();
  if (!(await hasFeatureAccess(user.id, 'crm')))
    return forbidden('Your plan does not include CRM access.');

  try {
    const body = await req.json();
    if (!body || !body.propertyAddress) {
      return NextResponse.json({ error: 'Property address is required.' }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date().toISOString();
    const lead = {
      ...pickAllowed(body, LEAD_CREATABLE_FIELDS),
      id: `lead-${newId()}`,
      userId: user.id,
      status: body.status ?? 'New',
      createdAt: now,
      updatedAt: now,
    } as DbLead;
    db.leads.push(lead);
    await saveDb();

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
