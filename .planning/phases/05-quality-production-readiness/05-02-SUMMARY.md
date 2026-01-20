---
phase: 05-quality-production-readiness
plan: 02
subsystem: seo
tags: [breadcrumbs, canonical-urls, json-ld, structured-data, next-metadata]

# Dependency graph
requires:
  - phase: 03-content-differentiation
    provides: JSON-LD schema patterns
  - phase: 04-production-polish
    provides: Page structure for all nested pages
provides:
  - Breadcrumbs component with UI and BreadcrumbList JSON-LD
  - Canonical URLs on all pages via metadataBase
  - SEO-optimized navigation structure
affects: [future-seo-enhancements, google-search-console]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - Breadcrumbs as reusable component with JSON-LD
    - metadataBase + alternates.canonical pattern

key-files:
  created:
    - src/components/seo/breadcrumbs.tsx
  modified:
    - src/app/layout.tsx
    - src/app/reviews/[slug]/page.tsx
    - src/app/chains/[slug]/page.tsx
    - src/app/categories/[slug]/page.tsx
    - src/app/guides/[slug]/page.tsx
    - src/app/compare/[slugs]/page.tsx
    - next.config.ts

key-decisions:
  - "Breadcrumbs include JSON-LD inline (not via separate JsonLd component)"
  - "Last breadcrumb item has no 'item' property per Google spec"
  - "metadataBase set globally, canonical as relative paths per page"

patterns-established:
  - "Breadcrumbs pattern: import, render at top of main"
  - "Canonical URL pattern: alternates.canonical in generateMetadata"

# Metrics
duration: 25min
completed: 2026-01-20
---

# Phase 5 Plan 2: Breadcrumbs & Canonical URLs Summary

**Breadcrumb navigation with BreadcrumbList JSON-LD on all nested pages plus canonical URLs via metadataBase**

## Performance

- **Duration:** 25 min
- **Started:** 2026-01-20T13:28:17Z
- **Completed:** 2026-01-20T13:53:45Z
- **Tasks:** 3
- **Files modified:** 8

## Accomplishments
- Breadcrumbs component with Home > Section > Page pattern
- BreadcrumbList JSON-LD schema for Google rich results
- Canonical URLs set via metadataBase + alternates.canonical
- Breadcrumbs added to reviews, chains, categories, guides, compare pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Breadcrumbs Component with JSON-LD** - `5a11b65` (feat)
2. **Task 2: Add Breadcrumbs to All Nested Pages** - `38be1c3` (feat)
3. **Task 3: Canonical URLs via metadataBase** - `f5026aa` (feat)

## Files Created/Modified
- `src/components/seo/breadcrumbs.tsx` - Breadcrumbs UI and JSON-LD component
- `src/app/layout.tsx` - Added metadataBase for canonical URLs
- `src/app/reviews/[slug]/page.tsx` - Added Breadcrumbs and canonical
- `src/app/chains/[slug]/page.tsx` - Added Breadcrumbs and canonical
- `src/app/categories/[slug]/page.tsx` - Added Breadcrumbs and canonical
- `src/app/guides/[slug]/page.tsx` - Added Breadcrumbs and canonical
- `src/app/compare/[slugs]/page.tsx` - Added Breadcrumbs and canonical
- `next.config.ts` - Fixed Sentry sourcemaps config

## Decisions Made
- Breadcrumbs include JSON-LD inline rather than via separate JsonLd component (co-located for easy reuse)
- Last breadcrumb item omits 'item' property per Google structured data spec
- Home uses icon, other items use text names
- metadataBase set at root layout level, canonical as relative paths in each page

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Sentry config for newer SDK**
- **Found during:** Task 2 (npm run build verification)
- **Issue:** `hideSourceMaps` property doesn't exist in SentryBuildOptions (SDK 10.x)
- **Fix:** Changed to `sourcemaps: { deleteSourcemapsAfterUpload: true }`
- **Files modified:** next.config.ts
- **Verification:** TypeScript compiles, build passes
- **Committed in:** 38be1c3 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Auto-fix necessary for build to pass. No scope creep.

## Issues Encountered
- Windows permission issues prevented cleaning .next cache directory; resolved by verifying TypeScript compilation independently

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Breadcrumb navigation ready for Google rich results
- Canonical URLs will prevent duplicate content issues
- Ready for remaining Phase 5 plans (error handling, performance)

---
*Phase: 05-quality-production-readiness*
*Completed: 2026-01-20*
