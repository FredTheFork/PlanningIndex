# PlanningIndex — Base44 Dev Environment

## Overview
Next.js 14 App Router marketing site for "PlanningIndex" (UK planning application intelligence).
Integrates Supabase (auth/DB), Stripe (payments), and Mapbox (maps) — all optional for local dev.

## Running the app
```bash
docker compose -f docker-compose.base44.yml up -d
```
- Dev server runs on port 3000 with live reload (Next.js `next dev`).
- Source is bind-mounted; edits hot-reload without rebuilds.
- `npm install` runs automatically on container start.

## Environment variables
All env vars have safe fallbacks — the app boots and renders marketing pages without any credentials.
External integrations need real values to function:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase auth & database
- `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — Stripe payments
- `NEXT_PUBLIC_MAPBOX_TOKEN` — Mapbox maps in workspace views

API routes (`/api/checkout`, `/api/portal`, `/api/cancel-subscription`) gracefully return 503 when Stripe is not configured.

Stripe flow (once a real `sk_` key is delivered): `/api/checkout` creates a Stripe Customer + hosted Checkout Session and stores a subscription record with status `incomplete` — access is granted ONLY by the webhook `app/api/webhooks/stripe/route.ts` on `checkout.session.completed` (events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed; requires `STRIPE_WEBHOOK_SECRET`). Plan price IDs live in `lib/pricing.ts` — currently TEST-mode IDs for the 3 Stripe products × monthly/annual prices (created via `/tmp/setup-stripe-products.cjs`, recreate if absent; must run from the app dir `/workspace` inside the container since it needs `node_modules/stripe`). For go-live: re-run it with a live `sk_live_` key and swap the printed price IDs in `lib/pricing.ts`.

## Production build / hosting
- The app builds cleanly for production: `NODE_ENV=production npx next build` (142/142 pages, exit 0).
- CRITICAL: never run `next build` with `NODE_ENV=development` (the dev compose sets it) — it mixes dev/prod runtimes and produces bogus prerender errors on every page (`<Html> should not be imported outside of pages/_document`, `useContext` of null).
- Default hosting platforms (Vercel etc.) set NODE_ENV=production automatically, so a standard deploy is unaffected.
- `.env.base44-defaults` holds non-functional placeholders (deliberately NOT `sk_`-prefixed so `isStripeConfigured()` stays false until real keys arrive via /run/base44/app.env).

## Access enforcement (backend)
- Plan access is enforced server-side, not just in the UI: `/api/leads*` and `/api/activities` require an active membership with CRM (`regional`/`national`/`local`), `/api/proposals*` additionally requires `permissions.proposals` (so the `local` plan gets 403). Unauthenticated calls get 401 first.
- `/api/profile` PATCH rejects `councils` arrays longer than the plan's `maxCouncils` (0 without membership).
- Helpers live in `lib/server/auth.ts`: `hasFeatureAccess(userId, 'crm'|'proposals')`, `maxCouncilsFor(userId)`, `forbidden(msg)`.
- An "active" membership = status `active`/`trialing` AND `!cancelAtPeriodEnd` (same rule as login redirect and the `useAuth` hook).

## Testing
- `bash /tmp/integration-test.sh` (recreate if absent) runs 71 end-to-end checks against localhost:3000 covering auth (login/logout/expiry/password reset), membership activation/cancel/enforcement, CRM and proposal CRUD. It creates its own run-unique users and leaves the demo account intact.
- The file-backed DB (`.data/db.json`) is cached in memory by the server process — direct file edits are invisible (and get overwritten by the next `saveDb()`) until a dev-server module reload is forced (e.g. `touch lib/server/db.ts`, then wait a few seconds).

## Performance notes
- Production build: all 142 routes compile static (○/●); First Load JS 87 kB shared / 104–123 kB per page. Marketing page switches are client-side (no reload): ~50–120 ms once Next's prefetch completes. Prefetch needs a few seconds over the sandbox proxy (≈250–750 ms per RSC payload), so the first click right after load is slower.
- Direct imports are used in shared layout/pages (Navbar, home, features, examples, guides, blog): components/layout and marketing pages must NOT import from the `@/components/marketing` or `@/components/ui` barrels — barrels pull every showcase into each page's dev compile graph.
- Blog images use next/image with `images.remotePatterns` for images.pexels.com (see next.config.mjs). The optimizer fetches from Pexels at request time.
- Do NOT use `next dev --turbo`: Turbopack fails on mapbox-gl (ModuleBuildError, /app/search → 500). Plain webpack dev only.
- To measure production: `docker compose -f docker-compose.base44.yml -f /tmp/compose.prod.yml up -d` with a command of `npm install --include=dev && NODE_ENV=production npx next build && NODE_ENV=production npx next start -p 3000 -H 0.0.0.0` — the `--include=dev` is critical because `npm install` with NODE_ENV=production prunes devDependencies (tailwindcss), which breaks the CSS/font pipeline.

## Planning applications pipeline (real data)
- `NEXT_PUBLIC_SUPABASE_URL` must be the bare project URL; if a pasted value carries an `/rest/v1/` suffix or trailing slash, `lib/supabase/url.ts` (`normalizeSupabaseUrl`) strips it before `supabase-js` appends its own paths — otherwise every request 404s.
- Source of truth: Supabase Postgres table `planning_applications` (migration `20260915210000_create_planning_applications.sql`; apply on the hosted project via the Supabase SQL editor). RLS is enabled with no policies — only the service role (`SUPABASE_SERVICE_ROLE_KEY`) can touch it.
- Ingest: `ruby sync_to_pi.rb` (scraper machine) reads the local SQLite apps.db and POSTs batches of ~500 to `POST /api/ingest/planning-apps` with `Authorization: Bearer $PI_SYNC_KEY`. Upserts are idempotent on `council_reference`. Requires `PI_SYNC_KEY` on both sides (scraper env + app secret).
- Search: `GET /api/applications` (plan-gated like /api/leads: 401 unauthenticated, 403 without active membership) queries Supabase with keyword/council/status/dateFrom + pagination; `GET /api/applications/[id]` and `GET /api/applications/councils` follow the same gating.
- DB row → UI mapping lives in `lib/planning/enrich.ts` (status/type/trade-tag derivation, title summarizing, postcode extraction). `lib/mock/applications.ts` reuses its generatePotentialWork/generatePotentialTrade so mock and real data stay consistent.
- Workspace search page (`app/app/search`), application detail, and the dashboard's two application widgets fetch from these routes — no mock planning applications in user-facing workspace views (mock remains for marketing/examples pages and CRM widgets).
- Scraped apps have no lat/lng, so map pins are skipped (MapView filters 0/0 coords); distance/value fields are hidden when unknown.
- `lib/server/planning-apps.ts` returns 503 via routes when Supabase/`SUPABASE_SERVICE_ROLE_KEY` is unconfigured (`isPlanningDataConfigured()` — placeholders in `.env.base44-defaults` keep it false until real values arrive).

## Architecture notes
- No local database needed — Supabase is hosted externally.
- App state store (users/sessions/profiles/subscriptions/CRM): `lib/server/db.ts` keeps everything as one JSON document. When `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are configured (e.g. Vercel production) it persists to the single-row `app_state` table (`supabase/migrations/20260917190000_create_app_state.sql`, service-role only) — Vercel's filesystem is read-only, so the old file store caused every registration/login to 500. Without credentials it falls back to the local `.data/db.json` (dev). `getDb()`/`saveDb()` and the `lib/server/auth.ts` helpers are therefore **async** — always `await` them. Concurrency: each lambda keeps its own in-memory copy and `saveDb()` upserts the whole document, so concurrent writes across instances are last-write-wins (acceptable at launch traffic; a per-user relational store is the long-term fix).
- Stripe price IDs can be overridden without code changes via `STRIPE_PRICE_<TIER>_<CYCLE>` env vars (e.g. `STRIPE_PRICE_REGIONAL_MONTHLY=price_live_...`) — `getStripePriceId()` in `lib/stripe/config.ts` checks them before the test-mode IDs baked into `lib/pricing.ts`.
- Production safety gates: `/api/checkout` returns 503 instead of granting a free membership when Stripe is unconfigured in production; `/api/auth/password-reset` never returns the reset link in the API response in production (account-takeover risk) — it emails it via Resend when `RESEND_API_KEY` is set (from-address `RESET_EMAIL_FROM`, domain must be Resend-verified), otherwise logs it server-side.
- `/checkout/success` polls `/api/auth/session` until the Stripe webhook activates the membership (up to ~50s) before redirecting to `/app` — a slow webhook would otherwise bounce a paying user back to `/choose-plan`.
- Rate limiting (`lib/server/rate-limit.ts`) is in-memory — on serverless it is per-instance only.
- Supabase migrations live in `supabase/migrations/` (applied on the hosted Supabase project, not locally).
- Path alias `@/*` maps to repo root (see `tsconfig.json`).
- `next.config.mjs` includes `allowedDevOrigins` for the Base44 preview origin.
- `lib/mock/` contains mock data for marketing pages and CRM widgets; workspace search/detail/dashboard application widgets use real Supabase data (see pipeline section above).
