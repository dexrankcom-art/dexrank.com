---
created: 2026-01-20T00:00
title: Add canonical URLs for duplicate content
area: seo
files: []
---

## Problem

Potential duplicate content issues:
- DEX appears on chain page AND main rankings
- Comparison pages may overlap (A vs B, B vs A)
- Filter/sort URL params could create duplicate URLs

Without canonical tags, Google may index wrong version or split ranking authority.

## Solution

Add `<link rel="canonical">` to all pages:
- DEX pages: canonical to `/dex/[slug]`
- Chain pages: canonical to `/chain/[chain]`
- Comparison pages: alphabetical order canonical (`/compare/aave-vs-uniswap` not `/compare/uniswap-vs-aave`)
- Filtered views: canonical to unfiltered base URL

Use Next.js metadata API to set canonical URLs.
