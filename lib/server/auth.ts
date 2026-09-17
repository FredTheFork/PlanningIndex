import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import {
  getDb,
  saveDb,
  newId,
  type DbUser,
  type DbProfile,
  type DbSubscription,
  type DbTeam,
} from './db';

export const SESSION_COOKIE = 'pi_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface Membership {
  planTier: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface Permissions {
  maxCouncils: number;
  crm: boolean;
  proposals: boolean;
  monthlyMailAllowance: number;
}

export interface SessionContext {
  user: { id: string; email: string };
  profile: DbProfile | null;
  membership: Membership | null;
  accessibleCouncils: string[];
  team: DbTeam | null;
  permissions: Permissions;
}

export function planPermissions(planTier: string | null): Permissions {
  switch (planTier) {
    case 'trial':
      // 14-day free trial — full product access, no card required.
      return { maxCouncils: 999, crm: true, proposals: true, monthlyMailAllowance: 50 };
    case 'national':
      return { maxCouncils: 999, crm: true, proposals: true, monthlyMailAllowance: 50 };
    case 'regional':
      return { maxCouncils: 10, crm: true, proposals: true, monthlyMailAllowance: 10 };
    case 'local':
      return { maxCouncils: 1, crm: true, proposals: false, monthlyMailAllowance: 0 };
    default:
      return { maxCouncils: 0, crm: false, proposals: false, monthlyMailAllowance: 0 };
  }
}

export async function createSession(userId: string): Promise<string> {
  const db = await getDb();
  const token = randomBytes(32).toString('hex');
  const now = Date.now();
  // Prune expired sessions while we're here.
  db.sessions = db.sessions.filter((s) => new Date(s.expiresAt).getTime() > now);
  db.sessions.push({
    token,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
  });
  await await saveDb();
  return token;
}

export async function getSessionUser(req: NextRequest): Promise<DbUser | null> {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = await getDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
}

export function forbidden(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 });
}

/**
 * A membership grants access when it is active (or trialing and not yet
 * expired) and not cancelled. Cardless free trials carry their own expiry in
 * `currentPeriodEnd`, so a trialing subscription past that date is inactive —
 * nothing external (Stripe webhooks) will ever flip its status.
 */
export function isSubscriptionActive(subscription: DbSubscription): boolean {
  if (subscription.cancelAtPeriodEnd) return false;
  if (subscription.status !== 'active' && subscription.status !== 'trialing') return false;
  if (
    subscription.status === 'trialing' &&
    new Date(subscription.currentPeriodEnd).getTime() <= Date.now()
  ) {
    return false;
  }
  return true;
}

/**
 * Backend enforcement of plan access. The frontend receives the same
 * permission set via /api/auth/session, but the API must independently
 * enforce it — an active membership is required, and the plan tier
 * determines which features (CRM, proposals) are available.
 */
export async function hasFeatureAccess(
  userId: string,
  feature: 'crm' | 'proposals'
): Promise<boolean> {
  const db = await getDb();
  const subscription = db.subscriptions.find(
    (s) => s.userId === userId && isSubscriptionActive(s)
  );
  if (!subscription) return false;
  return planPermissions(subscription.planTier)[feature];
}

export async function maxCouncilsFor(userId: string): Promise<number> {
  const db = await getDb();
  const subscription = db.subscriptions.find(
    (s) => s.userId === userId && isSubscriptionActive(s)
  );
  return planPermissions(subscription?.planTier ?? null).maxCouncils;
}

export function setSessionCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_MS / 1000,
    path: '/',
  });
  return res;
}

export function clearSessionCookie(res: NextResponse): NextResponse {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  return res;
}

export async function findSubscription(userId: string): Promise<DbSubscription | null> {
  const db = await getDb();
  return (
    db.subscriptions.find((s) => s.userId === userId && isSubscriptionActive(s)) ??
    db.subscriptions.find((s) => s.userId === userId && s.status !== 'canceled') ??
    null
  );
}

export async function buildSessionContext(user: DbUser): Promise<SessionContext> {
  const db = await getDb();
  const profile = db.profiles[user.id] ?? null;
  const subscription = await findSubscription(user.id);
  const membership: Membership | null = subscription
    ? {
        planTier: subscription.planTier,
        billingCycle: subscription.billingCycle,
        status: subscription.status,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      }
    : null;

  return {
    user: { id: user.id, email: user.email },
    profile,
    membership,
    accessibleCouncils: profile?.councils ?? [],
    team: db.teams.find((t) => t.members.some((m) => m.email === user.email)) ?? null,
    permissions: planPermissions(membership?.planTier ?? null),
  };
}

export async function upsertSubscription(
  userId: string,
  planTier: string,
  billingCycle: string,
  status: 'active' | 'trialing' = 'active',
  periodDays?: number
): Promise<DbSubscription> {
  const db = await getDb();
  const periodEnd = new Date();
  if (periodDays) {
    periodEnd.setDate(periodEnd.getDate() + periodDays);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'annual' ? 12 : 1));
  }

  let subscription = db.subscriptions.find((s) => s.userId === userId && s.status !== 'canceled');
  if (!subscription) {
    subscription = {
      id: newId(),
      userId,
      planTier,
      billingCycle,
      status,
      currentPeriodEnd: periodEnd.toISOString(),
      cancelAtPeriodEnd: false,
    };
    db.subscriptions.push(subscription);
  } else {
    subscription.planTier = planTier;
    subscription.billingCycle = billingCycle;
    subscription.status = status;
    subscription.currentPeriodEnd = periodEnd.toISOString();
    subscription.cancelAtPeriodEnd = false;
  }
  await await saveDb();
  return subscription;
}
