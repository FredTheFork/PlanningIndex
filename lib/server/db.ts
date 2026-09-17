import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { randomUUID, randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { isAppStateConfigured, loadAppState, saveAppState } from './app-state';
import type { Lead } from '@/lib/mock/leads';
import type { LeadActivity } from '@/lib/mock/lead-activity';
import type { Proposal } from '@/lib/mock/proposals';
import { mockLeads } from '@/lib/mock/leads';
import { mockActivities } from '@/lib/mock/lead-activity';
import { mockProposals } from '@/lib/mock/proposals';

// ---------------------------------------------------------------------------
// Local persistent data store (dev-mode backend for the integrated app).
// The file lives in .data/ (gitignored) and survives container restarts.
// When hosted Supabase/Stripe credentials are provided, those services take
// over for auth/payments; this store remains the CRM backend.
// ---------------------------------------------------------------------------

export interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
}

export interface DbProfile {
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

export interface DbSubscription {
  id: string;
  userId: string;
  planTier: string;
  billingCycle: string;
  status: 'active' | 'trialing' | 'past_due' | 'incomplete' | 'canceled';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
}

export interface DbSession {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export interface DbPasswordReset {
  token: string;
  userId: string;
  expiresAt: string;
  used: boolean;
}

export interface DbTeamMember {
  email: string;
  role: 'owner' | 'admin' | 'member';
}

export interface DbTeam {
  id: string;
  name: string;
  members: DbTeamMember[];
}

export type DbLead = Lead & { userId: string };
export type DbActivity = LeadActivity & { userId: string };
export type DbProposal = Proposal & { userId: string };

export interface Database {
  users: DbUser[];
  profiles: Record<string, DbProfile>;
  sessions: DbSession[];
  passwordResets: DbPasswordReset[];
  subscriptions: DbSubscription[];
  teams: DbTeam[];
  leads: DbLead[];
  activities: DbActivity[];
  proposals: DbProposal[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_PATH = path.join(DATA_DIR, 'db.json');

let cachedDb: Database | null = null;
let initPromise: Promise<Database> | null = null;

// Loads once, then serves from the in-memory cache. On serverless hosts
// (Vercel) with Supabase configured the state is fetched over HTTP; without
// credentials (local dev) it loads synchronously from the file store.
async function initializeDb(): Promise<Database> {
  if (isAppStateConfigured()) {
    const remote = await loadAppState();
    cachedDb = remote ?? seedDatabase();
    if (!remote) await saveAppState(cachedDb); // bootstrap the empty row
    return cachedDb;
  }
  if (existsSync(DB_PATH)) {
    cachedDb = JSON.parse(readFileSync(DB_PATH, 'utf8')) as Database;
    return cachedDb;
  }
  cachedDb = seedDatabase();
  await saveDb();
  return cachedDb;
}

export function getDb(): Promise<Database> {
  initPromise ??= initializeDb().catch((err) => {
    // Allow a later request to retry after a transient failure.
    initPromise = null;
    throw err;
  });
  return initPromise;
}

export async function saveDb(): Promise<void> {
  const db = cachedDb;
  if (!db) return;
  if (isAppStateConfigured()) {
    await saveAppState(db);
    return;
  }
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// --- Passwords -------------------------------------------------------------

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, 'hex');
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

export function newId(): string {
  return randomUUID();
}

// --- Seeding ---------------------------------------------------------------

const DEMO_EMAIL = 'demo@planningindex.co.uk';
const DEMO_PASSWORD = 'demo1234!';

export function emptyProfile(userId: string, companyName: string): DbProfile {
  return {
    userId,
    companyName,
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postcode: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    logoUrl: '',
    vatNumber: '',
    defaultSearchRadius: '25',
    defaultTradeTags: [],
    notifNewApplications: true,
    notifLeadUpdates: true,
    notifProposalStatus: true,
    notifFollowUpReminders: true,
    councils: [],
  };
}

function seedDatabase(): Database {
  const now = new Date().toISOString();
  const demoId = newId();

  const periodEnd = new Date();
  periodEnd.setDate(periodEnd.getDate() + 30);

  const db: Database = {
    users: [
      {
        id: demoId,
        email: DEMO_EMAIL,
        passwordHash: hashPassword(DEMO_PASSWORD),
        createdAt: now,
      },
    ],
    profiles: {
      [demoId]: {
        ...emptyProfile(demoId, 'Thames Construction Ltd'),
        fullName: 'Dan Carter',
        addressLine1: '14 Industrial Park',
        city: 'Uxbridge',
        postcode: 'UB8 1AB',
        companyPhone: '01895 123456',
        companyEmail: 'info@thames.co.uk',
        vatNumber: 'GB123456789',
        councils: ['Buckinghamshire', 'Hertfordshire', 'Greater London'],
      },
    },
    sessions: [],
    passwordResets: [],
    subscriptions: [
      {
        id: newId(),
        userId: demoId,
        planTier: 'regional',
        billingCycle: 'monthly',
        status: 'active',
        currentPeriodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: false,
      },
    ],
    teams: [
      {
        id: newId(),
        name: 'Thames Construction Ltd',
        members: [
          { email: DEMO_EMAIL, role: 'owner' },
          { email: 'office@thames.co.uk', role: 'member' },
        ],
      },
    ],
    leads: mockLeads.map((lead) => ({ ...lead, userId: demoId })),
    activities: mockActivities.map((activity) => ({ ...activity, userId: demoId })),
    proposals: mockProposals.map((proposal) => ({ ...proposal, userId: demoId })),
  };

  return db;
}
