import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import type { ActivityType, ActivityIcon } from '@/lib/mock/lead-activity';
import { getSessionUser, unauthorized } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  const leadId = req.nextUrl.searchParams.get('leadId');
  const db = getDb();
  const activities = db.activities
    .filter((a) => a.userId === user.id && (!leadId || a.leadId === leadId))
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return NextResponse.json({ activities });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const { leadId, type, title, description, icon } = await req.json();
    if (!leadId || !type || !title) {
      return NextResponse.json({ error: 'leadId, type and title are required.' }, { status: 400 });
    }

    const db = getDb();
    const lead = db.leads.find((l) => l.id === leadId && l.userId === user.id);
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    const activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId,
      userId: user.id,
      type: type as ActivityType,
      title,
      description: description || '',
      timestamp: new Date().toISOString(),
      icon: (icon || 'plus') as ActivityIcon,
    };
    db.activities.push(activity);
    saveDb();

    return NextResponse.json({ activity }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
