import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getDb, saveDb, newId, type DbSubscription } from '@/lib/server/db';
import { getStripeClient, STRIPE_WEBHOOK_SECRET } from '@/lib/stripe';

// Stripe webhook — the single source of truth for subscription state.
// Access is granted HERE on checkout.session.completed, never when the
// checkout session is created (that only stores an `incomplete` record).
//
// Register this endpoint in the Stripe Dashboard as:
//   https://<site>/api/webhooks/stripe
// with events: checkout.session.completed, customer.subscription.updated,
//              customer.subscription.deleted, invoice.payment_failed

function mapStatus(status: Stripe.Subscription.Status): DbSubscription['status'] {
  if (status === 'active') return 'active';
  if (status === 'trialing') return 'trialing';
  if (status === 'canceled') return 'canceled';
  // past_due / unpaid / incomplete / incomplete_expired
  return 'past_due';
}

async function findSubscription(
  stripeSubscriptionId: string | null,
  stripeCustomerId: string | null,
  userId: string | null
): Promise<DbSubscription | undefined> {
  const db = await getDb();
  return (
    (stripeSubscriptionId &&
      db.subscriptions.find((s) => s.stripeSubscriptionId === stripeSubscriptionId)) ||
    (userId && db.subscriptions.find((s) => s.userId === userId)) ||
    (stripeCustomerId &&
      db.subscriptions.find((s) => s.stripeCustomerId === stripeCustomerId)) ||
    undefined
  );
}

function toIso(seconds: number | null | undefined): string {
  return new Date((seconds ?? 0) * 1000).toISOString();
}

function customerIdOf(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  return typeof customer === 'string' ? customer : null;
}

export async function POST(req: NextRequest) {
  if (!STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured' },
      { status: 503 }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const payload = await req.text();
  let event: Stripe.Event;
  try {
    event = await getStripeClient().webhooks.constructEventAsync(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription' || typeof session.subscription !== 'string') break;

        const stripe = getStripeClient();
        const sub = await stripe.subscriptions.retrieve(session.subscription);

        const db = await getDb();
        const userId = session.metadata?.user_id ?? null;
        let record = await findSubscription(
          sub.id,
          customerIdOf(session.customer),
          userId
        );

        if (!record) {
          if (!userId) break;
          record = {
            id: newId(),
            userId,
            planTier: session.metadata?.plan_tier ?? 'local',
            billingCycle: session.metadata?.billing_cycle ?? 'monthly',
            status: 'incomplete',
            currentPeriodEnd: new Date().toISOString(),
            cancelAtPeriodEnd: false,
          };
          db.subscriptions.push(record);
        }

        record.planTier = session.metadata?.plan_tier ?? record.planTier;
        record.billingCycle = session.metadata?.billing_cycle ?? record.billingCycle;
        record.status = mapStatus(sub.status);
        record.currentPeriodEnd = toIso(sub.current_period_end);
        record.cancelAtPeriodEnd = sub.cancel_at_period_end;
        record.stripeSubscriptionId = sub.id;
        record.stripeCustomerId = customerIdOf(sub.customer) ?? record.stripeCustomerId ?? null;
        await saveDb();
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const record = await findSubscription(sub.id, null, sub.metadata?.user_id ?? null);
        if (!record) break;

        record.status = mapStatus(sub.status);
        record.currentPeriodEnd = toIso(sub.current_period_end);
        record.cancelAtPeriodEnd = sub.cancel_at_period_end;
        if (sub.metadata?.plan_tier) record.planTier = sub.metadata.plan_tier;
        if (sub.metadata?.billing_cycle) record.billingCycle = sub.metadata.billing_cycle;
        await saveDb();
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const record = await findSubscription(sub.id, null, sub.metadata?.user_id ?? null);
        if (!record) break;

        record.status = 'canceled';
        record.cancelAtPeriodEnd = false;
        await saveDb();
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const record = await findSubscription(
          typeof invoice.subscription === 'string' ? invoice.subscription : null,
          customerIdOf(invoice.customer),
          null
        );
        if (!record) break;

        record.status = 'past_due';
        await saveDb();
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    // 500 makes Stripe retry the event.
    const message = err instanceof Error ? err.message : 'Webhook handler failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
