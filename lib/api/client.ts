'use client';

// Client-side helpers for the app's own API layer (Phase 38 integration).
// All authenticated calls rely on the httpOnly session cookie.

export interface AuthUser {
  id: string;
  email: string;
}

export interface ProfileData {
  userId: string;
  companyName: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  companyEmail: string;
  companyPhone: string;
  website: string;
  logoUrl: string;
  vatNumber: string;
  defaultSearchRadius: string;
  defaultTradeTags: string[];
  notifNewApplications: boolean;
  notifLeadUpdates: boolean;
  notifProposalStatus: boolean;
  notifFollowUpReminders: boolean;
  councils: string[];
}

export interface MembershipData {
  planTier: string;
  billingCycle: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export interface PermissionsData {
  maxCouncils: number;
  crm: boolean;
  proposals: boolean;
  monthlyMailAllowance: number;
}

export interface TeamData {
  id: string;
  name: string;
  members: { email: string; role: string }[];
}

export interface SessionContext {
  user: AuthUser;
  profile: ProfileData | null;
  membership: MembershipData | null;
  accessibleCouncils: string[];
  team: TeamData | null;
  permissions: PermissionsData;
}

export async function getSession(): Promise<SessionContext | null> {
  try {
    const res = await fetch('/api/auth/session', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as { user: AuthUser | null } & SessionContext;
    return data.user ? data : null;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<ProfileData | null> {
  const session = await getSession();
  return session?.profile ?? null;
}

export async function updateProfile(patch: Partial<ProfileData>): Promise<ProfileData | null> {
  try {
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return null;
    return (await res.json()).profile ?? null;
  } catch {
    return null;
  }
}
