# Architecture Research: DEX Comparison Platform

**Project:** DexRank
**Researched:** 2026-01-17
**Confidence:** HIGH (verified with official documentation)

## System Overview

```
+------------------+     Cron/Vercel     +------------------+
|   DefiLlama API  |  <-- (hourly) --->  |   Sync Service   |
|  (External Data) |                     |  (API Routes)    |
+------------------+                     +--------+---------+
                                                  |
                                                  v
+------------------+                     +------------------+
|    PostgreSQL    | <-- Read/Write -->  |   Data Layer     |
|   (Supabase or   |                     |  (Drizzle ORM)   |
|    Railway)      |                     +--------+---------+
+------------------+                              |
        ^                                         |
        |                                         v
        |                               +------------------+
        +------ Direct Queries ------>  | Server Components|
                                        |   (RSC + SSG)    |
                                        +--------+---------+
                                                 |
                                                 v
                                        +------------------+
                                        |   Next.js App    |
                                        |  (App Router)    |
                                        +--------+---------+
                                                 |
                          +----------------------+----------------------+
                          |                      |                      |
                          v                      v                      v
                  +---------------+      +---------------+      +---------------+
                  |   Homepage    |      |  DEX Reviews  |      | Compare Tool  |
                  |   /rankings   |      |  /dex/[slug]  |      | /compare/...  |
                  +---------------+      +---------------+      +---------------+
                          |                      |                      |
                          v                      v                      v
                  +----------------------------------------------------------+
                  |                    Affiliate Tracking                     |
                  |              (Click tracking + Attribution)              |
                  +----------------------------------------------------------+
```

## Core Components

### 1. Data Sync Service

**Responsibility:** Fetch data from DefiLlama API and persist to PostgreSQL.

**Boundaries:**
- Owns all external API communication
- Never called directly by frontend
- Writes to database only (no direct reads for UI)
- Handles rate limiting and error recovery

**Implementation:**
```
Location: /src/lib/sync/
Files:
  - defillama-client.ts    # API wrapper with rate limiting
  - sync-dexes.ts          # DEX data sync logic
  - sync-volumes.ts        # Volume/metrics sync
  - sync-fees.ts           # Fees/revenue sync
  - scheduler.ts           # Cron job orchestration
```

**Key DefiLlama Endpoints (verified from API docs):**
| Endpoint | Data | Update Frequency |
|----------|------|------------------|
| `GET /api/overview/dexs` | All DEX volumes, 24h/7d/30d changes | Hourly |
| `GET /api/summary/dexs/{protocol}` | Individual DEX detailed metrics | Hourly |
| `GET /api/overview/fees` | Protocol fees/revenue | Hourly |
| `GET /api/summary/fees/{protocol}` | Per-protocol fee breakdown | Hourly |
| `GET /api/tvl/{protocol}` | Historical TVL | Daily |

**Sync Strategy:**
```
Schedule:
  - Full DEX list sync: Every 6 hours
  - Volume/metrics sync: Every hour
  - Fee data sync: Every hour
  - Historical snapshots: Daily at 00:00 UTC
```

### 2. Data Layer (Drizzle ORM)

**Responsibility:** Type-safe database access, schema management, migrations.

**Boundaries:**
- Single source of truth for database schema
- Provides typed queries for all components
- Handles connection pooling
- Manages migrations

**Implementation:**
```
Location: /src/db/
Files:
  - index.ts               # Database client export
  - schema/
    - dexes.ts             # DEX entity schema
    - metrics.ts           # Time-series metrics
    - comparisons.ts       # Comparison metadata
    - clicks.ts            # Affiliate tracking
    - index.ts             # Schema aggregation
  - queries/
    - dex-queries.ts       # DEX-specific queries
    - ranking-queries.ts   # Ranking algorithm queries
    - comparison-queries.ts
```

**Why Drizzle over Prisma:**
- Pure TypeScript schemas (no .prisma DSL)
- Better edge runtime support
- Lighter bundle size
- SQL-first approach matches PostgreSQL strengths

### 3. Ranking Engine

**Responsibility:** Calculate composite scores from raw metrics.

**Boundaries:**
- Read-only access to metrics
- Outputs normalized scores (0-100)
- Algorithm is transparent and documented
- Does not persist scores (calculated on-demand or cached)

**Implementation:**
```
Location: /src/lib/ranking/
Files:
  - algorithm.ts           # Core scoring logic
  - weights.ts             # Configurable weight factors
  - normalizers.ts         # Metric normalization utilities
  - types.ts               # Ranking type definitions
```

**Scoring Factors (from PROJECT.md):**
| Factor | Weight | Source |
|--------|--------|--------|
| TVL | 25% | DefiLlama TVL endpoint |
| Volume (30d avg) | 20% | DefiLlama volume |
| Fee efficiency | 15% | Fees/Volume ratio |
| Security | 15% | Audit status (editorial) |
| Liquidity depth | 15% | TVL/Volume ratio |
| User growth | 10% | 7d volume change |

### 4. Server Components (RSC)

**Responsibility:** Fetch data and render HTML on the server.

**Boundaries:**
- Direct database queries (no API layer needed)
- Render static or dynamic HTML
- Handle caching via Next.js mechanisms
- No client-side state

**Key Patterns:**
```typescript
// Server Component with database query
// /src/app/dex/[slug]/page.tsx

import { db } from '@/db';
import { dexes, metrics } from '@/db/schema';

export async function generateStaticParams() {
  const allDexes = await db.select({ slug: dexes.slug }).from(dexes);
  return allDexes.map((d) => ({ slug: d.slug }));
}

export default async function DexPage({ params }: { params: { slug: string } }) {
  const dex = await db.query.dexes.findFirst({
    where: eq(dexes.slug, params.slug),
    with: { metrics: true }
  });

  return <DexReviewTemplate dex={dex} />;
}
```

### 5. API Routes (Route Handlers)

**Responsibility:** Handle mutations, webhooks, and client-side data needs.

**Boundaries:**
- Sync trigger endpoints (cron webhooks)
- Affiliate click tracking
- Search/filter operations requiring client interaction
- Admin operations

**Implementation:**
```
Location: /src/app/api/
Routes:
  - /api/sync/trigger       # Cron webhook endpoint
  - /api/clicks/track       # Affiliate click recording
  - /api/search             # Client-side search (optional)
  - /api/revalidate         # On-demand ISR revalidation
```

### 6. Affiliate Tracking System

**Responsibility:** Track outbound clicks, attribute conversions, generate reports.

**Boundaries:**
- Records all affiliate link clicks
- Stores attribution metadata (source page, UTM params)
- Does NOT handle actual conversions (that's partner-side)
- Provides click analytics for internal use

**Implementation:**
```
Location: /src/lib/affiliate/
Files:
  - tracker.ts             # Click tracking logic
  - links.ts               # Affiliate link generator
  - types.ts               # Click event types

Location: /src/components/affiliate/
Files:
  - AffiliateLink.tsx      # Tracking wrapper component
```

**Click Tracking Schema:**
```typescript
// Track: page, dex, timestamp, user agent, referrer
// Attribute via click_id for potential postback integration
```

## Data Flow

### Flow 1: Data Sync (DefiLlama to DB)

```
1. Vercel Cron triggers /api/sync/trigger (hourly)
2. Sync service fetches from DefiLlama endpoints
3. Data transformed to match schema
4. Upsert to PostgreSQL (update existing, insert new)
5. Timestamp recorded for last_synced
6. Optional: Trigger revalidation for affected pages
```

### Flow 2: Page Render (DB to User)

```
SSG Path (DEX reviews, comparison pages):
1. Build time: generateStaticParams fetches all slugs
2. Each page queries DB directly via Server Component
3. HTML generated and cached
4. Served from CDN edge
5. ISR revalidates on schedule (revalidate: 3600)

SSR Path (Homepage rankings with filters):
1. Request arrives with search params
2. Server Component queries DB with filters
3. HTML generated per request
4. Cached with short TTL or no cache
```

### Flow 3: Affiliate Click (User to Partner)

```
1. User clicks affiliate CTA
2. Client-side event fires to /api/clicks/track
3. Click recorded with metadata (async, non-blocking)
4. User redirected to partner with referral params
5. Click data available for analytics
```

## Database Schema Design

### Core Tables

```sql
-- DEX Registry (source of truth for all DEXs)
CREATE TABLE dexes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,          -- URL slug: "uniswap"
  name VARCHAR(200) NOT NULL,                 -- Display: "Uniswap"
  defillama_id VARCHAR(100) UNIQUE,           -- DefiLlama protocol ID
  description TEXT,
  website_url VARCHAR(500),
  logo_url VARCHAR(500),
  chains JSONB DEFAULT '[]',                  -- ["ethereum", "arbitrum"]
  dex_type VARCHAR(50),                       -- "spot" | "perp" | "hybrid"
  launch_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Time-series Metrics (daily snapshots)
CREATE TABLE dex_metrics (
  id SERIAL PRIMARY KEY,
  dex_id INTEGER REFERENCES dexes(id),
  recorded_at DATE NOT NULL,
  tvl NUMERIC(20, 2),
  volume_24h NUMERIC(20, 2),
  volume_7d NUMERIC(20, 2),
  volume_30d NUMERIC(20, 2),
  fees_24h NUMERIC(20, 2),
  revenue_24h NUMERIC(20, 2),
  change_1d NUMERIC(10, 4),                   -- Percentage
  change_7d NUMERIC(10, 4),
  change_30d NUMERIC(10, 4),
  UNIQUE(dex_id, recorded_at)
);

-- Latest Metrics View (current state, optimized for reads)
CREATE TABLE dex_metrics_latest (
  dex_id INTEGER PRIMARY KEY REFERENCES dexes(id),
  tvl NUMERIC(20, 2),
  volume_24h NUMERIC(20, 2),
  volume_7d NUMERIC(20, 2),
  volume_30d NUMERIC(20, 2),
  fees_24h NUMERIC(20, 2),
  revenue_24h NUMERIC(20, 2),
  change_1d NUMERIC(10, 4),
  change_7d NUMERIC(10, 4),
  change_30d NUMERIC(10, 4),
  ranking_score NUMERIC(5, 2),                -- Computed score 0-100
  rank_position INTEGER,
  last_synced TIMESTAMP DEFAULT NOW()
);

-- Editorial Content (human-written sections)
CREATE TABLE dex_content (
  id SERIAL PRIMARY KEY,
  dex_id INTEGER REFERENCES dexes(id) UNIQUE,
  editors_take TEXT,                          -- Editorial summary
  pros JSONB DEFAULT '[]',                    -- ["Fast", "Low fees"]
  cons JSONB DEFAULT '[]',                    -- ["Complex UI"]
  best_for TEXT,                              -- "High-volume traders"
  security_notes TEXT,
  audit_status VARCHAR(100),
  affiliate_url VARCHAR(500),
  affiliate_params JSONB,                     -- {"ref": "dexrank"}
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Comparison Metadata (SEO pages)
CREATE TABLE comparisons (
  id SERIAL PRIMARY KEY,
  dex_1_id INTEGER REFERENCES dexes(id),
  dex_2_id INTEGER REFERENCES dexes(id),
  slug VARCHAR(200) UNIQUE NOT NULL,          -- "uniswap-vs-sushiswap"
  meta_title VARCHAR(200),
  meta_description VARCHAR(500),
  comparison_content TEXT,                    -- Editorial comparison text
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(dex_1_id, dex_2_id)
);

-- Affiliate Click Tracking
CREATE TABLE affiliate_clicks (
  id SERIAL PRIMARY KEY,
  dex_id INTEGER REFERENCES dexes(id),
  click_id UUID DEFAULT gen_random_uuid(),    -- For postback attribution
  source_page VARCHAR(500),                   -- "/dex/uniswap"
  source_component VARCHAR(100),              -- "hero-cta" | "sidebar"
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  user_agent TEXT,
  ip_hash VARCHAR(64),                        -- Hashed for privacy
  referrer VARCHAR(500),
  clicked_at TIMESTAMP DEFAULT NOW()
);

-- Chain Registry (for filtering)
CREATE TABLE chains (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  logo_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true
);
```

### Indexing Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_dexes_slug ON dexes(slug);
CREATE INDEX idx_dexes_defillama ON dexes(defillama_id);
CREATE INDEX idx_dex_metrics_dex_date ON dex_metrics(dex_id, recorded_at DESC);
CREATE INDEX idx_metrics_latest_rank ON dex_metrics_latest(rank_position);
CREATE INDEX idx_metrics_latest_tvl ON dex_metrics_latest(tvl DESC);
CREATE INDEX idx_affiliate_clicks_dex ON affiliate_clicks(dex_id, clicked_at DESC);
CREATE INDEX idx_comparisons_slug ON comparisons(slug);

-- GIN index for chain filtering
CREATE INDEX idx_dexes_chains ON dexes USING GIN(chains);
```

### Drizzle Schema (TypeScript)

```typescript
// /src/db/schema/dexes.ts
import { pgTable, serial, varchar, text, boolean, timestamp, jsonb, numeric, integer, date, uuid } from 'drizzle-orm/pg-core';

export const dexes = pgTable('dexes', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  defillamaId: varchar('defillama_id', { length: 100 }).unique(),
  description: text('description'),
  websiteUrl: varchar('website_url', { length: 500 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  chains: jsonb('chains').default([]),
  dexType: varchar('dex_type', { length: 50 }),
  launchDate: date('launch_date'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const dexMetricsLatest = pgTable('dex_metrics_latest', {
  dexId: integer('dex_id').primaryKey().references(() => dexes.id),
  tvl: numeric('tvl', { precision: 20, scale: 2 }),
  volume24h: numeric('volume_24h', { precision: 20, scale: 2 }),
  volume7d: numeric('volume_7d', { precision: 20, scale: 2 }),
  volume30d: numeric('volume_30d', { precision: 20, scale: 2 }),
  fees24h: numeric('fees_24h', { precision: 20, scale: 2 }),
  revenue24h: numeric('revenue_24h', { precision: 20, scale: 2 }),
  change1d: numeric('change_1d', { precision: 10, scale: 4 }),
  change7d: numeric('change_7d', { precision: 10, scale: 4 }),
  change30d: numeric('change_30d', { precision: 10, scale: 4 }),
  rankingScore: numeric('ranking_score', { precision: 5, scale: 2 }),
  rankPosition: integer('rank_position'),
  lastSynced: timestamp('last_synced').defaultNow(),
});

export const affiliateClicks = pgTable('affiliate_clicks', {
  id: serial('id').primaryKey(),
  dexId: integer('dex_id').references(() => dexes.id),
  clickId: uuid('click_id').defaultRandom(),
  sourcePage: varchar('source_page', { length: 500 }),
  sourceComponent: varchar('source_component', { length: 100 }),
  utmSource: varchar('utm_source', { length: 100 }),
  utmMedium: varchar('utm_medium', { length: 100 }),
  utmCampaign: varchar('utm_campaign', { length: 100 }),
  userAgent: text('user_agent'),
  ipHash: varchar('ip_hash', { length: 64 }),
  referrer: varchar('referrer', { length: 500 }),
  clickedAt: timestamp('clicked_at').defaultNow(),
});
```

## API Layer Design

### Next.js Route Handlers

```
/src/app/api/
  sync/
    trigger/route.ts       # POST - Vercel cron webhook
  clicks/
    track/route.ts         # POST - Record affiliate click
  revalidate/
    route.ts               # POST - On-demand ISR trigger
```

### Cron Webhook Security

```typescript
// /src/app/api/sync/trigger/route.ts
import { headers } from 'next/headers';

export async function POST(request: Request) {
  // Verify Vercel cron secret
  const authHeader = headers().get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Execute sync
  await syncDexData();

  return Response.json({ success: true, synced: new Date().toISOString() });
}
```

### vercel.json Cron Configuration

```json
{
  "crons": [
    {
      "path": "/api/sync/trigger",
      "schedule": "0 * * * *"
    }
  ]
}
```

### Rate Limiting Considerations

DefiLlama allows 150 calls/minute. With ~100 DEXs:
- Full sync: ~200 calls (overview + per-protocol)
- Batch requests where possible
- Stagger sync over multiple cron runs if needed
- Implement exponential backoff on errors

## Frontend Architecture

### Page Structure (App Router)

```
/src/app/
  layout.tsx                    # Root layout with providers
  page.tsx                      # Homepage with rankings

  dex/
    [slug]/
      page.tsx                  # DEX review page (SSG)

  compare/
    page.tsx                    # Comparison landing
    [comparison]/
      page.tsx                  # e.g., /compare/uniswap-vs-sushiswap (SSG)

  methodology/
    page.tsx                    # "How We Rank" page (SSG)

  api/
    sync/trigger/route.ts
    clicks/track/route.ts
    revalidate/route.ts
```

### Component Hierarchy

```
/src/components/
  layout/
    Header.tsx
    Footer.tsx
    Navigation.tsx

  dex/
    DexCard.tsx               # Used in rankings grid
    DexTable.tsx              # Table view of rankings
    DexMetrics.tsx            # Metrics display component
    DexRankBadge.tsx          # Rank position badge

  review/
    ReviewTemplate.tsx        # Full review page layout
    ProsCons.tsx
    EditorsTake.tsx
    MetricsSection.tsx
    AffiliateCtaSection.tsx

  compare/
    ComparisonTable.tsx       # Side-by-side comparison
    ComparisonSelector.tsx    # DEX picker for comparison

  affiliate/
    AffiliateLink.tsx         # Tracking wrapper
    CtaButton.tsx             # Styled CTA with tracking

  ui/                         # shadcn/ui components
    button.tsx
    card.tsx
    table.tsx
    ...
```

### Rendering Strategy by Route

| Route | Strategy | Rationale |
|-------|----------|-----------|
| `/` (Homepage) | SSR with ISR | Needs fresh rankings, revalidate: 3600 |
| `/dex/[slug]` | SSG | Static content, revalidate: 3600 |
| `/compare/[comparison]` | SSG | Static comparisons, revalidate: 3600 |
| `/methodology` | SSG | Fully static |
| `/api/*` | Dynamic | Route handlers always dynamic |

### generateStaticParams for SEO

```typescript
// /src/app/dex/[slug]/page.tsx
export async function generateStaticParams() {
  const dexes = await db.select({ slug: dexes.slug })
    .from(dexes)
    .where(eq(dexes.isActive, true));

  return dexes.map((d) => ({ slug: d.slug }));
}

// /src/app/compare/[comparison]/page.tsx
export async function generateStaticParams() {
  const comparisons = await db.select({ slug: comparisons.slug })
    .from(comparisons);

  return comparisons.map((c) => ({ comparison: c.slug }));
}
```

### State Management

**Recommendation: Minimal client state**

- Server Components handle most data fetching
- URL state for filters (searchParams)
- React Context for UI state only (modals, sidebars)
- No Redux/Zustand needed initially

```typescript
// URL-based filtering
// /src/app/page.tsx
export default async function HomePage({
  searchParams,
}: {
  searchParams: { chain?: string; type?: string; sort?: string }
}) {
  const { chain, type, sort } = searchParams;

  const dexes = await getRankedDexes({
    chain,
    type,
    sort: sort || 'rank'
  });

  return <RankingsPage dexes={dexes} />;
}
```

## Build Order

Based on component dependencies, recommended build sequence:

### Phase 1: Data Foundation

**Build first - everything depends on this**

1. **Database setup** (Supabase/Railway)
   - Create PostgreSQL instance
   - Initialize Drizzle schema
   - Run initial migrations

2. **Drizzle ORM configuration**
   - Schema definitions
   - Database client
   - Basic queries

3. **DefiLlama sync service**
   - API client with rate limiting
   - Sync logic for DEX data
   - Manual trigger for testing

**Milestone:** Can fetch data from DefiLlama and persist to database.

### Phase 2: Core Pages

**Build second - needs data layer**

4. **Homepage with rankings**
   - Server Component fetching from DB
   - Basic table/grid display
   - No filters yet

5. **DEX review pages**
   - Dynamic route `/dex/[slug]`
   - generateStaticParams
   - Basic template without editorial

6. **Ranking algorithm**
   - Score calculation
   - Rank position assignment
   - Display in UI

**Milestone:** Working homepage with real data and clickable DEX pages.

### Phase 3: Features

**Build third - enhances core**

7. **Comparison tool**
   - `/compare/[comparison]` route
   - Comparison table component
   - SEO metadata

8. **Filtering and sorting**
   - URL params for filters
   - Chain/type filters
   - Sort options

9. **Affiliate tracking**
   - Click tracking API route
   - AffiliateLink component
   - CTA integration

**Milestone:** Full feature set without polish.

### Phase 4: Production Readiness

**Build last - optimization and polish**

10. **Cron automation**
    - Vercel cron setup
    - Automated sync schedule
    - Error alerting

11. **SEO optimization**
    - Metadata generation
    - Schema markup (JSON-LD)
    - Sitemap generation

12. **Editorial content**
    - Admin interface for content
    - Editor's Take sections
    - Pros/cons for each DEX

**Milestone:** Production-ready application.

## Technical Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | Drizzle | TypeScript-first, edge-compatible, lighter than Prisma |
| Database | PostgreSQL (Supabase) | Reliable, good free tier, familiar tooling |
| Rendering | SSG + ISR | SEO priority, data updates hourly not real-time |
| State | URL + Server Components | Minimal client JS, better SEO |
| Cron | Vercel Cron | Native integration, simple setup |
| Affiliate tracking | Custom (not 3rd party) | Lower cost, data ownership, simple needs |

## Sources

**HIGH Confidence (Official Documentation):**
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [DefiLlama API Documentation](https://api-docs.defillama.com/)

**MEDIUM Confidence (Verified Tutorials):**
- [Drizzle ORM with Next.js 15](https://strapi.io/blog/how-to-use-drizzle-orm-with-postgresql-in-a-nextjs-15-project)
- [Next.js Rendering Strategies Guide](https://dev.to/rayan2228/nextjs-rendering-strategies-csr-vs-ssr-vs-ssg-vs-isr-complete-guide-26j4)
- [Vercel Cron Jobs](https://vercel.com/templates/next.js/vercel-cron)

**LOW Confidence (Community Patterns):**
- Affiliate tracking schema patterns (synthesized from multiple sources)
- Ranking algorithm weighting (needs validation with real data)
