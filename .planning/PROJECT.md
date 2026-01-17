# DexRank

## What This Is

DexRank is a comprehensive decentralized exchange (DEX) comparison and ranking platform that helps crypto traders discover, compare, and choose the best DEX for their specific needs. The platform provides real-time metrics, transparent rankings, and in-depth reviews across 100+ DEXs on all major blockchain networks. It's a rebuild of the existing dexrank.vercel.app with improved architecture and expanded scope.

## Core Value

Accurate, real-time DEX data and transparent rankings that users can trust to make informed trading decisions.

## Requirements

### Validated

(None yet — ship to validate)

### Active

#### Data & Rankings (Core)
- [ ] DefiLlama API integration with data sync to local database
- [ ] Real-time metrics: TVL, 24h/7d/30d volume, fees, trading pairs
- [ ] Ranking algorithm with transparent scoring (TVL, volume, security, liquidity, user growth, trust)
- [ ] Multi-chain support: Ethereum, Solana, Arbitrum, Base, BSC, Polygon, Optimism, Avalanche, zkSync
- [ ] Background data refresh with caching strategy

#### Homepage & Rankings
- [ ] Homepage displaying top DEXs with real-time metrics
- [ ] Filterable by chain, DEX type (spot/perp/hybrid), category
- [ ] Sortable by ranking score, TVL, volume, fees
- [ ] "How We Rank" methodology page with transparent algorithm explanation

#### DEX Review Pages
- [ ] 30-40 comprehensive DEX review pages at launch
- [ ] Templated structure with data-driven sections
- [ ] Editorial "Editor's Take" sections for unique insights
- [ ] SEO-optimized: meta tags, schema markup, canonical URLs
- [ ] Real-time metrics pulled from database
- [ ] Affiliate CTAs with proper tracking

#### Comparison Tool
- [ ] Side-by-side comparison at `/compare`
- [ ] Dynamic URL structure: `/compare/[dex-1]-vs-[dex-2]`
- [ ] Feature-by-feature comparison table
- [ ] Use case recommendations ("Best for...")

#### Technical Foundation
- [ ] Next.js 14+ with App Router
- [ ] Tailwind CSS + shadcn/ui component library
- [ ] PostgreSQL database (Supabase or Railway)
- [ ] Server-side rendering for SEO
- [ ] Core Web Vitals optimized (<3s load time)
- [ ] Mobile-responsive design
- [ ] XML sitemap generation

### Out of Scope

- AI chatbot/recommendation engine — Future phase, after core platform is solid
- CMS integration (Directus/Sanity) — Decide later, focus on data layer first
- Multi-language support (DE, FR, SE) — v2+ feature
- Newsletter system — v2+ feature
- API access for developers — Future monetization phase
- Video reviews/content — Future content expansion
- Premium listings/sponsored content — After organic traffic established
- News section — v2+ feature

## Context

**Existing Work**: Rebuilding dexrank.vercel.app with improved architecture. The existing site provides visual and conceptual reference but will be rebuilt from scratch.

**Cross-promotion**: BitcoinDaily.nl is a related property that can provide backlinks and audience cross-promotion.

**Primary Data Source**: DefiLlama API (free tier, 150 calls/minute)
- Coverage: 100+ DEXs across 65+ chains
- Data: TVL, volume, fees, protocol details

**Monetization Model**: Affiliate partnerships with DEXs (Hyperliquid, GMX, dYdX, 1inch, etc.) via referral links.

**Target Keywords**:
- "best dex" (8,100/mo)
- "dex comparison" (1,300/mo)
- "best decentralized exchange" (2,400/mo)
- "[dex name] review" (100-500/mo each)

**Content Strategy**: Templated + data-driven reviews with editorial sections. 30-40 at launch, growing 3-5/week to 100+.

## Constraints

- **Tech Stack**: Next.js 14+, Tailwind CSS, shadcn/ui, PostgreSQL — Non-negotiable
- **Data Source**: DefiLlama API as primary source (free tier limitations: 150 calls/min)
- **SEO Priority**: Every page must be SSR/SSG capable, schema markup, Core Web Vitals compliant
- **Budget**: Solo developer, minimal external costs initially ($100-200/mo)
- **Content**: No author attribution to individuals — "DexRank Editorial Team" only
- **Assets**: Real logos from official sources only — no emoji placeholders

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Database-first data strategy | Better SEO (page speed, reliability, SSR capability) | — Pending |
| Templated + editorial content | Scalable while maintaining trust (E-E-A-T compliant) | — Pending |
| 30-40 reviews at launch | Quality over quantity, avoids Helpful Content penalty | — Pending |
| AI chatbot deferred | Focus on data foundation first, chatbot needs content | — Pending |
| CMS decision deferred | Data layer is priority, content management can come later | — Pending |

---
*Last updated: 2026-01-17 after initialization*
