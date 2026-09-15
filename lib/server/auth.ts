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

export function createSession(userId: string): string {
  const db = getDb();
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
  saveDb();
  return token;
}

export function getSessionUser(req: NextRequest): DbUser | null {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  const session = db.sessions.find((s) => s.token === token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return db.users.find((u) => u.id === session.userId) ?? null;
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
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

export function findSubscription(userId: string): DbSubscription | null {
  const db = getDb();
  return (
    db.subscriptions.find(
      (s) => s.userId === userId && s.status !== 'canceled' && !s.cancelAtPeriodEnd
    ) ??
    db.subscriptions.find((s) => s.userId === userId && s.status !== 'canceled') ??
    null
  );
}

export function buildSessionContext(user: DbUser): SessionContext {
  const db = getDb();
  const profile = db.profiles[user.id] ?? null;
  const subscription = findSubscription(user.id);
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

export function upsertSubscription(
  userId: string,
  planTier: string,
  billingCycle: string,
  status: 'active' | 'trialing' = 'active'
): DbSubscription {
  const db = getDb();
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === 'annual' ? 12 : 1));

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
  saveDb();
  return subscription;
}
