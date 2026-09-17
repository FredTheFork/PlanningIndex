import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, hashPassword } from '@/lib/server/db';
import { getSessionUser, unauthorized, SESSION_COOKIE } from '@/lib/server/auth';

export async function PATCH(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const { newPassword } = (await req.json()) as { newPassword?: string };
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const db = await getDb();
    user.passwordHash = hashPassword(newPassword);
    // Revoke all other sessions (they may be on other devices).
    db.sessions = db.sessions.filter(
      (s) => s.userId !== user.id || s.token === req.cookies.get(SESSION_COOKIE)?.value
    );
    await saveDb();

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
