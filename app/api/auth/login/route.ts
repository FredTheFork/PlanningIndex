import { NextRequest, NextResponse } from 'next/server';
import { getDb, verifyPassword } from '@/lib/server/db';
import { setSessionCookie, createSession, findSubscription } from '@/lib/server/auth';
import { rateLimit } from '@/lib/server/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // Brute-force protection: 10 attempts per IP per 5 minutes.
    const limited = rateLimit(req, 'login', 10, 5 * 60 * 1000);
    if (limited) return limited;

    const { email, password } = (await req.json()) as { email?: string; password?: string };
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const db = getDb();
    const user = db.users.find((u) => u.email === normalizedEmail);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = createSession(user.id);
    const subscription = findSubscription(user.id);
    const active =
      subscription &&
      (subscription.status === 'active' || subscription.status === 'trialing') &&
      !subscription.cancelAtPeriodEnd;

    const res = NextResponse.json({
      user: { id: user.id, email: user.email },
      redirect: active ? '/app' : '/choose-plan',
    });
    return setSessionCookie(res, token);
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
