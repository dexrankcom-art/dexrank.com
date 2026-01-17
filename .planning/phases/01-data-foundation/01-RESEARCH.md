# Phase 1: Data Foundation - Research

**Researched:** 2026-01-17
**Domain:** DefiLlama API integration, Drizzle ORM + Neon PostgreSQL, Next.js 15 scheduled sync
**Confidence:** HIGH (verified via official documentation)

## Summary

This research covers the implementation approach for a reliable data infrastructure that syncs DEX metrics from DefiLlama to a Neon PostgreSQL database. The architecture follows a database-first pattern where data is synced on a schedule rather than fetched on demand, preventing single-point-of-failure and enabling fast page loads.

Key findings:
1. **DefiLlama provides free, unauthenticated API endpoints** for TVL and DEX volume data at `api.llama.fi`. Rate limits are generous (historically 500 req/min, no strict enforcement for reasonable use).
2. **Drizzle ORM with Neon HTTP driver** is the optimal stack for serverless Next.js. The `neon-http` driver is faster for single queries; pooled connections mask cold starts.
3. **Vercel Cron Jobs** with `CRON_SECRET` authentication is the standard approach for scheduled syncs in Next.js 15. Hobby plan allows 2 cron jobs (hourly precision); Pro allows 40 (minute precision).

**Primary recommendation:** Build a sync service that runs via Vercel cron, fetches from DefiLlama's free API, and upserts to Neon PostgreSQL using Drizzle's `onConflictDoUpdate`. Implement exponential backoff for API resilience and cache fallback for graceful degradation.

## Standard Stack

The established libraries/tools for this domain:

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `drizzle-orm` | 0.38+ | TypeScript ORM | Type-safe, lightweight, serverless-optimized |
| `@neondatabase/serverless` | 0.10+ | Neon HTTP/WS driver | Official driver for Vercel/serverless |
| `drizzle-kit` | 0.30+ | Migrations CLI | Schema push and migration generation |
| `exponential-backoff` | 3.1+ | Retry logic | Battle-tested exponential backoff with jitter |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `dotenv` | 16+ | Environment variables | Local development only |
| `zod` | 3.23+ | Schema validation | Validate API responses before DB insert |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Drizzle | Prisma | Prisma has larger bundle, slower cold starts, but better tooling |
| exponential-backoff | Custom retry | Custom requires handling jitter, max attempts, backoff calculation |
| Vercel Cron | GitHub Actions | GH Actions is free but adds deployment complexity |

**Installation:**
```bash
npm install drizzle-orm @neondatabase/serverless exponential-backoff zod
npm install -D drizzle-kit dotenv tsx
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── db/
│   ├── index.ts           # Database connection singleton
│   ├── schema.ts          # All table definitions
│   └── migrations/        # Generated migrations (if using migrate)
├── lib/
│   ├── defillama/
│   │   ├── client.ts      # API client with retry logic
│   │   ├── types.ts       # Response type definitions
│   │   └── endpoints.ts   # Endpoint constants
│   └── sync/
│       ├── protocols.ts   # Protocol sync logic
│       ├── volumes.ts     # Volume sync logic
│       └── index.ts       # Orchestrator
├── app/
│   └── api/
│       └── cron/
│           └── sync/
│               └── route.ts  # Cron endpoint
drizzle/                   # Migration files (at project root)
drizzle.config.ts          # Drizzle Kit config
vercel.json                # Cron schedule config
```

### Pattern 1: Database Connection Singleton

**What:** Single db instance exported from `src/db/index.ts`
**When to use:** Always - prevents connection pool exhaustion in serverless
**Example:**
```typescript
// src/db/index.ts
// Source: https://orm.drizzle.team/docs/get-started/neon-new
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
```

### Pattern 2: Upsert with `onConflictDoUpdate`

**What:** Insert or update records in a single atomic operation
**When to use:** Every sync operation - prevents duplicates, updates existing data
**Example:**
```typescript
// Source: https://orm.drizzle.team/docs/guides/upsert
import { sql } from 'drizzle-orm';
import { db } from '@/db';
import { protocols } from '@/db/schema';

const protocolData = [
  { slug: 'uniswap', name: 'Uniswap', tvl: 5000000000 },
  { slug: 'aave', name: 'Aave', tvl: 12000000000 },
];

await db
  .insert(protocols)
  .values(protocolData)
  .onConflictDoUpdate({
    target: protocols.slug,
    set: {
      name: sql.raw(`excluded.${protocols.name.name}`),
      tvl: sql.raw(`excluded.${protocols.tvl.name}`),
      updatedAt: new Date(),
    },
  });
```

### Pattern 3: Exponential Backoff for API Calls

**What:** Retry failed requests with increasing delays
**When to use:** All DefiLlama API calls
**Example:**
```typescript
// Source: https://www.npmjs.com/package/exponential-backoff
import { backOff } from 'exponential-backoff';

async function fetchWithRetry<T>(url: string): Promise<T> {
  return backOff(
    async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json() as T;
    },
    {
      numOfAttempts: 3,
      startingDelay: 1000,
      maxDelay: 10000,
      jitter: 'full',
      retry: (error, attemptNumber) => {
        console.warn(`Attempt ${attemptNumber} failed:`, error.message);
        // Retry on 429 (rate limit) and 5xx errors
        const status = error.message.match(/HTTP (\d+)/)?.[1];
        return !status || status === '429' || status >= '500';
      },
    }
  );
}
```

### Pattern 4: Vercel Cron with CRON_SECRET

**What:** Secure cron endpoint that only Vercel can trigger
**When to use:** All scheduled sync endpoints
**Example:**
```typescript
// app/api/cron/sync/route.ts
// Source: https://vercel.com/docs/cron-jobs/manage-cron-jobs
import { NextRequest } from 'next/server';

export const maxDuration = 60; // seconds - adjust based on sync complexity

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    // Run sync logic
    const result = await syncAllData();
    return Response.json({ success: true, ...result });
  } catch (error) {
    console.error('Sync failed:', error);
    return Response.json({ success: false, error: String(error) }, { status: 500 });
  }
}
```

### Pattern 5: Reusable Timestamp Columns

**What:** Automatic createdAt/updatedAt for all tables
**When to use:** Every table definition
**Example:**
```typescript
// src/db/schema.ts
// Source: https://orm.drizzle.team/docs/latest-releases/drizzle-orm-v0305
import { timestamp } from 'drizzle-orm/pg-core';

export const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
};

// Usage in table
export const protocols = pgTable('protocols', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  // ... other columns
  ...timestamps,
});
```

### Anti-Patterns to Avoid

- **Fetching data on page load:** Always read from database, never call DefiLlama on user requests
- **Single large sync function:** Split into smaller, focused sync tasks (protocols, volumes, chains separately)
- **Ignoring API errors:** Always implement retry logic and fallback to cached data
- **Using raw SQL strings:** Use Drizzle's type-safe query builder
- **Creating new db connections per request:** Use singleton pattern

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Retry logic | Custom while loops | `exponential-backoff` | Handles jitter, max delay, attempt counting, error filtering |
| API response validation | Manual type assertions | `zod` schemas | Runtime validation, type inference, detailed errors |
| Database migrations | Manual SQL files | `drizzle-kit` | Schema diffing, migration generation, push for dev |
| Connection pooling | Custom pool management | Neon pooler (`-pooler` suffix) | PgBouncer built-in, 10k connections, cold start masking |
| Cron scheduling | node-cron, custom timers | Vercel Cron | Works in serverless, managed infrastructure |
| UUID generation | Custom functions | `crypto.randomUUID()` | Built into Node.js, cryptographically secure |

**Key insight:** Serverless environments kill processes between requests. Anything relying on persistent state (like node-cron timers) will not work. Use managed services (Vercel Cron) or external triggers (GitHub Actions).

## Common Pitfalls

### Pitfall 1: Serverless Cold Starts with Neon

**What goes wrong:** First request after idle period takes 500ms-2s due to Neon compute activation
**Why it happens:** Neon scales to zero on free/hobby tiers; compute must wake up
**How to avoid:**
- Use pooled connection strings (`-pooler` suffix) which maintain warm connections
- For paid plans, disable auto-suspend in Neon dashboard
- Implement graceful degradation: show cached data while fresh data loads
**Warning signs:** Intermittent slow responses, timeout errors on first request

### Pitfall 2: Rate Limiting Without Backoff

**What goes wrong:** API returns 429 errors, sync fails completely
**Why it happens:** Burst requests without delays trigger rate limits
**How to avoid:**
- Implement exponential backoff with jitter
- Add small delays between batch requests (`await sleep(100)`)
- Cache successful responses to reduce API calls
**Warning signs:** Sporadic 429 errors, incomplete syncs

### Pitfall 3: Missing CRON_SECRET Validation

**What goes wrong:** Anyone can trigger your sync endpoint, causing unexpected costs/load
**Why it happens:** Developers skip auth check during development, forget to add it
**How to avoid:**
- Always validate `Authorization: Bearer ${CRON_SECRET}` header
- Add CRON_SECRET to Vercel environment variables
- Test auth locally with curl
**Warning signs:** Unexpected function invocations, high bandwidth usage

### Pitfall 4: Drizzle Schema vs Database Drift

**What goes wrong:** Code expects columns that don't exist in database
**Why it happens:** Schema changes in code not applied to database
**How to avoid:**
- Use `drizzle-kit push` for development
- Use `drizzle-kit generate` + `drizzle-kit migrate` for production
- CI/CD should run migrations before deployment
**Warning signs:** "column does not exist" errors, type mismatches

### Pitfall 5: Vercel Hobby Plan Cron Limitations

**What goes wrong:** Crons run at unexpected times or don't run at all
**Why it happens:** Hobby plan has hourly granularity only; timing not guaranteed to the minute
**How to avoid:**
- Hobby: schedule for top of the hour (e.g., `0 * * * *` for hourly)
- Hobby: only 2 cron jobs allowed
- Pro: minute-level precision, up to 40 cron jobs
**Warning signs:** Cron logs show irregular execution times

### Pitfall 6: Large Response Payloads

**What goes wrong:** `/protocols` endpoint returns 3-5MB of data, causing timeouts
**Why it happens:** Full protocol list includes all chains, historical data
**How to avoid:**
- Fetch specific protocols/chains when possible
- Process in batches, not all at once
- Set appropriate `maxDuration` (60-300s depending on plan)
**Warning signs:** Function timeouts, memory errors

## Code Examples

Verified patterns from official sources:

### DefiLlama API Client

```typescript
// src/lib/defillama/client.ts
import { backOff } from 'exponential-backoff';
import { z } from 'zod';

const BASE_URLS = {
  tvl: 'https://api.llama.fi',
  volumes: 'https://api.llama.fi',
} as const;

// Source: https://api-docs.defillama.com/llms.txt
const ProtocolSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  symbol: z.string().optional(),
  category: z.string().optional(),
  chains: z.array(z.string()),
  tvl: z.number().nullable(),
  chainTvls: z.record(z.string(), z.number()).optional(),
  change_1h: z.number().nullable().optional(),
  change_1d: z.number().nullable().optional(),
  change_7d: z.number().nullable().optional(),
  logo: z.string().optional(),
  url: z.string().optional(),
});

const ProtocolsResponseSchema = z.array(ProtocolSchema);

export type Protocol = z.infer<typeof ProtocolSchema>;

export async function fetchProtocols(): Promise<Protocol[]> {
  const data = await fetchWithRetry<unknown>(`${BASE_URLS.tvl}/protocols`);
  return ProtocolsResponseSchema.parse(data);
}

// DEX Volume response schema
const DexVolumeSchema = z.object({
  totalVolume24h: z.number().nullable(),
  protocols: z.array(z.object({
    name: z.string(),
    displayName: z.string().optional(),
    module: z.string(),
    category: z.string().optional(),
    logo: z.string().optional(),
    chains: z.array(z.string()),
    total24h: z.number().nullable(),
    total7d: z.number().nullable(),
    total30d: z.number().nullable(),
    change_1d: z.number().nullable().optional(),
    change_7d: z.number().nullable().optional(),
    change_1m: z.number().nullable().optional(),
  })),
});

export type DexVolume = z.infer<typeof DexVolumeSchema>;

export async function fetchDexVolumes(): Promise<DexVolume> {
  const data = await fetchWithRetry<unknown>(`${BASE_URLS.volumes}/overview/dexs`);
  return DexVolumeSchema.parse(data);
}

async function fetchWithRetry<T>(url: string): Promise<T> {
  return backOff(
    async () => {
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    },
    {
      numOfAttempts: 3,
      startingDelay: 1000,
      maxDelay: 10000,
      jitter: 'full',
    }
  );
}
```

### Database Schema

```typescript
// src/db/schema.ts
// Source: https://orm.drizzle.team/docs/get-started/neon-new
import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  real,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Reusable timestamps
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
};

// Supported blockchain networks
export const chains = pgTable('chains', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  chainId: integer('chain_id'),
  logo: text('logo'),
  ...timestamps,
});

// DEX protocols
export const protocols = pgTable('protocols', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  defillamaId: varchar('defillama_id', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  symbol: varchar('symbol', { length: 50 }),
  category: varchar('category', { length: 100 }),
  logo: text('logo'),
  url: text('url'),
  description: text('description'),
  ...timestamps,
}, (table) => [
  index('protocols_category_idx').on(table.category),
]);

// Protocol chain associations (many-to-many)
export const protocolChains = pgTable('protocol_chains', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  protocolId: integer('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  chainId: integer('chain_id').notNull().references(() => chains.id, { onDelete: 'cascade' }),
  ...timestamps,
}, (table) => [
  uniqueIndex('protocol_chain_unique').on(table.protocolId, table.chainId),
]);

// TVL and volume metrics (time-series)
export const protocolMetrics = pgTable('protocol_metrics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  protocolId: integer('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  tvl: real('tvl'),
  tvlChange1h: real('tvl_change_1h'),
  tvlChange1d: real('tvl_change_1d'),
  tvlChange7d: real('tvl_change_7d'),
  volume24h: real('volume_24h'),
  volume7d: real('volume_7d'),
  volume30d: real('volume_30d'),
  volumeChange1d: real('volume_change_1d'),
  volumeChange7d: real('volume_change_7d'),
  chainTvls: jsonb('chain_tvls').$type<Record<string, number>>(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  ...timestamps,
}, (table) => [
  index('protocol_metrics_protocol_idx').on(table.protocolId),
  index('protocol_metrics_fetched_idx').on(table.fetchedAt),
]);

// Sync status tracking
export const syncStatus = pgTable('sync_status', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  syncType: varchar('sync_type', { length: 50 }).notNull().unique(), // 'protocols', 'volumes', 'full'
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  lastSuccessAt: timestamp('last_success_at', { withTimezone: true }),
  lastError: text('last_error'),
  recordsProcessed: integer('records_processed'),
  ...timestamps,
});
```

### Drizzle Configuration

```typescript
// drizzle.config.ts
// Source: https://orm.drizzle.team/docs/drizzle-config-file
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
```

### Vercel Cron Configuration

```json
// vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### Sync Route Handler

```typescript
// app/api/cron/sync/route.ts
import { NextRequest } from 'next/server';
import { db } from '@/db';
import { syncStatus } from '@/db/schema';
import { syncProtocols, syncVolumes } from '@/lib/sync';
import { eq } from 'drizzle-orm';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const startTime = Date.now();
  const results: Record<string, { success: boolean; count?: number; error?: string }> = {};

  try {
    // Sync protocols (TVL data)
    const protocolResult = await syncProtocols();
    results.protocols = { success: true, count: protocolResult.count };

    // Sync volumes
    const volumeResult = await syncVolumes();
    results.volumes = { success: true, count: volumeResult.count };

    // Update sync status
    await db
      .insert(syncStatus)
      .values({
        syncType: 'full',
        lastSyncAt: new Date(),
        lastSuccessAt: new Date(),
        recordsProcessed: protocolResult.count + volumeResult.count,
      })
      .onConflictDoUpdate({
        target: syncStatus.syncType,
        set: {
          lastSyncAt: new Date(),
          lastSuccessAt: new Date(),
          recordsProcessed: protocolResult.count + volumeResult.count,
          lastError: null,
        },
      });

    return Response.json({
      success: true,
      duration: Date.now() - startTime,
      results,
    });
  } catch (error) {
    console.error('Sync failed:', error);

    // Record failure
    await db
      .insert(syncStatus)
      .values({
        syncType: 'full',
        lastSyncAt: new Date(),
        lastError: String(error),
      })
      .onConflictDoUpdate({
        target: syncStatus.syncType,
        set: {
          lastSyncAt: new Date(),
          lastError: String(error),
        },
      });

    return Response.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
```

## DefiLlama API Reference

### Free Endpoints (No Authentication Required)

| Endpoint | Base URL | Purpose | Response |
|----------|----------|---------|----------|
| `/protocols` | `api.llama.fi` | All protocols with TVL | Array of protocol objects |
| `/protocol/{slug}` | `api.llama.fi` | Single protocol detail | Protocol with historical TVL |
| `/tvl/{protocol}` | `api.llama.fi` | Current TVL only | Number |
| `/chains` | `api.llama.fi` | All chains with TVL | Array of chain objects |
| `/overview/dexs` | `api.llama.fi` | All DEX volumes | Volume summary with protocols |
| `/overview/dexs/{chain}` | `api.llama.fi` | Chain-specific DEX volumes | Chain volume data |
| `/summary/dexs/{protocol}` | `api.llama.fi` | Protocol volume history | Historical volume data |

### Rate Limits

- **Free tier:** ~500 requests/minute (historically announced, reasonable use tolerated)
- **No hard enforcement** for reasonable use cases
- **Recommendation:** Add 100ms delay between batch requests, implement backoff

### Response Size Considerations

- `/protocols` returns 3-5MB (150+ protocols with full data)
- `/overview/dexs` returns 500KB-1MB
- Plan for large payloads: streaming, pagination if available, or batch processing

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Prisma ORM | Drizzle ORM | 2024 | Lighter bundles, faster serverless cold starts |
| `serial` primary keys | `identity` columns | PostgreSQL 10+ / Drizzle 2024 | SQL standard compliance, better defaults |
| Traditional connection | Neon HTTP driver | 2023-2024 | Faster single queries, better serverless fit |
| node-cron | Vercel Cron | 2023 | Works in serverless, no persistent process needed |
| Manual retry loops | exponential-backoff | Standard practice | Handles jitter, max delay, filtering automatically |

**Deprecated/outdated:**
- `getServerSideProps`: Use App Router `export const dynamic` instead
- Pages Router API routes: Use App Router route handlers
- Prisma for new serverless projects: Drizzle has better serverless story
- `serial()` columns in Drizzle: Use `generatedAlwaysAsIdentity()`

## Open Questions

Things that couldn't be fully resolved:

1. **Exact current rate limits for DefiLlama free tier**
   - What we know: Historically 500 req/min, reasonable use tolerated
   - What's unclear: Whether stricter limits now exist
   - Recommendation: Start conservative (1 req/sec), monitor for 429s, adjust

2. **Optimal sync frequency**
   - What we know: TVL/volume updates roughly hourly on DefiLlama
   - What's unclear: Whether more frequent syncs add value
   - Recommendation: Start with 6-hour sync, monitor data freshness needs

3. **Handling DefiLlama schema changes**
   - What we know: API response structure has been stable
   - What's unclear: How often fields are added/removed
   - Recommendation: Use Zod with `.passthrough()` for forward compatibility

## Sources

### Primary (HIGH confidence)
- [Drizzle ORM Neon Setup](https://orm.drizzle.team/docs/get-started/neon-new) - Connection, schema, migrations
- [Drizzle ORM Upsert Guide](https://orm.drizzle.team/docs/guides/upsert) - onConflictDoUpdate patterns
- [Drizzle ORM Timestamps](https://orm.drizzle.team/docs/guides/timestamp-default-value) - Default values
- [Neon Connection Pooling](https://neon.com/docs/connect/connection-pooling) - Pooler configuration
- [Vercel Cron Quickstart](https://vercel.com/docs/cron-jobs/quickstart) - Cron setup
- [Vercel Function Duration](https://vercel.com/docs/functions/configuring-functions/duration) - maxDuration config
- [DefiLlama API Docs (llms.txt)](https://api-docs.defillama.com/llms.txt) - Endpoints, response formats
- [exponential-backoff npm](https://www.npmjs.com/package/exponential-backoff) - Retry library usage

### Secondary (MEDIUM confidence)
- [Vercel Cron Secret Auth](https://codingcat.dev/post/how-to-secure-vercel-cron-job-routes-in-next-js-14-app-router) - CRON_SECRET pattern
- [Drizzle Best Practices 2025](https://gist.github.com/productdevbook/7c9ce3bbeb96b3fabc3c7c2aa2abc717) - Schema patterns
- [defillama_library Python](https://github.com/slurpxbt/defillama_library/blob/main/defillama.py) - Endpoint verification

### Tertiary (LOW confidence)
- DefiLlama rate limit tweet (2023) - Historical rate limit info

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via official Drizzle and Neon docs
- Architecture: HIGH - Patterns from official tutorials and guides
- DefiLlama API: MEDIUM - Verified endpoints, rate limits historical
- Pitfalls: MEDIUM - Combination of docs and community experience

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - stack is stable)
