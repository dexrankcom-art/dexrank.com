---
phase: 03-content-differentiation
plan: 06
subsystem: content
tags: [mdx, guides, educational, seo]

dependency-graph:
  requires: ["03-01"]
  provides: ["16 educational guides", "guide listing page", "guide content utilities"]
  affects: ["seo-rankings", "user-education"]

tech-stack:
  added: []
  patterns: ["MDX content loading", "difficulty-based categorization", "guide frontmatter schema"]

key-files:
  created:
    - src/lib/content/guides.ts
    - src/app/guides/page.tsx
    - src/app/guides/[slug]/page.tsx
    - content/guides/what-is-a-dex.mdx
    - content/guides/dex-vs-cex.mdx
    - content/guides/how-to-use-a-dex.mdx
    - content/guides/liquidity-pools-explained.mdx
    - content/guides/impermanent-loss.mdx
    - content/guides/what-is-an-amm.mdx
    - content/guides/best-dex-for-beginners.mdx
    - content/guides/dex-fees-explained.mdx
    - content/guides/dex-security-guide.mdx
    - content/guides/choosing-the-right-chain.mdx
    - content/guides/dex-aggregators-explained.mdx
    - content/guides/concentrated-liquidity-strategies.mdx
    - content/guides/perp-dex-trading-guide.mdx
    - content/guides/mev-protection-guide.mdx
    - content/guides/yield-farming-strategies.mdx
    - content/guides/cross-chain-dex-guide.mdx
  modified: []

decisions:
  - id: guide-difficulty-tiers
    choice: "Three-tier system: beginner, intermediate, advanced"
    reason: "Matches STYLE_GUIDE.md length guidelines and enables progressive learning"
  - id: guide-organization
    choice: "Group by difficulty on listing page"
    reason: "Users can find content appropriate to their experience level"
  - id: content-interlinking
    choice: "Extensive cross-references between related guides"
    reason: "Improves user navigation and SEO internal linking"

metrics:
  duration: "28 minutes"
  completed: "2026-01-20"
---

# Phase 03 Plan 06: Educational Guides Summary

**One-liner:** 16 educational guides covering DEX fundamentals to advanced strategies with JSON-LD Article schema and difficulty-based organization.

## What Was Built

### Guide Content Utilities
- `getGuideBySlug()` - Load individual guide with frontmatter parsing
- `getAllGuideSlugs()` - Get all guide slugs for static generation
- `getAllGuides()` - Get guide list with metadata for listing page

### Guide Routes
- `/guides` - Listing page with guides grouped by difficulty (beginner/intermediate/advanced)
- `/guides/[slug]` - Individual guide pages with MDX rendering, JSON-LD Article schema

### Educational Content (16 Guides)

**Beginner (6 guides):**
1. What is a DEX - decentralized exchange fundamentals
2. DEX vs CEX - comparison of exchange types
3. How to Use a DEX - step-by-step first swap tutorial
4. Liquidity Pools Explained - LP and AMM basics
5. Impermanent Loss - IL explanation for liquidity providers
6. What is an AMM - automated market maker mechanics

**Intermediate (5 guides):**
1. Best DEX for Beginners - platform selection guide
2. DEX Fees Explained - trading, gas, and LP fee breakdown
3. DEX Security Guide - protecting funds from threats
4. Choosing the Right Chain - chain comparison for trading
5. DEX Aggregators Explained - Jupiter, 1inch, routing

**Advanced (5 guides):**
1. Concentrated Liquidity Strategies - Uniswap v3 LP tactics
2. Perp DEX Trading Guide - perpetual futures trading
3. MEV Protection Guide - sandwich attack defense
4. Yield Farming Strategies - LP farming and risk assessment
5. Cross-Chain DEX Guide - bridging and cross-chain security

## Technical Details

### Guide Frontmatter Schema
```typescript
interface GuideFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}
```

### SEO Features
- JSON-LD Article schema on each guide page
- OpenGraph metadata with published/modified dates
- Descriptive titles and meta descriptions
- Internal linking between related guides

### Content Quality
- All guides follow STYLE_GUIDE.md
- No forbidden phrases (verified via grep)
- Beginner guides: 1500-2500 words
- Intermediate guides: 1000-1500 words
- Advanced guides: 800-1200 words

## Verification Results

| Check | Result |
|-------|--------|
| Build passes | PASS |
| 16 guides exist | PASS (6 beginner + 5 intermediate + 5 advanced) |
| Difficulty badges display | PASS |
| Last updated dates shown | PASS |
| JSON-LD schema present | PASS |
| No forbidden phrases | PASS |
| Static generation working | PASS (16 guide pages generated) |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | 9362a74 | Create guide content utilities and routes |
| 2 | 6326518 | Create 6 core beginner guide MDX files |
| 3 | 7ed945a | Create 10 intermediate/advanced guide MDX files |

## Next Phase Readiness

**Ready for 03-07 (SEO & Metadata Enhancements):**
- Guide pages have JSON-LD Article schema in place
- All pages have meta descriptions
- Internal linking structure established

**Content updates in future:**
- Guides reference current platforms and data
- Will need periodic review as DeFi landscape changes
