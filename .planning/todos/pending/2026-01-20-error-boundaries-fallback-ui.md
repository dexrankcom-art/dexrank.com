---
created: 2026-01-20T03:50
title: Add error boundaries with fallback UI
area: ui
files: []
---

## Problem

No error boundaries in the app. If a component throws (bad data, runtime error), the entire page crashes to a white screen. Users see nothing helpful, and errors are hard to diagnose.

This is critical for:
- DEX pages that depend on external data
- Client components (rankings table, filters, charts)
- Dynamic routes with potentially missing data

## Solution

1. Create `ErrorBoundary` component with branded fallback UI
2. Wrap key sections:
   - Rankings table (show "Unable to load rankings" with retry)
   - DEX page metrics (show "Metrics unavailable" gracefully)
   - Comparison tool (handle missing DEX data)
3. Create `error.tsx` files for route-level error handling
4. Include "Report issue" link in fallback UI
5. Log errors to Sentry (pairs with error monitoring todo)

Next.js 14 supports `error.tsx` convention for route error boundaries.
