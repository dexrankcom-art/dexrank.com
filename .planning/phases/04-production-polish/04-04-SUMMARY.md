---
phase: 04
plan: 04
subsystem: animation
tags:
  - loading-states
  - skeleton
  - stagger-animation
  - motion-library
dependency_graph:
  requires:
    - "04-01"
  provides:
    - StaggerRows animation component
    - Review page loading skeleton
    - Chain page loading skeleton
  affects:
    - Homepage table UX
    - Page navigation experience
tech_stack:
  added: []
  patterns:
    - "useAnimate for orchestrated animations"
    - "data-row selector pattern"
    - "Next.js loading.tsx convention"
key_files:
  created:
    - src/components/animated/stagger-rows.tsx
    - src/app/reviews/[slug]/loading.tsx
    - src/app/chains/[slug]/loading.tsx
  modified:
    - src/components/rankings/data-table.tsx
decisions:
  - id: motion-imports
    choice: "useAnimate from motion/react-mini, stagger from motion/react"
    reason: "react-mini only exports useAnimate; stagger requires full motion/react"
metrics:
  duration: "21 minutes"
  completed: "2026-01-20"
---

# Phase 4 Plan 4: Loading States Summary

Staggered table row animations and skeleton loading states for key pages using Motion library's minimal bundle.

## What Was Built

### 1. StaggerRows Animation Component
Created `src/components/animated/stagger-rows.tsx`:
- Wraps table elements to provide staggered row entrance animation
- Uses `useAnimate` hook from motion/react-mini for orchestration
- Uses `stagger` function from motion/react for timing delays
- Configurable stagger delay (default 50ms between rows)
- Fully respects `prefers-reduced-motion` accessibility setting
- Uses `data-row` selector pattern for targeting animated rows

### 2. Rankings Table Integration
Updated `src/components/rankings/data-table.tsx`:
- Wrapped table with StaggerRows component
- Added `data-row` attribute to each TableRow
- Table rows now cascade in with smooth stagger effect

### 3. Review Page Loading Skeleton
Created `src/app/reviews/[slug]/loading.tsx`:
- Skeleton layout matches ReviewHeader, MetricsGrid, ScoreBreakdown, ReviewSections
- 4-column metrics grid placeholder
- Score breakdown progress bars
- Content section text placeholders
- Uses existing Skeleton component with shimmer animation

### 4. Chain Page Loading Skeleton
Created `src/app/chains/[slug]/loading.tsx`:
- Skeleton layout matches ChainHeader and ChainDexList
- 3-column stats grid placeholder
- 10-row DEX list table placeholder
- Description text placeholders

## Task Completion

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Create StaggerRows animation component | c22013b | Complete |
| 2 | Apply StaggerRows to rankings data table | 7846544 | Complete |
| 3 | Create review page loading skeleton | 349d7ab | Complete |
| 4 | Create chain page loading skeleton | 6aa3732 | Complete |

## Verification Results

| Check | Result |
|-------|--------|
| npm run build completes | PASS |
| TypeScript check passes | PASS |
| StaggerRows component created | PASS |
| data-row attribute on table rows | PASS |
| Review page loading.tsx exists | PASS |
| Chain page loading.tsx exists | PASS |

## Technical Details

### Motion Library Usage
- `useAnimate` from `motion/react-mini` (2.3KB) for animation orchestration
- `stagger` from `motion/react` for delay calculation
- Animation: opacity 0->1, y 8px->0 over 200ms with easeOut
- Stagger delay: 50ms between each row by default

### Reduced Motion Support
The StaggerRows component checks `prefers-reduced-motion` media query:
- If reduced motion preferred: Rows appear instantly (opacity set to 1)
- Animation ref prevents re-running on subsequent renders

### Skeleton Structure
Loading skeletons use the existing `Skeleton` component which has:
- `animate-pulse` CSS animation
- Configurable dimensions via className
- Background color from theme (bg-accent)

## Deviations from Plan

### Import Adjustment
**Found during:** Task 1
**Issue:** `motion/react-mini` only exports `useAnimate`, not `stagger`
**Fix:** Import `stagger` from `motion/react` instead
**Impact:** Minimal - stagger is tree-shaken from full bundle

## Files Modified

```
src/
  components/
    animated/
      stagger-rows.tsx          # NEW - Staggered animation wrapper
    rankings/
      data-table.tsx            # MODIFIED - Added StaggerRows wrapper
  app/
    reviews/[slug]/
      loading.tsx               # NEW - Review page skeleton
    chains/[slug]/
      loading.tsx               # NEW - Chain page skeleton
```

## Next Phase Readiness

All loading states are in place:
- Table stagger animations working
- Review and chain pages have loading skeletons
- Accessibility (reduced motion) fully supported
- Ready for 04-06 (PWA Support)
