---
phase: 02-core-pages-rankings
plan: 02
subsystem: ui
tags: [tanstack-table, nuqs, shadcn, react, next.js, rankings]

# Dependency graph
requires:
  - phase: 02-01
    provides: getProtocolsWithRanking function, RankedProtocol type, scoring algorithm
provides:
  - Homepage with rankings table
  - Filterable/sortable data table with TanStack Table
  - URL state management with nuqs
  - Responsive mobile layout
affects: [02-03-protocol-detail, 02-04-search-navigation]

# Tech tracking
tech-stack:
  added: [@tanstack/react-table@8.21.3, nuqs@2.8.6, shadcn/ui components]
  patterns: [Server Component data fetching, Client Component interactivity, URL state with nuqs]

key-files:
  created:
    - src/app/providers.tsx
    - src/hooks/use-protocol-filters.ts
    - src/components/rankings/columns.tsx
    - src/components/rankings/data-table.tsx
    - src/components/rankings/table-toolbar.tsx
    - src/components/rankings/rank-badge.tsx
    - src/components/ui/table.tsx
    - src/components/ui/button.tsx
    - src/components/ui/input.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/select.tsx
    - src/components/ui/skeleton.tsx
  modified:
    - src/app/layout.tsx
    - src/app/page.tsx
    - src/lib/data/protocols.ts

key-decisions:
  - "Use nuqs with shallow:false for URL state - triggers server re-render for SSR data fetching"
  - "Use useDeferredValue for search input - React 18 native debouncing without artificial delay"
  - "Use column meta hideOnMobile for responsive columns - clean pattern for mobile hiding"

patterns-established:
  - "Server-side filtering: Server Component fetches data, Client Components handle UI interaction"
  - "URL state persistence: All filter state in URL for shareability and back button support"
  - "Score tier colors: Green (80+), Blue (60-79), Yellow (40-59), Orange (20-39), Red (<20)"

# Metrics
duration: 16min
completed: 2026-01-18
---

# Phase 2 Plan 2: Homepage with Rankings Table Summary

**TanStack Table rankings page with nuqs URL state, search/filter/sort, and responsive column hiding**

## Performance

- **Duration:** 16 min
- **Started:** 2026-01-18T05:00:32Z
- **Completed:** 2026-01-18T05:16:30Z
- **Tasks:** 3
- **Files modified:** 14

## Accomplishments
- Full rankings table with DexRank scores, TVL, 24h volume, and categories
- Search, chain filter, and category filter with URL state preservation
- Sortable columns (DexRank, TVL, Volume) with TanStack Table
- Mobile responsive layout with hidden columns on small screens
- Pagination with server-side data fetching

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and add shadcn/ui components** - `b6517df` (feat)
2. **Task 2: Create rankings table components** - `2ba6860` (feat)
3. **Task 3: Build homepage with server-side data fetching** - `2364bbf` (feat)

## Files Created/Modified

**Created:**
- `src/app/providers.tsx` - NuqsAdapter wrapper for URL state
- `src/hooks/use-protocol-filters.ts` - URL filter state management with nuqs
- `src/components/rankings/columns.tsx` - TanStack Table column definitions
- `src/components/rankings/data-table.tsx` - Generic data table with sorting
- `src/components/rankings/table-toolbar.tsx` - Search and filter UI
- `src/components/rankings/rank-badge.tsx` - Score display with tier colors
- `src/components/ui/*.tsx` - 6 shadcn/ui components (table, button, input, badge, select, skeleton)

**Modified:**
- `src/app/layout.tsx` - Added Providers wrapper and updated metadata
- `src/app/page.tsx` - Complete homepage with rankings table
- `src/lib/data/protocols.ts` - Added getChainNames() function

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| URL state library | nuqs with shallow:false | Triggers server re-render for proper SSR data fetching |
| Search debouncing | useDeferredValue | React 18 native approach, no artificial delays |
| Responsive columns | TanStack meta.hideOnMobile | Clean pattern, CSS-based hiding |
| Page size | 50 protocols | Balance between data density and performance |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TypeScript readonly array error in useProtocolFilters**
- **Found during:** Task 2 (Create rankings table components)
- **Issue:** parseAsStringEnum expects mutable string[], const arrays are readonly
- **Fix:** Spread readonly arrays to create mutable copies: `[...sortFields]`
- **Files modified:** src/hooks/use-protocol-filters.ts
- **Verification:** TypeScript compiles without errors
- **Committed in:** 2ba6860 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor TypeScript fix, no scope creep.

## Issues Encountered
None - plan executed smoothly.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Homepage complete with full rankings functionality
- Protocol detail pages (02-03) can link from rankings table
- Search & navigation (02-04) can extend existing filter patterns
- All sorting and filtering working, ready for additional features

---
*Phase: 02-core-pages-rankings*
*Completed: 2026-01-18*
