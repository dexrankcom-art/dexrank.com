---
phase: 03-content-differentiation
plan: 03
subsystem: comparison
tags: [seo, comparison, dynamic-routes, json-ld]

dependency-graph:
  requires: ["03-01"]
  provides: ["comparison-pages", "canonical-url-handling", "comparison-json-ld"]
  affects: ["internal-linking", "seo-coverage"]

tech-stack:
  added: []
  patterns: ["canonical-url-redirect", "winner-indicator", "side-by-side-comparison"]

key-files:
  created:
    - src/lib/comparison/utils.ts
    - src/app/compare/[slugs]/page.tsx
    - src/app/compare/[slugs]/not-found.tsx
    - src/components/comparison/winner-badge.tsx
    - src/components/comparison/comparison-header.tsx
    - src/components/comparison/metrics-comparison.tsx
    - src/components/comparison/feature-table.tsx
  modified: []

decisions:
  - id: "03-03-01"
    choice: "Alphabetical canonical URLs"
    reason: "Prevents duplicate content by always sorting slugs (pancakeswap-vs-uniswap, not uniswap-vs-pancakeswap)"
  - id: "03-03-02"
    choice: "Static generation for top 10 pairs"
    reason: "Pre-render most searched comparisons, on-demand for rest"
  - id: "03-03-03"
    choice: "Winner badges on metrics"
    reason: "Visual indication of which DEX wins each metric comparison"

metrics:
  duration: "~5 minutes"
  completed: "2026-01-20"
---

# Phase 03 Plan 03: DEX Comparison Engine Summary

Comparison pages at /compare/[dex-1]-vs-[dex-2] with canonical URL handling, side-by-side metrics with winner indicators, and JSON-LD ItemList schema.

## What Was Built

### Task 1: Comparison Utilities and Route Structure

Created the comparison infrastructure:

**src/lib/comparison/utils.ts:**
- `getCanonicalComparisonSlug(slug1, slug2)` - Alphabetizes slugs to prevent duplicate content
- `parseComparisonSlug(slugs)` - Parses "dex1-vs-dex2" URL format
- `getMetricWinner(value1, value2, higherIsBetter)` - Determines winner (1, 2, or 0 for tie)

**src/app/compare/[slugs]/page.tsx:**
- Dynamic route handling with Next.js
- Canonical URL redirect (non-alphabetical redirects to canonical)
- generateMetadata for SEO
- generateStaticParams pre-renders top 10 comparison pairs
- 1-hour ISR revalidation
- JSON-LD ItemList schema

**src/app/compare/[slugs]/not-found.tsx:**
- Custom 404 for invalid comparisons

### Task 2: Comparison UI Components

Built 4 components for the comparison interface:

**src/components/comparison/winner-badge.tsx:**
- Green "Winner" badge displayed next to winning metric

**src/components/comparison/comparison-header.tsx:**
- Side-by-side DEX logos and names
- Links to individual review pages
- DexRank scores and ranks displayed

**src/components/comparison/metrics-comparison.tsx:**
- Table comparing 6 key metrics:
  - DexRank Score
  - Total Value Locked
  - 24h Volume
  - 7d Volume
  - TVL Change (24h)
  - Supported Chains
- Winner highlighting with green text
- Formatted values (currency, percent, number)

**src/components/comparison/feature-table.tsx:**
- Side-by-side feature cards
- Category badges
- Supported chains with overflow handling
- Website links

## Verification Results

| Criterion | Status |
|-----------|--------|
| Build passes | PASS |
| /compare/pancakeswap-vs-uniswap shows comparison | PASS |
| /compare/uniswap-vs-pancakeswap redirects to canonical | PASS |
| Metrics table shows winner badges | PASS |
| JSON-LD ItemList schema present | PASS |
| Header links to review pages | PASS |
| 10 comparison pages pre-generated | PASS |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 9fcc8b2 | feat | Create comparison utilities and route structure |
| ebdf963 | feat | Build comparison UI components |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness

Ready to proceed. No blockers.

**Dependencies satisfied:**
- 03-01 content infrastructure (JSON-LD schemas, MDX components) - COMPLETE

**Can now proceed with:**
- 03-04 Chain Landing Pages
- 03-05 Category Landing Pages
- Additional comparison pairs as SEO targets identified
