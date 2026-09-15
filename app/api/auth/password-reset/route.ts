import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getDb, saveDb } from '@/lib/server/db';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string };
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const db = getDb();
    const user = db.users.find((u) => u.email === normalizedEmail);
    if (!user) {
      // Don't leak whether the account exists.
      return NextResponse.json({ success: true });
    }

    const token = randomBytes(32).toString('hex');
    db.passwordResets.push({
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TTL_MS).toISOString(),
      used: false,
    });
    saveDb();

    // No email provider is configured in this environment, so the reset link
    // is returned to the caller for the local development flow.
    return NextResponse.json({ success: true, resetUrl: `/reset-password?token=${token}` });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
