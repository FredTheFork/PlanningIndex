# Next.js Migration - Deployment Fix Instructions

## CRITICAL: The Issue
Your GitHub repository still contains the old `src/pages/` directory which causes Vercel builds to fail. The Next.js migration is complete locally but needs to be pushed to GitHub.

## Solution: Push These Changes to GitHub

### Option A: If you have the repository locally

```bash
# Navigate to your Foundationary repository
cd /path/to/Foundationary

# Pull latest changes
git pull origin main

# Create a backup branch
git checkout -b backup-before-nextjs-migration

# Switch back to main
git checkout main

# Remove old files that should not exist
rm -rf src/
rm -f index.html vite.config.ts

# Add all the new/changed files
# (Copy all files from this working directory to your repository)

# Stage all changes
git add -A

# Commit the migration
git commit -m "migrate: complete Next.js App Router migration, remove Vite and React Router"

# Push to GitHub
git push origin main --force
```

### Option B: Fresh clone and apply changes

```bash
# Clone fresh
git clone https://github.com/FredTheFork/Foundationary.git
cd Foundationary

# Remove old files
rm -rf src/
rm -f index.html vite.config.ts vite-env.d.ts

# Copy the migrated files from this directory to the cloned repo
# You need to copy:
# - app/ directory (all Next.js pages and layouts)
# - components/ directory (all React components)
# - lib/ directory (utilities and content)
# - hooks/ directory (React hooks)
# - public/ directory (static assets)
# - supabase/ directory (edge functions and migrations)
# - All config files (next.config.mjs, tsconfig.json, tailwind.config.js, etc.)
# - package.json, .env, vercel.json

# After copying, verify the structure matches this working directory

# Stage and commit
git add -A
git commit -m "migrate: complete Next.js App Router migration, remove Vite and React Router"
git push origin main --force
```

## What Was Changed

### Files REMOVED:
- `src/` directory (entire folder with old React + Vite code)
- `index.html` (Vite entry point)
- `vite.config.ts` (Vite configuration)
- All React Router and React Helmet references

### Files ADDED/UPDATED:
- `app/` directory with 22 Next.js pages and layouts
- `components/` directory with all React components migrated to Next.js
- `lib/` directory with utilities, articles, and Supabase clients
- `hooks/` directory with React hooks updated for Next.js
- `sitemap.ts`, `robots.ts`, `feed.xml/route.ts` (SEO infrastructure)
- Updated `vercel.json` (removed SPA rewrites, added security headers)
- Updated `next.config.mjs` (Next.js configuration)
- All environment variables use `NEXT_PUBLIC_*` prefix

### Migration Complete Status:
✓ 31 pages successfully building
✓ All marketing pages (about, pricing, blog, etc.)
✓ Blog with dynamic routes
✓ Protected personal area
✓ Admin dashboard
✓ SEO infrastructure (sitemap, robots, RSS)
✓ Authentication flow
✓ Stripe integration
✓ Supabase integration

## Expected Result After Push

Vercel will automatically redeploy when you push to GitHub. The build should:
1. Install dependencies (including next@14)
2. Run `next build` successfully
3. Generate 31 static and dynamic routes
4. Deploy without errors

## Build Command Output (Expected)

```
✓ Compiled successfully
✓ Generating static pages (31/31)

Route (app)
┌ ○ /                           186 B
├ ○ /about                      186 B
├ ○ /blog                       6.58 kB
├ ● /blog/[slug]                186 B
├ ○ /pricing                    6.17 kB
├ ○ /personal                   3.19 kB
... and 25 more routes
```

## Troubleshooting

If the build still fails after pushing:
1. Check Vercel environment variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_STRIPE_MODE`

2. Verify no old `src/` directory exists in the repository

3. Ensure `package.json` has Next.js scripts:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start"
   }
   ```

4. Check that dependencies were updated (run `npm install`)

## Quick Verification Commands

After pushing, locally verify:
```bash
next build
# Should show "✓ Compiled successfully" with 0 errors

next dev
# Visit http://localhost:3000 and verify:
# - Homepage loads
# - /pricing works
# - /blog works
# - /blog/[slug] works
# - /personal redirects to login if not authenticated
```
