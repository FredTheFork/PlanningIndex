import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, newId, type DbProposal } from '@/lib/server/db';
import { getSessionUser, unauthorized } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  const db = getDb();
  const leadId = req.nextUrl.searchParams.get('leadId');
  const proposals = db.proposals
    .filter((p) => p.userId === user.id && (!leadId || p.leadId === leadId))
    .sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  return NextResponse.json({ proposals });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    if (!body || !body.leadId || !body.projectTitle) {
      return NextResponse.json({ error: 'leadId and projectTitle are required.' }, { status: 400 });
    }

    const db = getDb();
    const lead = db.leads.find((l) => l.id === body.leadId && l.userId === user.id);
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });

    const now = new Date().toISOString();
    const proposal: DbProposal = {
      ...body,
      id: body.id && !db.proposals.some((p) => p.id === body.id) ? body.id : `proposal-${newId()}`,
      userId: user.id,
      status: body.status ?? 'Draft',
      createdDate: body.createdDate || now,
      updatedDate: now,
    };
    db.proposals.push(proposal);

    db.activities.push({
      id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      leadId: proposal.leadId,
      userId: user.id,
      type: 'proposal_created',
      title: 'Proposal created',
      description: `${proposal.reference} — ${proposal.projectTitle}`,
      timestamp: now,
      icon: 'file',
    });
    saveDb();

    return NextResponse.json({ proposal }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
