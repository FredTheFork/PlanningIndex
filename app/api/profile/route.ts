import { NextRequest, NextResponse } from 'next/server';
import { getDb, saveDb } from '@/lib/server/db';
import { getSessionUser, unauthorized } from '@/lib/server/auth';
import type { DbProfile } from '@/lib/server/db';

export async function GET(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();
  const db = getDb();
  return NextResponse.json({ profile: db.profiles[user.id] ?? null });
}

const EDITABLE_FIELDS: (keyof DbProfile)[] = [
  'companyName',
  'fullName',
  'phone',
  'addressLine1',
  'addressLine2',
  'city',
  'postcode',
  'companyEmail',
  'companyPhone',
  'website',
  'logoUrl',
  'vatNumber',
  'defaultSearchRadius',
  'defaultTradeTags',
  'notifNewApplications',
  'notifLeadUpdates',
  'notifProposalStatus',
  'notifFollowUpReminders',
  'councils',
];

export async function PATCH(req: NextRequest) {
  const user = getSessionUser(req);
  if (!user) return unauthorized();

  try {
    const body = await req.json();
    const db = getDb();
    const profile = db.profiles[user.id];
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });

    for (const field of EDITABLE_FIELDS) {
      if (field in body && body[field] !== undefined) {
        (profile as unknown as Record<string, unknown>)[field] = body[field];
      }
    }
    saveDb();

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
