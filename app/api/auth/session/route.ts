import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, buildSessionContext } from '@/lib/server/auth';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json(buildSessionContext(user));
}
