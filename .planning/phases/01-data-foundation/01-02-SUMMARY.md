---
phase: 01-data-foundation
plan: 02
subsystem: data-pipeline
tags: [defillama, api, sync, cron, zod, drizzle]

dependency-graph:
  requires: ["01-01"]
  provides: ["defillama-client", "sync-service", "cron-endpoint"]
  affects: ["01-03", "02-*"]

tech-stack:
  added: ["exponential-backoff", "zod"]
  patterns: ["api-client-with-retry", "upsert-sync", "cron-job"]

key-files:
  created:
    - src/lib/defillama/types.ts
    - src/lib/defillama/client.ts
    - src/lib/sync/protocols.ts
    - src/lib/sync/volumes.ts
    - src/lib/sync/index.ts
    - src/app/api/cron/sync/route.ts
    - vercel.json
  modified: []

decisions:
  - id: filter-dex-categories
    choice: "Filter protocols by category (Dexes, Derivatives, Lending, etc)"
    reason: "DefiLlama returns ~7000 protocols; filtering to DEX-related categories reduces to ~1500 manageable protocols"
  - id: volume-matching-by-name
    choice: "Match volume data by protocol name (case-insensitive)"
    reason: "DefiLlama volume endpoint uses different IDs than protocols endpoint; name matching is reliable"
  - id: metrics-as-history
    choice: "Insert new metrics records rather than update existing"
    reason: "Preserves TVL/volume history for trend analysis and charts"

metrics:
  duration: "20 minutes"
  completed: "2026-01-18"
---

# Phase 01 Plan 02: DefiLlama API & Sync Pipeline Summary

**One-liner:** DefiLlama API client with Zod validation, protocol/volume sync service with batch upserts, and Vercel cron endpoint for 6-hour automated sync.

## Objective

Build the DefiLlama API integration and sync pipeline that populates the database with DEX data, making the "Database contains 100+ DEXs" requirement true.

## Tasks Completed

| Task | Name | Commit | Status |
|------|------|--------|--------|
| 1 | Create DefiLlama API client with Zod validation | 7b782c7 | Complete |
| 2 | Create sync service with upsert logic | b76c1f2 | Complete |
| 3 | Create cron endpoint with Vercel configuration | a9e24ce | Complete |

## Key Deliverables

### DefiLlama API Client
- **src/lib/defillama/types.ts** - Zod schemas for API response validation
  - `ProtocolSchema` - TVL data from /protocols endpoint
  - `DexProtocolSchema` - Volume data from /overview/dexs endpoint
  - Handles nullable fields and optional properties gracefully

- **src/lib/defillama/client.ts** - HTTP client with retry logic
  - Uses `exponential-backoff` library (3 attempts, 1-10s delays)
  - `fetchProtocols()` - Gets all protocols with TVL
  - `fetchDexVolumes()` - Gets DEX volume metrics

### Sync Service
- **src/lib/sync/protocols.ts** - Protocol synchronization
  - Filters to DEX-related categories (Dexes, Derivatives, Lending, etc.)
  - Upserts chains, protocols, and protocol-chain relationships
  - Inserts new metrics records (preserves history)
  - Batch processing in chunks of 100

- **src/lib/sync/volumes.ts** - Volume synchronization
  - Matches volumes to existing protocols by name
  - Updates latest metrics record with volume data

- **src/lib/sync/index.ts** - Orchestration
  - `syncAll()` runs protocols then volumes sequentially
  - Returns count and duration metrics

### Cron Endpoint
- **src/app/api/cron/sync/route.ts** - HTTP endpoint for scheduled sync
  - CRON_SECRET authentication (dev mode bypasses)
  - 60-second max duration
  - Records success/failure to syncStatus table

- **vercel.json** - Cron configuration
  - Schedule: every 6 hours (0:00, 6:00, 12:00, 18:00 UTC)

## Verification Results

| Check | Result |
|-------|--------|
| API client fetches protocols | 7000+ protocols fetched |
| API client fetches volumes | 300+ DEX volumes fetched |
| Protocols synced to database | 1559 protocols |
| Volumes matched and updated | 41 volumes |
| Cron endpoint accessible | localhost:3000/api/cron/sync returns success |
| Sync duration acceptable | ~20 seconds |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Made volume fields optional in Zod schema**
- **Found during:** Task 1 verification
- **Issue:** DefiLlama API sometimes returns null for total24h/total7d/total30d
- **Fix:** Changed `.nullable()` to `.optional().nullable()` in DexProtocolSchema
- **Files modified:** src/lib/defillama/types.ts

**2. [Rule 1 - Bug] Handle null volume values in sync**
- **Found during:** Task 2 verification
- **Issue:** Null volume values caused upsert failures
- **Fix:** Added explicit `?? null` coalescing when updating metrics
- **Files modified:** src/lib/sync/volumes.ts

## Architecture Decisions

### Why filter by category?
DefiLlama returns ~7000 protocols total. We filter to DEX-related categories to:
- Reduce sync time from minutes to seconds
- Keep database focused on relevant protocols
- Avoid storing data we'll never display

### Why insert metrics as history?
Instead of updating a single metrics row per protocol, we insert new rows:
- Enables TVL/volume trend charts
- Preserves historical data for analysis
- Simple append-only pattern

### Why match volumes by name?
The /protocols and /overview/dexs endpoints use different ID systems:
- /protocols uses string IDs like "uniswap"
- /overview/dexs uses module names like "uniswap-v3"
- Name matching (case-insensitive) provides reliable linking

## Next Phase Readiness

### Ready for Plan 01-03 (API Layer)
- Database populated with 1559 DEX protocols
- TVL and volume metrics available for 41 active DEXs
- Data refreshes automatically every 6 hours

### Notes for Future Work
- Consider adding defillamaModule field to protocols table for better volume matching
- May want to add separate sync for chain-specific TVL breakdown
- Volume matching could be improved with fuzzy matching or mapping table
