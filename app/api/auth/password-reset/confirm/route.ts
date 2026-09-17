import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, hashPassword } from '@/lib/server/db';
import { rateLimit } from '@/lib/server/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 'password-reset-confirm', 10, 15 * 60 * 1000);
    if (limited) return limited;

    const { token, password } = (await req.json()) as { token?: string; password?: string };

    if (!token || !password) {
      return NextResponse.json({ error: 'Reset token and new password are required.' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const reset = db.passwordResets.find((r) => r.token === token && !r.used);
    if (!reset || new Date(reset.expiresAt).getTime() <= Date.now()) {
      return NextResponse.json(
        { error: 'This password reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const user = db.users.find((u) => u.id === reset.userId);
    if (!user) {
      return NextResponse.json({ error: 'Account not found.' }, { status: 404 });
    }

    user.passwordHash = hashPassword(password);
    reset.used = true;
    // Revoke all sessions — the user must sign in again with the new password.
    db.sessions = db.sessions.filter((s) => s.userId !== user.id);
    await saveDb();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
