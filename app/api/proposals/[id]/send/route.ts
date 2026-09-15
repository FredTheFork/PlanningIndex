import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import { getSessionUser, unauthorized, forbidden, hasFeatureAccess } from '@/lib/server/auth';
import { dispatchProposalMail, MailDispatchError } from '@/lib/server/mail';

interface Params {
  params: { id: string };
}

/**
 * Phase 44 — physical mail integration.
 * The frontend's only concern is POST /api/proposals/[id]/send with optional
 * recipient details; everything mail-provider-specific stays server-side.
 * On success the proposal is returned in its new delivery state.
 */
export async function POST(req: NextRequest, { params }: Params) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  if (!hasFeatureAccess(user.id, 'proposals'))
    return forbidden('Your plan does not include access to this feature.');

  try {
    const db = getDb();
    const proposal = db.proposals.find((p) => p.id === params.id && p.userId === user.id);
    if (!proposal) return NextResponse.json({ error: 'Proposal not found.' }, { status: 404 });

    const body = (await req.json().catch(() => ({}))) as {
      recipientName?: string;
      recipientAddress?: string;
      recipientPostcode?: string;
    };

    // Persist any recipient edits made in the send flow.
    if (body.recipientName) proposal.recipientName = body.recipientName;
    if (body.recipientAddress) proposal.recipientAddress = body.recipientAddress;
    if (body.recipientPostcode) proposal.recipientPostcode = body.recipientPostcode;

    if (proposal.sentDate) {
      return NextResponse.json(
        { error: 'This proposal has already been sent.', proposal },
        { status: 409 }
      );
    }
    if (proposal.status === 'Delivery issue' || proposal.status === 'Undeliverable') {
      return NextResponse.json(
        { error: 'This proposal has a delivery issue. Please resolve it before sending again.', proposal },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();
    let dispatch;
    try {
      dispatch = await dispatchProposalMail(proposal);
    } catch (err) {
      if (err instanceof MailDispatchError) {
        return NextResponse.json({ error: err.message }, { status: err.status });
      }
      return NextResponse.json(
        { error: 'We could not send this proposal. Please try again in a moment.' },
        { status: 502 }
      );
    }

    proposal.status = 'Sent';
    proposal.sentDate = now;
    proposal.updatedDate = now;
    proposal.deliveryIssueReason = null;
    proposal.trackingNumber = dispatch.trackingNumber;
    proposal.estimatedDeliveryDate = dispatch.estimatedDeliveryDate;
    saveDb();

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
    saveDb();

    return NextResponse.json({ proposal, provider: dispatch.provider });
  } catch {
    return NextResponse.json(
      { error: 'We could not send this proposal. Please try again in a moment.' },
      { status: 500 }
    );
  }
}
