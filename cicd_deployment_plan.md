# CI/CD Pipeline & Free Deployment Plan
## Kurunegala Furnitures — Next.js + MSSQL + Redis + GraphQL

---

## 1. Stack Reality Check

Your app has a specific combination that makes "free hosting" tricky. Let's be honest about each service:

| Layer | Technology | Challenge |
|---|---|---|
| App | Next.js 16 (SSR + API Routes + GraphQL) | Easy — Vercel is built for this |
| Database | MSSQL via Prisma Adapter | Hard — very few free MSSQL hosts |
| Cache | Redis (ioredis) | Medium — Upstash has a real free tier |
| Auth | NextAuth v5 | Easy — runs inside Next.js |
| GraphQL | Apollo Server via Next.js route | Easy — it's just an API route |
| TanStack Query | Client-side only | N/A — ships with frontend JS bundle |
| 3D Models | Three.js / R3F | N/A — ships with frontend JS bundle |

---

## 2. Free Service Stack (Recommended)

### 🟢 Frontend + Backend + GraphQL API → **Vercel** (Free)
- Native Next.js support (built by the same team)
- API routes and GraphQL (`/api/graphql`) work as serverless functions
- Free tier: 100GB bandwidth, unlimited deploys, custom domain
- Auto-deploys on every push to `main`
- Preview deployments for every pull request
- URL: https://vercel.com

### 🟡 MSSQL Database → **Azure SQL Database** (Free Tier)
- Microsoft's own free MSSQL offering
- Free tier (as of 2024): 32GB storage, 100,000 vCore-seconds/month
- Compatible with your existing `@prisma/adapter-mssql` setup — **zero code changes**
- Connection string format: `Server=tcp:yourserver.database.windows.net,1433;...`
- URL: https://azure.microsoft.com/free → Search "Azure SQL Database Free"

> [!IMPORTANT]
> Azure SQL Free Tier requires a free Azure account (credit card for verification but NOT charged). The free tier is genuinely free with usage limits. Alternative: **Clever Cloud** has a free MySQL tier, but that would require migrating from MSSQL to MySQL + changing Prisma adapter.

### 🟢 Redis Cache → **Upstash Redis** (Free Tier)
- Serverless Redis, perfect for Vercel serverless functions
- Free tier: 10,000 commands/day, 256MB storage, 1 database
- REST API + `ioredis` compatible via `REDIS_URL`
- URL: https://upstash.com
- No config changes needed — just swap `REDIS_URL` env variable

### 🟢 CI/CD Pipeline → **GitHub Actions** (Free)
- Free for public repos (unlimited)
- Free for private repos: 2,000 minutes/month (plenty for this project)
- Runs on every push and pull request

---

## 3. Architecture Diagram

```
GitHub Repository
       │
       ├─── Push to any branch
       │         │
       │         ▼
       │    GitHub Actions CI
       │    ┌──────────────────────────────┐
       │    │  1. Install dependencies     │
       │    │  2. Lint (ESLint)            │
       │    │  3. Jest tests + Coverage    │
       │    │  4. Build (next build)       │
       │    └──────────────────────────────┘
       │
       ├─── Push to `main` branch
       │         │
       │         ▼
       │    Vercel Auto-Deploy
       │    ┌──────────────────────────────┐
       │    │  Next.js App (SSR + API)     │◄──── Azure SQL (MSSQL)
       │    │  /api/graphql (Apollo)       │◄──── Upstash Redis
       │    │  /api/auth (NextAuth)        │
       │    └──────────────────────────────┘
       │
       └─── Push to PR branch
                 │
                 ▼
            Vercel Preview Deploy (unique URL per PR)
```

---

## 4. Step-by-Step Setup

### Step 1 — Set Up Azure SQL Database (MSSQL)

1. Go to https://portal.azure.com → Create a **free account**
2. Search for **"Azure SQL"** → Create → Select **"Single database"**
3. Under **Pricing tier** → Choose **"Free (preview)"** tier
4. Set:
   - **Server name**: `kurunegala-db` (becomes `kurunegala-db.database.windows.net`)
   - **Admin login**: `sqladmin`
   - **Password**: A strong password (save this!)
5. After creation → Go to **Connection strings** → Copy the **ADO.NET** string
6. Your `DB_URL` will look like:
   ```
   Server=tcp:kurunegala-db.database.windows.net,1433;Database=kurunegala_furnitures_db;User Id=sqladmin;Password=YOUR_PASSWORD;Encrypt=True;
   ```
7. Run your existing Prisma migration against the new database:
   ```bash
   npx prisma migrate deploy
   ```

### Step 2 — Set Up Upstash Redis

1. Go to https://upstash.com → Sign up (free)
2. Create a new Redis database → Choose region closest to your Vercel deployment (usually `us-east-1`)
3. Copy the **Redis URL** from the dashboard (format: `rediss://default:...@...upstash.io:6379`)
4. That's your new `REDIS_URL` — no code changes needed

### Step 3 — Set Up Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. Click **"Add New Project"** → Import your GitHub repo
3. Vercel auto-detects Next.js — no configuration needed
4. **Before deploying**, add all environment variables (see Step 5)
5. Deploy!

### Step 4 — Connect GitHub Actions

Create the file `.github/workflows/ci.yml` (see Section 5 below).

### Step 5 — Configure Environment Variables

#### In GitHub Actions (for CI):
Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret Name | Value |
|---|---|
| `DB_URL` | Your Azure SQL connection string |
| `REDIS_URL` | Your Upstash Redis URL |
| `AUTH_SECRET` | Your NextAuth secret |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `VERCEL_TOKEN` | Get from Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Get from `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | Get from `.vercel/project.json` after `vercel link` |

#### In Vercel Dashboard:
Go to your project → **Settings** → **Environment Variables** — add the same vars.

> [!WARNING]
> Never commit `.env` to GitHub. Your `.gitignore` already excludes it — verify `.env` is listed there.

---

## 5. GitHub Actions Workflow File

Create this file at `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  # Provide stub values for Jest tests that mock these services anyway
  # Real values are only needed for build and deploy steps
  DB_URL: ${{ secrets.DB_URL }}
  REDIS_URL: ${{ secrets.REDIS_URL }}
  AUTH_SECRET: ${{ secrets.AUTH_SECRET }}
  NEXTAUTH_URL: ${{ secrets.NEXTAUTH_URL }}
  NEXT_PUBLIC_APP_URL: ${{ secrets.NEXTAUTH_URL }}

jobs:
  # ─── Job 1: Lint ─────────────────────────────────────────────────────
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

  # ─── Job 2: Test ─────────────────────────────────────────────────────
  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Run Jest tests with coverage
        run: npm run test:coverage

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7

  # ─── Job 3: Build ────────────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Generate Prisma client
        run: npx prisma generate

      - name: Build Next.js app
        run: npm run build

  # ─── Job 4: Deploy (main branch only) ────────────────────────────────
  deploy:
    name: Deploy to Vercel
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Pull Vercel environment
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}

      - name: Build for Vercel
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}

      - name: Deploy to Vercel
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 6. Pipeline Flow Visual

```
git push origin main
        │
        ▼
┌─────────────────┐    FAIL → ❌ Stop here, notify
│   1. LINT       │──────────────────────────────►
└────────┬────────┘
         │ PASS
         ▼
┌─────────────────┐    FAIL → ❌ Stop here, notify
│   2. TEST       │──────────────────────────────►
│  (34 tests +    │    📊 Coverage report uploaded
│   coverage)     │        as artifact
└────────┬────────┘
         │ PASS
         ▼
┌─────────────────┐    FAIL → ❌ Stop here, notify
│   3. BUILD      │──────────────────────────────►
│  (next build)   │
└────────┬────────┘
         │ PASS (main branch only)
         ▼
┌─────────────────┐
│   4. DEPLOY     │──► ✅ Live on Vercel production
│  (vercel --prod)│
└─────────────────┘
```

---

## 7. Playwright E2E Tests in CI

> [!NOTE]
> E2E tests require a running server and real database, making them unsuitable for CI without a staging environment. The recommended approach is to run them **locally before pushing** or add a separate nightly workflow.

For a future nightly E2E job, you can add:

```yaml
# Optional: nightly E2E job (add to ci.yml)
e2e:
  name: Playwright E2E (nightly)
  runs-on: ubuntu-latest
  if: github.event_name == 'schedule'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with: { node-version: 20, cache: npm }
    - run: npm ci
    - run: npx playwright install --with-deps chromium
    - run: npm run dev &
    - run: npx wait-on http://localhost:3000
    - run: npm run test:e2e
```

---

## 8. Things to Do Before First Deploy

- [ ] Create Azure free account + Azure SQL database
- [ ] Create Upstash account + Redis database
- [ ] Create Vercel account + import GitHub repo
- [ ] Run `vercel link` locally to get `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`
- [ ] Add all secrets to GitHub (see Step 5 table)
- [ ] Add all env vars to Vercel dashboard
- [ ] Create `.github/workflows/ci.yml` (see Section 5)
- [ ] Verify `.env` is in `.gitignore` ✅ (already done)
- [ ] Run `npx prisma migrate deploy` against Azure SQL
- [ ] Push to `main` → watch the pipeline run!

---

## 9. Cost Summary

| Service | Free Tier Limit | Paid Upgrade |
|---|---|---|
| **Vercel** | 100GB bandwidth, unlimited deploys | $20/mo |
| **Azure SQL** | 32GB, 100K vCore-sec/month | ~$5/mo |
| **Upstash Redis** | 10K commands/day, 256MB | $0.2/100K commands |
| **GitHub Actions** | 2,000 min/month (private repo) | $0.008/min |
| **Total** | **$0/month** | — |
