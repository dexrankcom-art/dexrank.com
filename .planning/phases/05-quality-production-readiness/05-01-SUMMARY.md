---
phase: 05-quality-production-readiness
plan: 01
subsystem: infra
tags: [sentry, error-handling, web-vitals, monitoring, fonts]

# Dependency graph
requires:
  - phase: 04-production-polish
    provides: Complete UI components and dark mode theming
provides:
  - Error boundaries with Sentry integration
  - 404 page with navigation
  - Web Vitals monitoring component
  - Font loading optimization (display swap)
affects: [deployment, production monitoring, SEO]

# Tech tracking
tech-stack:
  added: ["@sentry/nextjs"]
  patterns: ["error boundary pattern", "instrumentation registration", "Web Vitals reporting"]

key-files:
  created:
    - src/app/error.tsx
    - src/app/global-error.tsx
    - src/app/not-found.tsx
    - sentry.client.config.ts
    - sentry.server.config.ts
    - sentry.edge.config.ts
    - src/instrumentation.ts
    - src/app/_components/web-vitals.tsx
  modified:
    - next.config.ts
    - src/app/providers.tsx
    - src/app/layout.tsx

key-decisions:
  - "Sentry SDK for error monitoring with source map upload"
  - "Web Vitals beacon endpoint for future analytics"
  - "Explicit font-display: swap for Lighthouse compliance"

patterns-established:
  - "Error boundary: useEffect with Sentry.captureException"
  - "Instrumentation: conditional import based on NEXT_RUNTIME"
  - "Global error: inline styles (no CSS dependency)"

# Metrics
duration: 27min
completed: 2026-01-20
---

# Phase 5 Plan 1: Error Monitoring & Production Resilience Summary

**Sentry error monitoring with error boundaries, 404 navigation page, Web Vitals tracking, and font loading optimization**

## Performance

- **Duration:** 27 min
- **Started:** 2026-01-20T13:28:14Z
- **Completed:** 2026-01-20T13:54:49Z
- **Tasks:** 3
- **Files modified:** 11

## Accomplishments

- Error boundaries catch component failures with helpful UI and Sentry reporting
- 404 page guides users to working content with multiple navigation options
- Sentry SDK configured for client, server, and edge runtime error capture
- Web Vitals component measures LCP, FID, CLS, INP, FCP, TTFB
- Font configuration uses explicit display: swap for FOIT prevention

## Task Commits

Each task was committed atomically:

1. **Task 1: Error Boundaries and 404 Page** - `ee1dc00` (feat)
2. **Task 2: Sentry Error Monitoring Setup** - `e171739` (feat)
3. **Task 3: Web Vitals Monitoring and Font Loading** - `75421d3` (feat)

## Files Created/Modified

- `src/app/error.tsx` - Route-level error boundary with Sentry integration
- `src/app/global-error.tsx` - Root layout error boundary with inline styles
- `src/app/not-found.tsx` - 404 page with navigation to DEXs, guides, chains
- `sentry.client.config.ts` - Client-side Sentry init with replay integration
- `sentry.server.config.ts` - Server-side Sentry init
- `sentry.edge.config.ts` - Edge runtime Sentry init
- `src/instrumentation.ts` - Next.js instrumentation with Sentry registration
- `next.config.ts` - Wrapped with withSentryConfig for source maps
- `src/app/_components/web-vitals.tsx` - Web Vitals reporting component
- `src/app/providers.tsx` - Added WebVitals to provider tree
- `src/app/layout.tsx` - Added display: swap to font configuration

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Error monitoring | Sentry SDK | Industry standard, supports Next.js with source maps |
| Source maps | Upload then delete | Security (hide code), debug (preserve traces) |
| Web Vitals endpoint | Beacon to /api/analytics/vitals | Reliable on page unload, future-proof for analytics |
| Font display | Explicit swap | Ensures Lighthouse pass, documents intentional choice |
| Global error styles | Inline CSS | Cannot rely on global CSS when root layout fails |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Updated Sentry config API**
- **Found during:** Task 2 (Sentry configuration)
- **Issue:** `hideSourceMaps` deprecated in @sentry/nextjs, TypeScript compile error
- **Fix:** Changed to `sourcemaps: { deleteSourcemapsAfterUpload: true }`
- **Files modified:** next.config.ts
- **Verification:** Build passes with updated API
- **Committed in:** e171739 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** API change was necessary for successful build. No scope creep.

## Issues Encountered

- Build lock file conflicts during verification - resolved with rm -rf .next

## Completed Todos

The following pending todos were completed by this plan:
- Create 404 page with helpful navigation
- Add error boundaries with fallback UI
- Set up error monitoring (Sentry)
- Optimize font loading for LCP
- Add Real User Monitoring for Core Web Vitals

## User Setup Required

**External services require manual configuration for production:**

**Sentry Setup:**
1. Create Sentry project at sentry.io (Platform: Next.js)
2. Add environment variables:
   - `NEXT_PUBLIC_SENTRY_DSN` - From Project Settings > Client Keys
   - `SENTRY_AUTH_TOKEN` - From Settings > Auth Tokens (for source maps)
   - `SENTRY_ORG` - Organization slug
   - `SENTRY_PROJECT` - Project slug

**Verification:**
- Local: Build passes, errors log to console
- Production: Throw test error, check Sentry dashboard for capture

## Next Phase Readiness

- Error resilience in place - production errors will be captured
- Web Vitals data available for performance monitoring
- Sentry DSN needs to be configured for production error reporting
- Analytics endpoint (/api/analytics/vitals) can be implemented when needed

---
*Phase: 05-quality-production-readiness*
*Completed: 2026-01-20*
