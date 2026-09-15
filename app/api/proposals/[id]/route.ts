import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import type { ProposalStatus } from '@/lib/mock/proposals';
import { getSessionUser, unauthorized } from '@/lib/server/auth';

interface Params {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  const db = getDb();
  const proposal = db.proposals.find((p) => p.id === params.id && p.userId === user.id);
  if (!proposal) return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });
  return NextResponse.json({ proposal });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const db = getDb();
    const proposal = db.proposals.find((p) => p.id === params.id && p.userId === user.id);
    if (!proposal) return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });

    const body = await req.json();
    const oldStatus = proposal.status;
    const newStatus = (body.status ?? oldStatus) as ProposalStatus;
    const now = new Date().toISOString();

    Object.assign(proposal, body);
    proposal.updatedDate = now;

    // Server owns the send / delivery state machine (Phase 43: send & track).
    if (newStatus !== oldStatus) {
      proposal.status = newStatus;

      if (newStatus === 'Sent' && !proposal.sentDate) {
        proposal.sentDate = now;
        proposal.deliveryIssueReason = null;
        proposal.trackingNumber = `RM-TRK-${Math.floor(Math.random() * 900000 + 100000)}`;
        const est = new Date();
        est.setDate(est.getDate() + 3);
        proposal.estimatedDeliveryDate = est.toISOString();
        db.activities.push({
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          leadId: proposal.leadId,
          userId: user.id,
          type: 'proposal_sent',
          title: 'Proposal sent by post',
          description: `${proposal.reference} sent to ${proposal.recipientAddress}`,
          timestamp: now,
          icon: 'send',
        });
      }
      if (newStatus === 'Mailed' && !proposal.mailedDate) {
        proposal.mailedDate = now;
      }
      if (newStatus === 'Delivered' && !proposal.deliveredDate) {
        proposal.deliveredDate = now;
        db.activities.push({
          id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          leadId: proposal.leadId,
          userId: user.id,
          type: 'proposal_delivered',
          title: 'Proposal delivered',
          description: `${proposal.reference} delivered to ${proposal.recipientAddress}`,
          timestamp: now,
          icon: 'package',
        });
      }
    }
    saveDb();

    return NextResponse.json({ proposal });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  const db = getDb();
  const index = db.proposals.findIndex((p) => p.id === params.id && p.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });

  db.proposals.splice(index, 1);
  saveDb();
  return NextResponse.json({ success: true });
}
