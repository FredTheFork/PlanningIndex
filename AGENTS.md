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

## Production build / hosting
- The app builds cleanly for production: `NODE_ENV=production npx next build` (142/142 pages, exit 0).
- CRITICAL: never run `next build` with `NODE_ENV=development` (the dev compose sets it) — it mixes dev/prod runtimes and produces bogus prerender errors on every page (`<Html> should not be imported outside of pages/_document`, `useContext` of null).
- Default hosting platforms (Vercel etc.) set NODE_ENV=production automatically, so a standard deploy is unaffected.
- `.env.base44-defaults` holds non-functional placeholders (deliberately NOT `sk_`-prefixed so `isStripeConfigured()` stays false until real keys arrive via /run/base44/app.env).

## Architecture notes
- No local database needed — Supabase is hosted externally.
- Supabase migrations live in `supabase/migrations/` (applied on the hosted Supabase project, not locally).
- Path alias `@/*` maps to repo root (see `tsconfig.json`).
- `next.config.mjs` includes `allowedDevOrigins` for the Base44 preview origin.
- `lib/mock/` contains mock planning application data used by the workspace search UI.
