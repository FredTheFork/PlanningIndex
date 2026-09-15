import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import { getSessionUser, clearSessionCookie, SESSION_COOKIE } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  let all = false;
  try {
    const body = await req.json();
    all = Boolean(body?.all);
  } catch {
    // No body — just log out the current session.
  }

  const db = getDb();
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  if (all) {
    // Sign out everywhere: revoke every session for this user.
    const user = getSessionUser(req);
    if (user) {
      db.sessions = db.sessions.filter((s) => s.userId !== user.id);
      saveDb();
    }
  } else if (token) {
    db.sessions = db.sessions.filter((s) => s.token !== token);
    saveDb();
  }

  return clearSessionCookie(NextResponse.json({ success: true }));
}
