---
phase: 03
plan: 07
subsystem: content/seo
tags: [methodology, transparency, seo, user-trust]
dependency-graph:
  requires: [03-01]
  provides: [methodology-page, transparency-content, internal-linking]
  affects: []
tech-stack:
  added: []
  patterns: [weight-visualization, factor-cards]
key-files:
  created:
    - src/app/how-we-rank/page.tsx
    - src/components/methodology/weight-visualization.tsx
    - src/components/methodology/factor-card.tsx
  modified:
    - src/app/page.tsx
    - src/components/rankings/columns.tsx
    - src/components/reviews/score-breakdown.tsx
    - src/app/guides/[slug]/page.tsx
decisions:
  - id: weight-colors
    choice: Blue for TVL (60%), Green for Volume (40%)
    reason: Visually distinct colors for immediate recognition
metrics:
  duration: ~7min
  completed: 2026-01-20
---

# Phase 3 Plan 7: SEO & Metadata Enhancements Summary

**One-liner:** Transparent methodology page at /how-we-rank with weight visualization and info icon links from ranking table

## What Was Built

### 1. Methodology Page Components
- **WeightVisualization:** Visual horizontal bar showing score composition with legend
- **FactorCard:** Explanation cards for each ranking factor with calculation details and data source

### 2. How We Rank Page (/how-we-rank)
- Full methodology explanation with 60/40 TVL/Volume weight distribution
- Percentile normalization explained
- Handling of missing data documented
- Future factors section (security, fees, growth, reviews)
- Transparency commitment statement
- SEO metadata (title, description, OpenGraph)

### 3. Internal Linking
- Homepage: "Learn how we rank" link in description
- Ranking table: Info icon in DexRank column header
- Review pages: "How we calculate scores" link in score breakdown

## Files Changed

| File | Change |
|------|--------|
| src/components/methodology/weight-visualization.tsx | Created - visual weight bar |
| src/components/methodology/factor-card.tsx | Created - factor explanation cards |
| src/app/how-we-rank/page.tsx | Created - 158 lines methodology page |
| src/app/page.tsx | Added Link import and methodology link |
| src/components/rankings/columns.tsx | Added Info icon with link in DexRank header |
| src/components/reviews/score-breakdown.tsx | Added methodology link after score |
| src/app/guides/[slug]/page.tsx | Fixed dynamic import issue (blocking) |

## Commits

1. `2d4521d` - feat(03-07): create methodology page components
2. `14a48da` - feat(03-07): create /how-we-rank methodology page
3. `81d7f90` - feat(03-07): add methodology links to homepage, ranking table, and reviews

## Verification

| Criterion | Status |
|-----------|--------|
| /how-we-rank page loads | PASS |
| Weight visualization shows 60/40 split | PASS |
| Factor cards explain TVL and Volume | PASS |
| Future factors listed | PASS |
| Homepage has methodology link | PASS |
| Ranking table has info icon | PASS |
| Review pages have methodology link | PASS |
| SEO metadata present | PASS |
| Build passes | PASS |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed guides page dynamic MDX import**
- **Found during:** Task 2 verification (npm run build)
- **Issue:** Dynamic import `await import('@/content/guides/${slug}.mdx')` failed because Turbopack requires content files at build time
- **Fix:** Replaced dynamic import with inline content rendering using dangerouslySetInnerHTML
- **Files modified:** src/app/guides/[slug]/page.tsx
- **Commit:** 14a48da (included with Task 2)

## Technical Notes

- Methodology page is statically generated (no dynamic data)
- Weight values hardcoded in page for now (could import from weights.ts)
- Info icon uses sr-only span for accessibility
- Page links to /guides which may or may not have content

## Success Criteria Met

- [x] METH-01: "How We Rank" page at /how-we-rank
- [x] METH-02: Shows weight distribution for each factor
- [x] METH-03: Linked from homepage and rankings
- [x] TODO: Add methodology link in ranking table header (info icon in DexRank Score column)
- [x] Explains percentile normalization approach
- [x] Mentions future factors (security, user reviews)
- [x] Transparency commitment stated
