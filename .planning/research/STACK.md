# Stack Research: DEX Comparison Platform

**Project:** DexRank - DEX Comparison and Ranking Platform
**Researched:** 2026-01-17
**Research Mode:** Ecosystem Survey
**Overall Confidence:** HIGH

---

## Executive Summary

This stack is optimized for a database-first, SEO-critical DEX comparison platform with real-time data synchronization from DefiLlama. The recommendations prioritize:

1. **SEO Performance**: Next.js 15 with App Router for optimal SSR/SSG and Core Web Vitals
2. **Data Freshness**: Drizzle ORM + PostgreSQL with tiered caching strategy
3. **Developer Experience**: Type-safe end-to-end with TypeScript, Zod, and Drizzle
4. **Operational Simplicity**: Vercel deployment with built-in cron jobs for data sync

---

## Recommended Stack

### Frontend Framework

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Next.js** | 15.5+ | Full-stack React framework with App Router | HIGH |
| **React** | 19.x | UI library (required by Next.js 15+) | HIGH |
| **TypeScript** | 5.5+ | Type safety across the stack | HIGH |

**Why Next.js 15.5 (not 16):**
- Next.js 16 (released December 2025) removes synchronous request API compatibility entirely
- Next.js 15.5 is stable with typed routes, Turbopack builds in beta, and full React 19 support
- Upgrade path to 16 is straightforward once stable
- App Router is the foundation for all modern Next.js patterns (ISR, Server Components, Server Actions)

**Key Next.js 15 Features for DexRank:**
- `unstable_cache` / `use cache` for granular data caching
- `revalidateTag()` for on-demand cache invalidation when data updates
- Built-in metadata API for SEO (generateMetadata, sitemap.ts, robots.ts)
- Server Components for zero-JS data display (rankings tables, stats)

**Sources:**
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)

---

### Styling & Components

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Tailwind CSS** | 4.x | Utility-first CSS framework | HIGH |
| **shadcn/ui** | Latest | Copy-paste component library | HIGH |
| **Radix UI** | Latest | Accessible primitives (via shadcn) | HIGH |

**Why Tailwind CSS v4:**
- 5x faster full builds, 100x faster incremental builds (Oxide engine in Rust)
- CSS-first configuration (`@import "tailwindcss"` - no config file needed)
- Native cascade layers, `@property` custom properties, `color-mix()`
- Zero configuration auto-detection of template files

**Why shadcn/ui:**
- Copy-paste model means full control over components (no version lock-in)
- 2025 updates: Base UI support, new visual styles (Vega, Nova, Maia, Lyra, Mira)
- Pre-built components: tables, cards, dialogs, dropdowns - all DexRank needs
- Built on Radix UI primitives for accessibility

**Installation:**
```bash
# Tailwind CSS v4 (auto-configured with Next.js)
npm install tailwindcss @tailwindcss/postcss postcss

# shadcn/ui init
npx shadcn@latest init
```

**Sources:**
- [Tailwind CSS v4.0 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Changelog](https://ui.shadcn.com/docs/changelog)

---

### Database & ORM

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **PostgreSQL** | 16+ | Primary data store | HIGH |
| **Drizzle ORM** | 0.45+ | Type-safe SQL ORM | HIGH |
| **Drizzle Kit** | 0.30+ | Migrations and schema management | HIGH |

**Why Drizzle ORM over Prisma:**
- **Performance**: 14x lower latency for complex joins, 7x faster array parsing
- **Bundle Size**: ~7KB gzipped vs Prisma's query engine overhead
- **Serverless**: Zero cold start impact (critical for Vercel Edge)
- **SQL Transparency**: Write SQL-like queries, not abstract DSL
- **Type Safety**: Full TypeScript inference from schema

**Drizzle PostgreSQL Features for DexRank:**
- Identity columns (2025 PostgreSQL standard over SERIAL)
- Full-text search with `tsVector` (for DEX search functionality)
- JSON columns for flexible DEX metadata
- Indexes for fast ranking queries

**Schema Pattern:**
```typescript
// drizzle/schema.ts
import { pgTable, text, integer, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const dexes = pgTable('dexes', {
  id: text('id').primaryKey(), // DefiLlama protocol ID
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  tvl: integer('tvl'),
  volume24h: integer('volume_24h'),
  fees24h: integer('fees_24h'),
  chains: jsonb('chains').$type<string[]>(),
  metadata: jsonb('metadata'),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  tvlIdx: index('tvl_idx').on(table.tvl),
  slugIdx: index('slug_idx').on(table.slug),
}));
```

**Installation:**
```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit
```

**Sources:**
- [Drizzle ORM Benchmarks](https://orm.drizzle.team/benchmarks)
- [Drizzle vs Prisma Comparison](https://www.bytebase.com/blog/drizzle-vs-prisma/)

---

### PostgreSQL Hosting

| Option | Best For | Confidence |
|--------|----------|------------|
| **Neon** (Recommended) | Serverless, scale-to-zero, branching | HIGH |
| **Supabase** | Full BaaS with auth, realtime | MEDIUM |
| **Vercel Postgres** | Tight Vercel integration | MEDIUM |

**Why Neon:**
- **Scale-to-zero**: Pay only for compute used (ideal for variable traffic)
- **Instant branching**: Copy-on-write cloning for preview deployments
- **Serverless-native**: Millisecond cold starts, designed for edge
- **Databricks acquisition (May 2025)**: Strong AI/analytics future

**Pricing (2025):**
- Free tier: 0.5 GB storage, 190 compute hours/month
- Launch ($19/mo): 10 GB storage, 300 compute hours
- Scale ($69/mo): 50 GB storage, 750 compute hours

**When to use Supabase instead:**
- Need built-in authentication
- Need realtime subscriptions (though not needed for DexRank)
- Want full BaaS with storage, edge functions

**Sources:**
- [Neon vs Supabase Comparison](https://www.bytebase.com/blog/neon-vs-supabase/)
- [PostgreSQL Hosting Options 2025](https://www.bytebase.com/blog/postgres-hosting-options-pricing-comparison/)

---

### Data Fetching & Caching

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **TanStack Query** | 5.x | Client-side data fetching & caching | HIGH |
| **Next.js Cache** | Built-in | Server-side caching (ISR, unstable_cache) | HIGH |

**Why TanStack Query v5:**
- Suspense support is now stable (`useSuspenseQuery`)
- 20% smaller than v4
- Automatic background refetching, cache invalidation
- Perfect for client-side data freshness indicators

**Caching Strategy for DexRank:**

```
Tier 1: Static Generation (build time)
- DEX profile pages: generateStaticParams + revalidate: 3600
- Category pages: revalidate: 1800

Tier 2: Server Cache (runtime)
- Rankings data: unstable_cache with tags ['rankings', 'dex-{id}']
- API responses: revalidateTag('rankings') on data sync

Tier 3: Client Cache (TanStack Query)
- Real-time indicators: staleTime: 60000 (1 min)
- User interactions: optimistic updates
```

**Installation:**
```bash
npm install @tanstack/react-query
```

**Sources:**
- [TanStack Query v5](https://tanstack.com/query/v5)
- [Next.js Caching Guide](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)

---

### Data Integration (DefiLlama)

| Endpoint Category | Base URL | Auth Required | Confidence |
|-------------------|----------|---------------|------------|
| TVL Data | `https://api.llama.fi` | No | HIGH |
| Volume/Fees | `https://api.llama.fi` | No | HIGH |
| Token Prices | `https://coins.llama.fi` | No | HIGH |
| Pro Features | `https://pro-api.llama.fi` | Yes (API Key) | HIGH |

**DefiLlama API Strategy:**

**Free Endpoints (sufficient for MVP):**
- `/protocols` - All protocols with TVL
- `/protocol/{name}` - Individual protocol details
- `/tvl/{protocol}` - Historical TVL
- `/v2/dexs` - DEX volume data
- `/overview/fees` - Fees and revenue

**Data Sync Pattern:**
```typescript
// lib/defillama.ts
const DEFILLAMA_BASE = 'https://api.llama.fi';

export async function fetchAllDexes() {
  const [protocols, volumes, fees] = await Promise.all([
    fetch(`${DEFILLAMA_BASE}/protocols`),
    fetch(`${DEFILLAMA_BASE}/overview/dexs`),
    fetch(`${DEFILLAMA_BASE}/overview/fees`),
  ]);
  // Merge and normalize data
}
```

**Sync Schedule (Vercel Cron):**
- Full sync: Every 6 hours (`0 */6 * * *`)
- Hot data (TVL, volume): Every 15 minutes (`*/15 * * * *`)
- Cache invalidation: `revalidateTag('rankings')` after sync

**Sources:**
- [DefiLlama API Docs](https://api-docs.defillama.com/)
- [DefiLlama Pricing](https://docs.llama.fi/pro-api)

---

### Validation & Type Safety

| Technology | Version | Purpose | Confidence |
|------------|---------|---------|------------|
| **Zod** | 4.x | Runtime validation & type inference | HIGH |
| **@zod/mini** | 4.x | Tree-shakable validation (client) | HIGH |

**Why Zod v4:**
- 14x faster string parsing, 7x faster array parsing vs Zod 3
- `@zod/mini` is ~1.9KB gzipped (perfect for client bundle)
- Native JSON Schema generation for API docs
- New `z.xor()` for exclusive unions

**Usage Pattern:**
```typescript
// lib/schemas.ts
import { z } from 'zod';

export const dexSchema = z.object({
  id: z.string(),
  name: z.string(),
  tvl: z.number().nullable(),
  volume24h: z.number().nullable(),
  chains: z.array(z.string()),
});

export type Dex = z.infer<typeof dexSchema>;

// Validate DefiLlama responses
const validated = dexSchema.parse(apiResponse);
```

**Installation:**
```bash
npm install zod
# For client-side (smaller bundle)
npm install @zod/mini
```

**Sources:**
- [Zod v4 Release](https://www.infoq.com/news/2025/08/zod-v4-available/)
- [Zod Documentation](https://zod.dev/)

---

### SEO & Performance

| Technology | Purpose | Confidence |
|------------|---------|------------|
| **Next.js Metadata API** | Dynamic meta tags, OG images | HIGH |
| **next/sitemap** | Auto-generated sitemaps | HIGH |
| **JSON-LD** | Structured data for rich snippets | HIGH |

**SEO Implementation for DexRank:**

**1. Metadata API:**
```typescript
// app/dex/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const dex = await getDex(params.slug);
  return {
    title: `${dex.name} - DEX Review, TVL, Volume | DexRank`,
    description: `Compare ${dex.name} with other DEXs. TVL: $${dex.tvl}, 24h Volume: $${dex.volume24h}`,
    openGraph: {
      title: `${dex.name} | DexRank`,
      images: [`/api/og?dex=${params.slug}`],
    },
  };
}
```

**2. Sitemap Generation:**
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dexes = await getAllDexSlugs();
  return dexes.map((slug) => ({
    url: `https://dexrank.com/dex/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }));
}
```

**3. Structured Data (JSON-LD):**
```typescript
// For DEX pages - Organization + Product schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: dex.name,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: dex.rating,
    reviewCount: dex.reviewCount,
  },
};
```

**Core Web Vitals Targets:**
- LCP: < 2.5s (server-rendered rankings tables)
- FID: < 100ms (minimal client JS)
- CLS: < 0.1 (reserved space for dynamic data)

**Sources:**
- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js SEO Guide 2025](https://prateeksha.com/blog/nextjs-app-router-seo-metadata-sitemaps-canonicals)

---

### Deployment & Infrastructure

| Technology | Purpose | Confidence |
|------------|---------|------------|
| **Vercel** | Hosting, CDN, serverless functions | HIGH |
| **Vercel Cron** | Scheduled data sync jobs | HIGH |
| **Vercel Analytics** | Performance monitoring | MEDIUM |

**Why Vercel:**
- Native Next.js platform (made by same team)
- Automatic preview deployments per PR
- Built-in Edge CDN for static assets
- Serverless functions scale automatically
- Built-in cron jobs (no external service needed)

**Cron Configuration:**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/sync/full",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/sync/hot",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

**Security:**
```typescript
// app/api/sync/full/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  // Sync logic
}
```

**Sources:**
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)

---

### Affiliate Tracking

| Approach | Implementation | Confidence |
|----------|----------------|------------|
| **Server-side redirects** | Next.js API routes | HIGH |
| **First-party cookies** | Track referrals without 3rd party | HIGH |
| **UTM parameters** | Standard tracking | HIGH |

**Affiliate Link Strategy:**

```typescript
// app/api/go/[dexSlug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { dexSlug: string } }
) {
  const dex = await getDex(params.dexSlug);

  // Log click (server-side, privacy-compliant)
  await logAffiliateClick({
    dexId: dex.id,
    timestamp: new Date(),
    referrer: request.headers.get('referer'),
    userAgent: request.headers.get('user-agent'),
  });

  // Redirect to affiliate URL
  return Response.redirect(dex.affiliateUrl);
}
```

**Privacy-First Approach:**
- No third-party tracking scripts
- Server-side click logging
- First-party analytics only
- GDPR/CCPA compliant by design

**Sources:**
- [Affiliate Tracking Best Practices 2025](https://www.leaddyno.com/blog/better-affiliate-tracking-and-links)

---

## Complete Installation

```bash
# Create Next.js project
npx create-next-app@latest dexrank --typescript --tailwind --eslint --app --src-dir

# Core dependencies
npm install drizzle-orm postgres @tanstack/react-query zod

# Dev dependencies
npm install -D drizzle-kit @types/node

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add table card button badge tabs

# Environment setup
cp .env.example .env.local
```

**Environment Variables:**
```env
# Database (Neon)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# DefiLlama (optional Pro features)
DEFILLAMA_API_KEY=your_api_key

# Vercel Cron
CRON_SECRET=random_16_char_string

# App
NEXT_PUBLIC_APP_URL=https://dexrank.com
```

---

## What NOT to Use

| Technology | Why Avoid |
|------------|-----------|
| **Prisma** | Heavier bundle, slower cold starts, less SQL control |
| **Redux/Zustand** | TanStack Query handles server state; React Context for UI state |
| **next-seo package** | Next.js 15 Metadata API is native and better |
| **node-cron** | Doesn't work on serverless (Vercel); use Vercel Cron |
| **Tailwind v3** | v4 is significantly faster with better DX |
| **MongoDB** | Relational data (DEX rankings, comparisons) needs PostgreSQL |
| **GraphQL** | REST is simpler for this use case; DefiLlama is REST |
| **External cron services** | Vercel Cron is built-in and simpler |

---

## Confidence Assessment

| Category | Confidence | Rationale |
|----------|------------|-----------|
| **Frontend (Next.js 15, React 19)** | HIGH | Official docs, stable releases, production-proven |
| **Styling (Tailwind v4, shadcn/ui)** | HIGH | Official releases, widely adopted |
| **Database (Drizzle, PostgreSQL)** | HIGH | Benchmarks verified, growing adoption |
| **PostgreSQL Hosting (Neon)** | HIGH | Recent Databricks acquisition, strong docs |
| **Data Fetching (TanStack Query)** | HIGH | Industry standard, v5 stable |
| **DefiLlama Integration** | HIGH | Official API docs, free tier sufficient |
| **SEO (Metadata API, JSON-LD)** | HIGH | Next.js native, Google-recommended |
| **Deployment (Vercel)** | HIGH | Native Next.js platform, proven at scale |
| **Affiliate Tracking** | MEDIUM | Custom implementation, standard patterns |

---

## Version Summary

| Package | Recommended Version | Released |
|---------|---------------------|----------|
| Next.js | 15.5.x | August 2025 |
| React | 19.x | 2024 |
| TypeScript | 5.5+ | 2024 |
| Tailwind CSS | 4.x | January 2025 |
| Drizzle ORM | 0.45+ | 2025 |
| TanStack Query | 5.x | 2024 |
| Zod | 4.x | 2025 |
| PostgreSQL | 16+ | 2023 |

---

## Sources

### Official Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [Drizzle ORM](https://orm.drizzle.team/)
- [TanStack Query](https://tanstack.com/query/v5)
- [Zod](https://zod.dev/)
- [DefiLlama API](https://api-docs.defillama.com/)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Comparisons & Analysis
- [Drizzle vs Prisma 2025](https://www.bytebase.com/blog/drizzle-vs-prisma/)
- [Neon vs Supabase](https://www.bytebase.com/blog/neon-vs-supabase/)
- [Next.js SEO Guide](https://prateeksha.com/blog/nextjs-app-router-seo-metadata-sitemaps-canonicals)
- [shadcn/ui 2025 Updates](https://ui.shadcn.com/docs/changelog)
