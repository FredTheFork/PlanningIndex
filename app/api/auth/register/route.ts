import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb, hashPassword, newId, emptyProfile } from '@/lib/server/db';
import { setSessionCookie, createSession } from '@/lib/server/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, companyName } = body as {
      email?: string;
      password?: string;
      companyName?: string;
    };

    const normalizedEmail = (email || '').trim().toLowerCase();
    if (!companyName || !companyName.trim()) {
      return NextResponse.json({ error: 'Company name is required.' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    const db = getDb();
    if (db.users.some((u) => u.email === normalizedEmail)) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    const user = {
      id: newId(),
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    db.profiles[user.id] = emptyProfile(user.id, companyName.trim());

    // Team membership keyed by company owner's email — keep it simple: own team.
    saveDb();

    const token = createSession(user.id);
    const res = NextResponse.json({
      user: { id: user.id, email: user.email },
      redirect: '/choose-plan',
    });
    return setSessionCookie(res, token);
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
