import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, newId, type DbLead } from '@/lib/server/db';
import { getSessionUser, unauthorized } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  const db = getDb();
  const leads = db.leads
    .filter((l) => l.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ leads });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    if (!body || !body.propertyAddress) {
      return NextResponse.json({ error: 'Property address is required.' }, { status: 400 });
    }

    const db = getDb();
    const now = new Date().toISOString();
    const lead: DbLead = {
      ...body,
      id: `lead-${newId()}`,
      userId: user.id,
      status: body.status ?? 'New',
      createdAt: now,
      updatedAt: now,
    };
    db.leads.push(lead);
    saveDb();

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
