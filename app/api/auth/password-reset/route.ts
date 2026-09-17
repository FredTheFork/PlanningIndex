import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { getDb, saveDb } from '@/lib/server/db';
import { rateLimit } from '@/lib/server/rate-limit';

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://planningindex.co.uk';
const EMAIL_FROM =
  process.env.RESET_EMAIL_FROM || 'PlanningIndex <onboarding@resend.dev>';

/**
 * Send the reset link by email via Resend (https://resend.com). Uses plain
 * fetch — no extra dependency. Enabled by setting RESEND_API_KEY; in that case
 * the from-address must be a Resend-verified domain (RESET_EMAIL_FROM), e.g.
 * "PlanningIndex <noreply@planningindex.co.uk>".
 */
async function sendResetEmail(to: string, resetUrl: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to,
      subject: 'Reset your PlanningIndex password',
      html: `
        <p>Hello,</p>
        <p>We received a request to reset your PlanningIndex password. This link is valid for one hour:</p>
        <p><a href="${SITE_URL}${resetUrl}">Reset your password</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>— The PlanningIndex team</p>
      `,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend responded ${res.status}: ${detail.slice(0, 200)}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const limited = rateLimit(req, 'password-reset', 5, 15 * 60 * 1000);
    if (limited) return limited;

    const { email } = (await req.json()) as { email?: string };
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const db = await getDb();
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
    await saveDb();

    const resetUrl = `/reset-password?token=${token}`;

    if (process.env.NODE_ENV === 'production') {
      // NEVER return the reset link in the API response on a live site — that
      // would let anyone take over any account by requesting a reset for it.
      if (process.env.RESEND_API_KEY) {
        try {
          await sendResetEmail(user.email, resetUrl);
        } catch (err) {
          console.error('[password-reset] email delivery failed:', err);
        }
      } else {
        // No email provider configured — log the link server-side so the
        // operator can still recover access. Set RESEND_API_KEY to deliver
        // real reset emails.
        console.warn(`[password-reset] No RESEND_API_KEY configured. Reset link for ${user.email}: ${SITE_URL}${resetUrl}`);
      }
      return NextResponse.json({ success: true });
    }

    // Development flow: no email provider, so the link is returned directly.
    return NextResponse.json({ success: true, resetUrl });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
