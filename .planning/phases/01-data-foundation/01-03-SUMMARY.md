---
phase: 01-data-foundation
plan: 03
subsystem: data-access
tags: [drizzle, rest-api, typescript, caching]

dependency-graph:
  requires: ["01-01", "01-02"]
  provides: ["data-access-layer", "rest-api-endpoints", "offline-resilience"]
  affects: ["02-*"]

tech-stack:
  added: []
  patterns: ["data-access-layer", "rest-endpoints", "typed-queries"]

key-files:
  created:
    - src/lib/data/types.ts
    - src/lib/data/protocols.ts
    - src/lib/data/chains.ts
    - src/app/api/protocols/route.ts
    - src/app/api/protocols/[slug]/route.ts
    - src/app/api/chains/route.ts
  modified: []

decisions:
  - id: inferred-types
    choice: "Use InferSelectModel for TypeScript types"
    reason: "Keeps types in sync with schema automatically"
  - id: latest-metrics-subquery
    choice: "Use MAX(id) subquery for latest metrics"
    reason: "Efficient way to get most recent metrics per protocol"
  - id: force-dynamic
    choice: "Use force-dynamic on all API routes"
    reason: "Ensures fresh data from database on every request"

metrics:
  duration: "14 minutes"
  completed: "2026-01-18"
---

# Phase 01 Plan 03: API Layer & Offline Resilience Summary

**One-liner:** Typed data access layer with Drizzle ORM and REST API endpoints that serve cached DEX data, making the system fully operational when DefiLlama API is unavailable.

## Objective

Create the data access layer that serves cached database content to the application, proving the Phase 1 success criterion: "System serves cached data when DefiLlama API is unavailable."

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Create typed data access layer | 67e1447 | Complete |
| 2 | Create REST API endpoints | f67b9fb | Complete |
| 3 | Verify offline resilience | (verification only) | Complete |

## Key Deliverables

### Data Access Layer

- **src/lib/data/types.ts** - TypeScript types inferred from Drizzle schema
  - Protocol, Chain, ProtocolMetric, SyncStatus base types
  - ProtocolWithMetrics enriched type with related data
  - ProtocolListItem for listings
  - ProtocolFilters and sort options

- **src/lib/data/protocols.ts** - Protocol data access functions
  - `getProtocols(filters, sortBy, sortOrder)` - List protocols with metrics
  - `getProtocolBySlug(slug)` - Single protocol with full details
  - `getProtocolCount(filters)` - Total count for pagination
  - `getCategories()` - Unique protocol categories

- **src/lib/data/chains.ts** - Chain data access functions
  - `getChains()` - All chains with protocol counts
  - `getChainBySlug(slug)` - Single chain by slug

### REST API Endpoints

- **GET /api/protocols** - List protocols with filtering
  - Query params: chain, category, search, limit, offset, sortBy, sortOrder
  - Returns: { data: ProtocolListItem[], pagination: { total, limit, offset, hasMore } }

- **GET /api/protocols/[slug]** - Single protocol details
  - Returns: { data: ProtocolWithMetrics }

- **GET /api/chains** - List chains
  - Returns: { data: Chain[] } with protocol counts

## Verification Results

### Offline Resilience Test

| Check | Result |
|-------|--------|
| API endpoints return data when DefiLlama is blocked | PASS |
| Sync fails gracefully with error message | PASS |
| Existing database data preserved after failed sync | PASS |

### Phase 1 Success Criteria

| Criterion | Result |
|-----------|--------|
| Database contains 100+ DEXs | PASS (1559 protocols) |
| TVL and volume metrics refresh | PASS (sync runs every 6h) |
| Cached data when API unavailable | PASS (verified) |
| Drizzle ORM with TypeScript types | PASS (InferSelectModel) |
| Next.js with Tailwind and shadcn | PASS (app runs) |

## Deviations from Plan

None - plan executed exactly as written.

## Architecture Notes

### Data Access Pattern

The data access layer provides a clean separation between database queries and API routes:

```
API Route -> Data Access Function -> Drizzle ORM -> Neon PostgreSQL
```

This pattern enables:
- Type-safe queries throughout the stack
- Testable data access functions
- Easy caching layer addition in future
- Offline resilience (data served from DB cache)

### Latest Metrics Query

For performance, we use a subquery to get the latest metrics per protocol:

```sql
SELECT MAX(id) FROM protocol_metrics GROUP BY protocol_id
```

This avoids expensive window functions while still getting the most recent data.

## Next Phase Readiness

Phase 1 complete. The application now:
- Has 1559 DEX protocols in database
- Serves cached data via REST API endpoints
- Works offline from DefiLlama
- Refreshes data automatically every 6 hours

Ready for Phase 2: Rankings and Filtering
