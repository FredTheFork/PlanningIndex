# COMPLETE DEPLOYMENT FIX - Next.js Migration

## The Problem
Your GitHub repository (commit 5a3fc03) still contains:
- Old `src/pages/` directory with React Router code
- References to `react-router-dom` and `react-helmet-async` (uninstalled)
- Old Vite configuration

This causes Vercel builds to fail because Next.js tries to compile these old files.

## The Solution
We need to push the completely migrated Next.js version to GitHub, replacing all old React + Vite files.

---

## STEP-BY-STEP DEPLOYMENT FIX

### Step 1: Clone Your Repository

```bash
# Clone your Foundationary repository
git clone https://github.com/FredTheFork/Foundationary.git
cd Foundationary
git checkout main
```

### Step 2: Create Backup Branch

```bash
# Create a backup of current state
git checkout -b backup-react-vite-version
git checkout main
```

### Step 3: Remove Old Files

```bash
# Delete old React + Vite files that should not exist
rm -rf src/
rm -f index.html
rm -f vite.config.ts
rm -f vite-env.d.ts
```

### Step 4: Download Migrated Files

**IMPORTANT**: You need to copy ALL files from this working directory to your cloned repository.

**Download these files from Claude Code's working directory:**

The complete file list is at: `/tmp/files_to_push.txt`

**Essential directories to copy:**
```
app/                    (22 directories - all Next.js pages)
components/             (5 directories - all React components)
lib/                   (6 directories - utilities, Supabase, articles)
hooks/                 (React hooks updated for Next.js)
public/                (Static assets)
supabase/              (Edge functions and migrations)
```

**Essential config files to copy:**
```
package.json           (Updated with Next.js dependencies, no Vite)
next.config.mjs       (Next.js configuration)
vercel.json           (Updated - removed SPA rewrites)
tsconfig.json         (TypeScript config for Next.js)
tailwind.config.js    (Tailwind with Next.js paths)
postcss.config.js     (PostCSS configuration)
eslint.config.js      (ESLint configuration)
next-env.d.ts         (Next.js TypeScript declarations)
.env                  (Environment variables with NEXT_PUBLIC_ prefix)
.gitignore            (Git ignore patterns)
```

### Step 5: Verify File Structure

After copying, your repository should look like:

```
Foundationary/
├── app/
│   ├── about/
│   ├── additional-services/
│   ├── auth/
│   │   └── callback/
│   ├── blog/
│   │   └── [slug]/
│   ├── checkout/
│   ├── contact/
│   ├── faq/
│   ├── feed.xml/
│   ├── how-it-works/
│   ├── login/
│   ├── personal/
│   │   ├── admin/
│   │   │   └── [userId]/
│   │   ├── documents/
│   │   ├── intake/
│   │   └── status/
│   ├── pricing/
│   ├── privacy/
│   ├── success/
│   ├── terms/
│   ├── whats-included/
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/
│   └── sections/
├── lib/
│   ├── content/
│   ├── forms/
│   ├── stripe/
│   └── supabase/
├── hooks/
├── public/
├── supabase/
│   ├── functions/
│   └── migrations/
├── package.json
├── next.config.mjs
├── vercel.json
├── tsconfig.json
└── .env
```

### Step 6: Install Dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

This will install:
- `next@14.2.0`
- `@supabase/ssr@0.1.0`
- All other dependencies

And remove old dependencies:
- `vite`
- `@vitejs/plugin-react`
- `react-router-dom`
- `react-helmet-async`

### Step 7: Build Locally (Test Before Pushing)

```bash
# Run Next.js build
npm run build
```

**Expected output:**
```
✓ Compiled successfully
✓ Generating static pages (31/31)

Route (app)                              Size      First Load JS
┌ ○ /                                    186 B          96.2 kB
├ ○ /about                               186 B          96.2 kB
├ ○ /blog                                6.58 kB         103 kB
├ ● /blog/[slug]                         186 B          96.2 kB
├ ○ /pricing                             6.17 kB         102 kB
├ ○ /personal                            3.19 kB         159 kB
...
```

**If build passes locally, proceed to Step 8.**

### Step 8: Commit and Push to GitHub

```bash
# Stage all changes
git add -A

# Verify what will be committed
git status

# Should show:
#   deleted:    src/ (entire directory)
#   deleted:    index.html
#   deleted:    vite.config.ts
#   new file:   app/...
#   new file:   components/...
#   new file:   lib/...
#   modified:   package.json
#   modified:   vercel.json
#   ... etc

# Commit the migration
git commit -m "migrate: complete Next.js App Router migration, remove Vite and React Router"

# Force push to main (required to overwrite old files)
git push origin main --force
```

**Note**: We use `--force` to completely replace the old React + Vite code.

### Step 9: Verify GitHub Repository

Go to: https://github.com/FredTheFork/Foundationary

Check that:
- ✅ No `src/` directory exists
- ✅ `app/` directory exists with all pages
- ✅ `package.json` has Next.js dependencies
- ✅ `vercel.json` has no SPA rewrites
- ✅ Latest commit message is your migration commit

### Step 10: Vercel Automatic Deployment

Vercel will automatically detect the push and start building.

**Monitor at**: Your Vercel dashboard

**Expected Vercel logs:**
```
Installing dependencies...
added 17 packages, and removed 60 packages

Running "npm run build"
> next build

✓ Compiled successfully
✓ Generating static pages (31/31)

Route (app)                              Size
┌ ○ /                                    186 B
├ ○ /blog                                6.58 kB
...
```

### Step 11: Post-Deployment Verification

Once deployed, verify these URLs work:

**Public pages:**
- https://foundationary.vercel.app/
- https://foundationary.vercel.app/pricing
- https://foundationary.vercel.app/blog
- https://foundationary.vercel.app/blog/sole-trader-business-setup-guide-uk
- https://foundationary.vercel.app/about
- https://foundationary.vercel.app/contact

**Protected pages:**
- https://foundationary.vercel.app/personal (should redirect to /login)
- https://foundationary.vercel.app/login

**SEO endpoints:**
- https://foundationary.vercel.app/sitemap.xml
- https://foundationary.vercel.app/robots.txt
- https://foundationary.vercel.app/feed.xml

### Step 12: Update Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

**Ensure these are set:**
```
NEXT_PUBLIC_SUPABASE_URL=https://npamfxqasswqnmbqgdbw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_MODE=test (or live)
```

**Remove any old VITE_* variables:**
```
VITE_SUPABASE_URL (delete if exists)
VITE_SUPABASE_ANON_KEY (delete if exists)
VITE_STRIPE_MODE (delete if exists)
```

---

## IF SOMETHING GOES WRONG

### Rollback to Previous Version

```bash
git checkout backup-react-vite-version
git checkout -b main-rollback
git push origin main-rollback --force
# Then in Vercel, change branch to deploy from
```

### Common Issues

**Issue 1: Build still fails with module not found**
- **Solution**: Ensure `src/` directory is completely deleted
- Check: `git ls-files | grep "src/"` should return nothing

**Issue 2: Missing dependencies**
- **Solution**: Run `npm install` in your local repo before pushing
- Verify `package.json` has `next@14.2.0`

**Issue 3: Environment variables not working**
- **Solution**: Prefix all client-side variables with `NEXT_PUBLIC_`
- Update in Vercel dashboard AND .env file

**Issue 4: 404 errors on pages**
- **Solution**: Check file naming - all pages should be `page.tsx`
- Example: `app/about/page.tsx` not `app/about.tsx`

---

## VERIFICATION CHECKLIST

Before pushing, verify:

```bash
# 1. No old files exist
ls src/ 2>&1 | grep "No such file"
ls index.html 2>&1 | grep "No such file"
ls vite.config.ts 2>&1 | grep "No such file"

# 2. All new files exist
ls app/page.tsx
ls app/layout.tsx
ls app/sitemap.ts
ls app/robots.ts
ls lib/supabase/client.ts
ls lib/supabase/server.ts

# 3. Build passes
npm run build | grep "Compiled successfully"

# 4. Package.json is correct
cat package.json | grep "next"
cat package.json | grep -v "react-router-dom"
cat package.json | grep -v "react-helmet-async"
cat package.json | grep -v "vite"
```

**After all checks pass, push to GitHub!**

---

## SUCCESS INDICATORS

You'll know it worked when:

1. ✅ GitHub shows no `src/` directory
2. ✅ Vercel build completes in ~2-3 minutes
3. ✅ Build log shows "Compiled successfully"
4. ✅ All 31 pages are generated
5. ✅ Homepage loads at foundationary.vercel.app
6. ✅ Navigation works without React Router
7. ✅ Blog articles load dynamically
8. ✅ /personal requires authentication
9. ✅ /sitemap.xml shows XML sitemap
10. ✅ /feed.xml shows RSS feed

---

## MIGRATION COMPLETE

Once deployed, you have successfully migrated from:
- ❌ Vite + React with React Router
- ❌ Client-side only rendering
- ❌ Manual route configuration

To:
- ✅ Next.js 14 with App Router
- ✅ Server-side rendering and static generation
- ✅ File-based routing
- ✅ Built-in SEO optimization
- ✅ Better performance and developer experience

**Congratulations!** 🎉
