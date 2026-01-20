---
phase: 03-content-differentiation
plan: 04
subsystem: chain-pages
tags: [seo, landing-pages, chains, isr]

dependency_graph:
  requires: [03-01]
  provides: [chain-landing-pages, chain-specific-ranking]
  affects: [03-07]

tech_stack:
  added: []
  patterns: [generateStaticParams for SSG, ISR with 1h revalidation, chain-specific protocol filtering]

key_files:
  created:
    - src/app/chains/[slug]/page.tsx
    - src/app/chains/[slug]/not-found.tsx
    - src/components/chain/chain-header.tsx
    - src/components/chain/chain-dex-list.tsx
  modified:
    - src/lib/data/chains.ts

decisions:
  - decision: Static generation strategy
    choice: generateStaticParams with dynamicParams=true
    reason: Pre-generate all 259 chains at build, allow new chains dynamically

metrics:
  duration: ~5min
  completed: 2026-01-20
---

# Phase 03 Plan 04: Chain Landing Pages Summary

Chain-specific landing pages for all 259 blockchains, capturing SEO traffic for chain-specific DEX queries.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 34e8f18 | feat | Extend chain data layer with protocol fetching |
| 240a57f | feat | Create chain page components |
| 033d09d | feat | Add chain page route with SEO and ISR |

## What Was Built

### Data Layer Extensions (src/lib/data/chains.ts)

- **getAllChainSlugs()**: Returns all chain slugs for static generation
- **getProtocolsByChain()**: Gets protocols for a specific chain with latest metrics, sorted by TVL descending
  - Joins protocols with protocol_chains and protocol_metrics
  - Returns protocols with id, slug, name, logo, category, tvl, volume24h, tvlChange1d
  - Returns totalCount for displaying total DEXs on chain

### Chain Components

- **ChainHeader** (src/components/chain/chain-header.tsx):
  - Displays chain logo, name, and tagline
  - Stats grid: DEX count, combined TVL, chain ID (if available)
  - Responsive design with 2-3 column grid

- **ChainDexList** (src/components/chain/chain-dex-list.tsx):
  - Ranked table of DEXs on the chain
  - Columns: Rank, DEX name/logo, Category badge, TVL, 24h Volume, 24h Change
  - Responsive: hides columns on smaller screens (sm/md/lg breakpoints)
  - Links to /reviews/[slug] for each protocol
  - Color-coded change values (green positive, red negative)

### Chain Page Route (src/app/chains/[slug]/page.tsx)

- **generateStaticParams**: Pre-generates pages for all 259 chains at build time
- **generateMetadata**: Dynamic SEO meta tags with chain name and protocol count
- **ISR**: 1-hour revalidation for fresh data without rebuild
- **JSON-LD**: WebPage schema via generateChainSchema()
- **dynamicParams=true**: Allows new chains to work immediately

### 404 Handling (src/app/chains/[slug]/not-found.tsx)

- Friendly error page for invalid chain slugs
- Link back to homepage

## Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Static generation | generateStaticParams | Pre-generate 259 pages for instant load |
| ISR revalidation | 1 hour | Balance fresh metrics with build performance |
| Protocol limit | 100 per chain | Sufficient for any chain's DEX ecosystem |

## Deviations from Plan

None - plan executed exactly as written. All components and routes implemented as specified.

## Verification Results

| Check | Result |
|-------|--------|
| Build passes | PASS (1832 pages total) |
| TypeScript compiles | PASS |
| 259 chain pages generated | PASS (+256 more paths) |
| Chain header shows stats | PASS |
| DEX list links to reviews | PASS |
| JSON-LD schema present | PASS |
| Responsive columns | PASS (hidden sm/md/lg) |

## Success Criteria Status

| Criterion | Status |
|-----------|--------|
| CHAIN-01: Each chain has page at /chains/[chain-slug] | PASS |
| CHAIN-02: Chain pages list top DEXs on that chain | PASS |
| CHAIN-04: Chain pages have SEO meta tags | PASS |
| CHAIN-05: 10+ chain pages at launch | PASS (259) |
| JSON-LD schema for all chain pages | PASS |

## Next Phase Readiness

Plan 03-05 (Category Landing Pages) can follow similar pattern:
- generateStaticParams for all categories
- Category header and protocol list components
- JSON-LD via generateCategorySchema()
