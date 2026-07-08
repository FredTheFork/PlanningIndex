# Foundationary Codebase Navigation Index

This document helps AI agents navigate the codebase without loading everything into context.

## Project Overview

Foundationary is a Next.js 14 App Router application with TypeScript, Supabase (PostgreSQL, Auth, Storage, Edge Functions), Stripe payments, and Tailwind CSS.

**Business Domain**: UK sole trader document drafting service with three service tiers (Foundation, Operations, Industry).

---

## Quick Reference

| What you need | Where to find it |
|---------------|------------------|
| Service definitions & pricing | `lib/services/service-catalog.ts` |
| Intake form questions | `lib/forms/intake-definition.ts` |
| Form validation schemas | `lib/forms/validations.ts` |
| Stripe configuration | `lib/stripe/config.ts` |
| Supabase client | `lib/supabase/client.ts` |
| Admin dashboard queries | `lib/admin/dashboard-queries.ts` |
| Edge functions | `supabase/functions/*/index.ts` |

---

## Directory Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes (OG image, IndexNow)
│   ├── auth/callback/        # Supabase auth callback
│   ├── blog/                 # Blog pages and articles
│   ├── checkout/             # Checkout flow (page.tsx = main)
│   ├── contact/              # Contact page
│   ├── for/                  # Industry-specific landing pages
│   │   ├── coaches/
│   │   ├── consultants/
│   │   ├── contractors/
│   │   └── photographers/
│   ├── how-it-works/
│   ├── login/
│   ├── personal/             # Authenticated user area
│   │   ├── admin/            # Admin dashboard
│   │   │   └── [userId]/     # Per-client admin view
│   │   │       └── tabs/     # Admin tab components (12 tabs)
│   │   ├── documents/        # Client documents view
│   │   ├── industry/         # Client industry pack view
│   │   ├── intake/           # Intake form page
│   │   ├── messages/         # Client messaging
│   │   ├── operations/       # Client operations packs view
│   │   ├── posts/            # Social media posts
│   │   ├── settings/         # Client settings
│   │   ├── status/           # Order status
│   │   └── website/          # Website copy view
│   ├── pricing/              # Pricing page
│   ├── services/             # Service detail pages
│   │   ├── bundles/
│   │   ├── documents/
│   │   ├── foundation/
│   │   ├── industry/
│   │   ├── operations/
│   │   ├── quarterly-refresh/
│   │   ├── social-media/
│   │   └── website-copy/
│   ├── success/              # Post-checkout success
│   └── whats-included/       # Whats included page
│
├── components/               # React components
│   ├── admin/                # Admin-specific components
│   ├── intake/               # Intake wizard components
│   ├── layout/                # Layout components (Navbar, etc.)
│   ├── sections/              # Page sections (Hero, etc.)
│   ├── seo/                   # SEO components
│   └── ui/                    # Reusable UI components
│       ├── AnimatedGraphs.tsx    # Bar, pie, line charts, counter
│       ├── ChatBubble.tsx        # Chat-style message bubbles
│       ├── DocumentPreview.tsx   # Document preview modal
│       ├── DocumentShowcase.tsx  # Document cards, carousels
│       ├── GapAnalysis.tsx       # Gap analysis visualization
│       ├── SavingsCalculator.tsx # ROI/savings calculators
│       └── TrustVisualization.tsx # Trust badges, stats bars
│
├── lib/                      # Core business logic
│   ├── admin/
│   │   └── dashboard-queries.ts  # Admin data fetching, CSV export
│   ├── content/
│   │   ├── articleContent.tsx    # Blog article content (~3300 lines)
│   │   ├── articles.ts           # Article metadata
│   │   └── faq-data.ts           # FAQ data
│   ├── forms/
│   │   ├── build-intake-form.ts  # Form assembly logic
│   │   ├── conditional-logic.ts  # Field visibility logic
│   │   ├── intake-definition.ts  # Form section/field definitions (~720 lines)
│   │   └── validations.ts        # Zod schemas per section (~510 lines)
│   ├── seo/
│   │   ├── config.ts             # SEO configuration
│   │   ├── indexnow.ts           # IndexNow submission
│   │   ├── metadata.ts           # Metadata generation
│   │   └── schemas.ts            # JSON-LD schemas
│   ├── services/
│   │   ├── document-configs.ts    # Document config per service pack
│   │   ├── document-prompts.ts    # AI prompt templates (~7300 lines)
│   │   ├── document-service-map.ts # Document type to service mapping
│   │   ├── service-catalog.ts     # Service definitions, pricing, bundles (~1150 lines)
│   │   └── service-status.ts      # Service status helpers
│   ├── stripe/
│   │   └── config.ts             # Stripe price/product IDs
│   ├── supabase/
│   │   └── client.ts             # Supabase browser client
│   ├── activity-data.ts          # Activity feed data
│   ├── animations.ts              # Framer Motion animations
│   └── social-platforms.ts       # Social platform definitions
│
├── hooks/                     # React hooks
│   ├── useAuth.ts              # Auth state
│   ├── useClientProfile.ts     # Client profile data
│   ├── useIsAdmin.ts           # Admin check
│   ├── useIntakeResponses.ts   # Intake form state
│   ├── useUnreadMessages.ts    # Unread message count
│   └── useInView.ts           # Intersection observer
│
├── supabase/functions/        # Edge Functions (Deno)
│   ├── delete-account/         # Account deletion
│   ├── generate-bolt-prompt/   # Brief generation prompt
│   ├── generate-brief/         # Main brief generation (~580 lines)
│   ├── intake-auth/            # Intake form auth
│   ├── intake-submit/          # Intake form submission
│   ├── stripe-checkout/        # Stripe checkout session (~560 lines)
│   └── stripe-webhook/         # Stripe webhook handler (~440 lines)
│
└── types/                      # TypeScript type definitions
```

---

## Key Files by Domain

### Service Catalog & Pricing
- `lib/services/service-catalog.ts` - All purchasable services, tiers, pricing, bundles
- `lib/services/service-status.ts` - Service status utilities
- `lib/services/document-service-map.ts` - Maps document types to services

### Intake Form System
- `lib/forms/intake-definition.ts` - All form sections and fields (the questions)
- `lib/forms/validations.ts` - Zod validation schemas per section
- `lib/forms/build-intake-form.ts` - Assembles form based on purchased services
- `lib/forms/conditional-logic.ts` - Field visibility conditions
- `components/intake/IntakeWizard.tsx` - Main form wizard component

### Document Generation
- `lib/services/document-configs.ts` - What documents each service pack delivers
- `lib/services/document-prompts.ts` - AI prompt templates (OFF-LIMITS for refactoring)
- `supabase/functions/generate-brief/index.ts` - Brief generation edge function

### Admin Dashboard
- `app/personal/admin/page.tsx` - Admin client list
- `app/personal/admin/[userId]/page.tsx` - Per-client admin view
- `app/personal/admin/[userId]/tabs/*.tsx` - Individual tab components:
  - `BriefTab.tsx` - Brief generation/review
  - `DocumentsTab.tsx` - Document management
  - `ServicesTab.tsx` - Service assignment
  - `OverviewTab.tsx` - Client overview
  - `MessagingTab.tsx` - Client messaging
  - `SubscriptionTab.tsx` - Subscription management
  - `SocialMediaTab.tsx` - Social media content (~1370 lines)
  - `WebsiteCopyTab.tsx` - Website copy management (~1185 lines)
  - `OperationsTab.tsx` - Operations packs
  - `IndustryTab.tsx` - Industry packs
  - `IntakeTab.tsx` - Intake form review
  - `TierBundleTab.tsx` - Tier/bundle management

### Checkout & Payments
- `app/checkout/page.tsx` - Main checkout page (~1100 lines)
- `lib/stripe/config.ts` - Stripe configuration
- `supabase/functions/stripe-checkout/index.ts` - Checkout session creation
- `supabase/functions/stripe-webhook/index.ts` - Webhook handling

### Authentication
- `app/login/page.tsx` - Login page
- `app/auth/callback/page.tsx` - Supabase auth callback
- `hooks/useAuth.ts` - Auth state hook
- `lib/supabase/client.ts` - Supabase client

---

## Service Tier Architecture

The catalog has three tiers:

1. **Foundation** (`business_foundations_pack`, `website_copy_pack`, `social_media_pack`, `monthly_care_plan`)
   - Entry-level documents and content
   - Intake form: 10 sections (intro through final)

2. **Operations** (`client_onboarding_pack`, `payment_protection_pack`, `copyright_licensing_pack`, `gdpr_deep_pack`)
   - Business protection documents
   - Each has dedicated intake section

3. **Industry** (`coach_industry_pack`, `photographer_industry_pack`, `consultant_industry_pack`, `contractor_industry_pack`)
   - Industry-specific documents
   - Each has dedicated intake section

Bundles are defined in `serviceGroups` array in service-catalog.ts.

---

## Form Section to Service Mapping

| Section ID | Used By Services |
|------------|-------------------|
| `intro` | All services |
| `business_identity` | All services |
| `services` | Foundation + Operations packs |
| `clients` | Foundation + Industry packs |
| `pricing` | `business_foundations_pack`, `payment_protection_pack`, `client_onboarding_pack` |
| `gdpr` | `business_foundations_pack`, `gdpr_deep_pack` |
| `legal` | `business_foundations_pack` |
| `brand` | Foundation + Industry packs |
| `invoice` | `business_foundations_pack` |
| `linkedin` | `business_foundations_pack` |
| `final` | All services |
| `website_copy` | `website_copy_pack` |
| `social_media` | `social_media_pack` |
| `client_onboarding` | `client_onboarding_pack` |
| `payment_protection` | `payment_protection_pack` |
| `copyright_licensing` | `copyright_licensing_pack` |
| `gdpr_deep` | `gdpr_deep_pack` |
| `industry_coach` | `coach_industry_pack` |
| `industry_photographer` | `photographer_industry_pack` |
| `industry_consultant` | `consultant_industry_pack` |
| `industry_contractor` | `contractor_industry_pack` |

---

## Large Files to Load Selectively

These files are large. Only load when specifically needed:

| File | Lines | Load When... |
|------|-------|--------------|
| `lib/services/document-prompts.ts` | ~7300 | Generating documents (OFF-LIMITS) |
| `lib/content/articleContent.tsx` | ~3340 | Working with blog content |
| `lib/services/service-catalog.ts` | ~1150 | Working with pricing/services |
| `lib/forms/intake-definition.ts` | ~720 | Modifying intake questions |
| `lib/forms/validations.ts` | ~510 | Modifying form validation |
| `app/personal/admin/[userId]/tabs/SocialMediaTab.tsx` | ~1370 | Admin social media management |
| `app/personal/admin/[userId]/tabs/WebsiteCopyTab.tsx` | ~1185 | Admin website copy management |
| `app/checkout/page.tsx` | ~1100 | Checkout flow changes |
| `app/pricing/PricingClient.tsx` | ~1465 | Pricing page changes |
| `app/about/page.tsx` | ~1010 | About page changes |

---

## Database Schema (Supabase/PostgreSQL)

Key tables (inferred from code):

- `profiles` - User profiles (id, email, role, created_at)
- `orders` - Customer orders (id, user_id, stripe_session_id, status, services, created_at)
- `documents` - Generated documents (id, user_id, service_id, type, content, status, created_at)
- `messages` - Client-admin messages (id, sender_id, recipient_id, content, created_at, read)
- `intake_responses` - Intake form responses (id, user_id, service_id, responses, status, created_at)
- `posts` - Social media posts (id, user_id, service_id, content, platform, status, created_at)
- `subscriptions` - Care plan subscriptions (id, user_id, stripe_subscription_id, status, tier, created_at)

---

## Edge Functions

All edge functions use Deno runtime and require CORS headers:

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};
```

| Function | Purpose |
|----------|---------|
| `delete-account` | Account deletion |
| `generate-bolt-prompt` | Brief generation prompt builder |
| `generate-brief` | Main brief/document generation |
| `intake-auth` | Intake form authentication |
| `intake-submit` | Intake form submission |
| `stripe-checkout` | Create Stripe checkout session |
| `stripe-webhook` | Handle Stripe webhooks |

---

## Common Patterns

### Getting a service by ID
```typescript
import { getServiceById } from '@/lib/services/service-catalog';
const service = getServiceById('business_foundations_pack');
```

### Building an intake form
```typescript
import { buildIntakeForm } from '@/lib/forms/build-intake-form';
const sections = buildIntakeForm(['business_foundations_pack', 'website_copy_pack']);
```

### Validating a section
```typescript
import { validateSectionWithZod } from '@/lib/forms/validations';
const errors = validateSectionWithZod('business_identity', responses);
```

### Fetching admin data
```typescript
import { fetchClients, fetchClientDetails } from '@/lib/admin/dashboard-queries';
const clients = await fetchClients(searchQuery, statusFilter);
```

---

## Refactoring Notes

This codebase has been structured for AI agent context efficiency:

- Large data files remain as single files (catalog, prompts)
- Validation schemas are split per-section in `lib/forms/validations.ts`
- Service catalog data is separated from helper functions
- Each admin tab is its own file (already split)
- UI visualization components are individual files

Files marked OFF-LIMITS contain business logic/prompts that should not be modified during restructuring.
