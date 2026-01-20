---
phase: 04-production-polish
plan: 06
subsystem: seo
tags: [og-images, social-sharing, twitter-cards, next-js]
dependency-graph:
  requires:
    - 04-05
    - 04-07
  provides:
    - Dynamic OG images for all key pages
    - Twitter card support
    - Social sharing previews
  affects:
    - All pages (via meta tags)
    - Social media sharing
tech-stack:
  added: []
  patterns:
    - ImageResponse from next/og
    - Flexbox-only layouts for OG images
    - Re-export pattern for Twitter images
file-tracking:
  key-files:
    created:
      - src/app/opengraph-image.tsx
      - src/app/twitter-image.tsx
      - src/app/reviews/[slug]/opengraph-image.tsx
      - src/app/reviews/[slug]/twitter-image.tsx
      - src/app/chains/[slug]/opengraph-image.tsx
      - src/app/chains/[slug]/twitter-image.tsx
    modified:
      - src/lib/data/chains.ts
decisions:
  - id: og-brand-colors
    choice: "Hex colors (#1a0a2e, #4ade80)"
    reason: "OKLCH not supported in ImageResponse"
  - id: twitter-reexport
    choice: "Re-export from opengraph-image"
    reason: "Same image for both og:image and twitter:image"
metrics:
  duration: ~3 minutes
  completed: 2026-01-20
---

# Phase 4 Plan 6: Social Sharing Summary

Dynamic Open Graph images for rich social sharing previews.

## One-liner

ImageResponse-based OG images with brand colors for homepage, DEX reviews, and chain pages.

## What Was Built

### 1. Homepage OG Image
- **File:** `src/app/opengraph-image.tsx`
- **Features:**
  - DexRank branding with star icon
  - Purple background (#1a0a2e) with green accent (#4ade80)
  - Stats: 500+ DEXs, 27+ chains
  - 1200x630px PNG format

### 2. DEX Review OG Images
- **File:** `src/app/reviews/[slug]/opengraph-image.tsx`
- **Features:**
  - Protocol name and category display
  - TVL with green accent color
  - 24h volume metric
  - Number formatting (B/M/K suffixes)
  - Fallback for missing protocols

### 3. Chain Page OG Images
- **File:** `src/app/chains/[slug]/opengraph-image.tsx`
- **Features:**
  - Chain name with circular icon
  - DEX count from database
  - "Top DEXs on [Chain]" tagline
  - Fallback for missing chains

### 4. Twitter Card Support
- **Files:**
  - `src/app/twitter-image.tsx`
  - `src/app/reviews/[slug]/twitter-image.tsx`
  - `src/app/chains/[slug]/twitter-image.tsx`
- **Pattern:** Re-export from opengraph-image for consistent cards

### 5. Helper Function
- **File:** `src/lib/data/chains.ts`
- **Added:** `getProtocolCountByChain(chainSlug)` for chain OG images

## Technical Details

### ImageResponse Constraints
- **No CSS Grid:** Flexbox-only layouts
- **No OKLCH:** Must use hex colors
- **Params Promise:** Must `await params` in Next.js 16+

### Number Formatting
```typescript
function formatNumber(num: number | null | undefined): string {
  if (!num) return '$0';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}
```

## Routes Created

| Route | Type | Description |
|-------|------|-------------|
| `/opengraph-image` | Static | Homepage OG image |
| `/twitter-image` | Static | Homepage Twitter card |
| `/reviews/[slug]/opengraph-image` | Dynamic | DEX review OG image |
| `/reviews/[slug]/twitter-image` | Dynamic | DEX review Twitter card |
| `/chains/[slug]/opengraph-image` | Dynamic | Chain page OG image |
| `/chains/[slug]/twitter-image` | Dynamic | Chain page Twitter card |

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 517f9a2 | feat | add homepage OG and Twitter images |
| 15e1302 | feat | add dynamic DEX review OG image |
| f57e5b6 | feat | add dynamic chain page OG image |
| 7937263 | feat | add Twitter image re-exports for key routes |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- [x] `npm run build` completes without errors
- [x] `/opengraph-image` route registered
- [x] `/reviews/[slug]/opengraph-image` route registered
- [x] `/chains/[slug]/opengraph-image` route registered
- [x] Twitter image routes registered
- [x] Brand colors used (purple background, green accent)

## Next Phase Readiness

Phase 4 complete. All production polish features implemented:
- Animation foundation
- Page transitions
- Micro-interactions
- Loading states
- Dark mode
- Social sharing
- Technical SEO

Ready for Phase 5 (Launch Preparation) or final verification.
