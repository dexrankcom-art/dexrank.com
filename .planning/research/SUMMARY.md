# Research Summary: DexRank

**Project:** DexRank - DEX Comparison and Ranking Platform
**Domain:** DeFi Comparison/Ranking Platform
**Researched:** 2026-01-17
**Confidence:** HIGH

---

## Executive Summary

DexRank is a database-first, SEO-optimized DEX comparison platform that aggregates data from DefiLlama to provide transparent rankings of decentralized exchanges. The research conclusively points to Next.js 15.5 with App Router, Drizzle ORM with PostgreSQL (Neon), and a server-component-heavy architecture that prioritizes SEO and Core Web Vitals. The key differentiator from competitors like DeFiLlama (data-only), DexScreener (trader-focused), and CoinGecko (broad coverage) is DexRank's combination of transparent ranking methodology, in-depth editorial reviews, and head-to-head comparison tools.

The recommended approach is to build data infrastructure first, establishing a database-first pattern where DefiLlama data is synced hourly to PostgreSQL rather than fetched on-demand. This prevents the critical single-point-of-failure pitfall and enables ISR/SSG for SEO performance. The content strategy must prioritize editorial differentiation (500+ unique words per DEX page) to avoid Google's thin content penalties under YMYL guidelines, which have hit 71% of affiliate sites with templated content.

The primary risks are: (1) DefiLlama API dependency requiring robust sync and graceful degradation, (2) thin content penalties from Google's December 2025 Core Update targeting templated affiliate pages, and (3) FTC disclosure compliance for affiliate monetization. Mitigation comes through database-first architecture, mandatory editorial content per page, and prominent disclosure implementation from the start.

---

## Recommended Stack

The stack is optimized for SEO performance, developer experience, and operational simplicity.

**Core technologies:**
- **Next.js 15.5** with App Router: Full-stack React framework with SSR/SSG, ISR, and Server Components for SEO-critical pages
- **React 19**: Required by Next.js 15+, provides Server Components and Suspense
- **TypeScript 5.5+**: End-to-end type safety across the stack
- **Tailwind CSS 4.x**: 5x faster builds with Oxide engine, CSS-first configuration
- **shadcn/ui**: Copy-paste component library built on Radix UI for accessible, customizable components
- **Drizzle ORM 0.45+**: Type-safe SQL ORM with 14x lower latency than Prisma, ~7KB bundle
- **PostgreSQL 16+ (Neon)**: Serverless PostgreSQL with scale-to-zero, instant branching for preview deployments
- **TanStack Query 5.x**: Client-side data fetching with Suspense support
- **Zod 4.x**: Runtime validation with 14x faster parsing, @zod/mini for client bundle
- **Vercel**: Native Next.js hosting with built-in cron jobs for data sync

**Critical versions:**
- Next.js 15.5 (not 16 yet - 16 removes sync request API compatibility)
- Tailwind v4 (not v3 - significantly faster)
- Drizzle (not Prisma - lighter bundle, better serverless performance)

---

## Core Features for v1

### Must Have (Table Stakes)
- Real-time TVL, volume (24h/7d/30d), and fee metrics from DefiLlama
- 30-40 DEX coverage (top DEXs by volume)
- Multi-chain filtering (top 10 chains minimum)
- Basic search, filter, and sort functionality
- Mobile responsive design (40%+ traffic is mobile)
- Security indicators (audit status, hack history)
- Transparent methodology page (core differentiator)

### Should Have (Competitive Differentiators)
- 30-40 in-depth editorial DEX reviews with 500+ unique words each
- Head-to-head comparison tool (e.g., /compare/uniswap-vs-sushiswap)
- Chain-specific landing pages (SEO optimization: "Best DEXs on Solana")
- Risk/safety composite scores
- Fees breakdown calculator

### Defer (v2+)
- Real-time trading/swaps (regulatory complexity)
- Wallet connection (security liability, not core to comparison)
- Portfolio tracking (CoinGecko/DexScreener already dominate)
- Native mobile apps (PWA sufficient initially)
- User accounts and authentication
- Public API

---

## Architecture Overview

The architecture follows a database-first pattern with clear separation between data sync, data access, and presentation layers.

```
DefiLlama API --> Sync Service (Cron) --> PostgreSQL --> Server Components --> Next.js Pages
                                              |
                                              +--> Ranking Engine (computed scores)
                                              |
                                              +--> Affiliate Click Tracking
```

**Major components:**

1. **Data Sync Service** (`/src/lib/sync/`): Fetches data from DefiLlama API on schedule (hourly for hot data, 6-hourly for full sync), transforms and persists to PostgreSQL. Owns all external API communication.

2. **Data Layer** (`/src/db/`): Drizzle ORM with typed schemas for dexes, metrics (time-series), editorial content, comparisons, and affiliate clicks. Provides typed queries for all components.

3. **Ranking Engine** (`/src/lib/ranking/`): Calculates composite scores (0-100) from raw metrics using weighted factors: TVL (25%), Volume (20%), Fee efficiency (15%), Security (15%), Liquidity depth (15%), User growth (10%).

4. **Server Components**: Direct database queries, SSG with ISR for DEX pages (revalidate: 3600), URL-based filtering via searchParams.

5. **Affiliate Tracking** (`/src/lib/affiliate/`): Server-side click logging with attribution metadata, redirects to partner URLs with referral params.

**Build order:** Database schema -> Sync service -> Homepage rankings -> DEX review pages -> Comparison tool -> Affiliate tracking -> Cron automation -> SEO optimization

---

## Critical Pitfalls to Avoid

### 1. DefiLlama Single Point of Failure (P0)
**Risk:** Entire site becomes non-functional during API downtime/rate limiting.
**Prevention:** Database-first architecture from day one. Sync data on schedule, serve from database. Show "last updated X hours ago" with stale data vs. errors. Consider CoinGecko API as backup.

### 2. Thin Content / Scaled Content Abuse Penalty (P0)
**Risk:** Google's December 2025 Core Update hit 71% of affiliate sites with templated content. YMYL (Your Money, Your Life) standards apply to crypto.
**Prevention:** Minimum 500+ unique words per DEX page. 30-40% differentiation between similar pages. Human editorial layer for every page. E-E-A-T signals: author credentials, methodology transparency.

### 3. FTC Disclosure Non-Compliance (P0)
**Risk:** Civil penalties up to $53,088 per violation. Kim Kardashian's $1M crypto fine shows enforcement is serious.
**Prevention:** Prominent disclosure near every affiliate link (not just footer). Clear language: "We earn commission for purchases made through these links." Consistent application on every page.

### 4. Core Web Vitals Failure (P1)
**Risk:** Only 47% of sites meet CWV thresholds. 8-35% losses in conversions/rankings. 75%+ traffic is mobile.
**Prevention:** LCP < 2.5s, INP < 200ms, CLS < 0.1. Server-rendered tables, image optimization, virtual scrolling for large tables, skeleton screens to prevent CLS.

### 5. Trust Erosion from Affiliate Bias (P1)
**Risk:** Users suspect rankings influenced by commissions. Once trust lost, users don't return.
**Prevention:** Transparent methodology page. Data-driven rankings (TVL, volume, fees determine position, not commissions). Editorial independence documented.

---

## Phase Implications

Based on research, the following phase structure is recommended:

### Phase 1: Data Foundation
**Rationale:** Everything depends on data infrastructure. Database-first architecture prevents DefiLlama SPOF pitfall. Must establish before any UI work.
**Delivers:** PostgreSQL schema, Drizzle ORM setup, DefiLlama sync service, manual sync trigger
**Features:** Data aggregation infrastructure (TVL, volume, fees)
**Avoids:** Single point of failure, stale data issues
**Stack:** PostgreSQL (Neon), Drizzle ORM, TypeScript, Zod for validation

### Phase 2: Core Pages
**Rationale:** Needs data layer complete. Homepage rankings are primary user entry point. DEX pages provide SEO foundation.
**Delivers:** Homepage with rankings table, individual DEX pages with metrics, basic ranking algorithm
**Features:** Real-time metrics display, basic search/sort, DEX profile pages
**Architecture:** Server Components with direct DB queries, SSG with ISR

### Phase 3: Content & Differentiation
**Rationale:** SEO requires content differentiation. Editorial content must come before scaling pages. Methodology page is core differentiator.
**Delivers:** 30-40 in-depth DEX reviews, methodology page, comparison tool, chain-specific landing pages
**Features:** Editorial reviews, head-to-head comparisons, transparent methodology
**Avoids:** Thin content penalty, YMYL compliance issues

### Phase 4: Monetization & Production
**Rationale:** Affiliate tracking requires content and pages to be in place. Cron automation for production stability.
**Delivers:** Affiliate click tracking, automated data sync, FTC-compliant disclosures, SEO metadata
**Features:** Affiliate integration, automated sync, structured data (JSON-LD)
**Avoids:** FTC non-compliance, manual sync dependency

### Phase Ordering Rationale

- **Data before UI:** All display features depend on having reliable, fresh data. Building UI first would require mocking or direct API calls, creating technical debt.
- **Core pages before content:** Editorial content sits on top of page structure. Can't write DEX reviews without DEX pages.
- **Content before monetization:** Affiliate links need pages to live on. Trust-building content should precede revenue extraction.
- **Architecture dictates order:** Sync service -> database -> server components -> client interactivity is the natural Next.js App Router pattern.

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (Content):** SEO content strategy is nuanced. May need specific research on programmatic SEO patterns that don't trigger penalties.
- **Phase 4 (Monetization):** Affiliate program terms vary by DEX. Direct relationship setup may require research.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Data):** Well-documented patterns for Next.js + Drizzle + PostgreSQL. DefiLlama API is straightforward.
- **Phase 2 (Core Pages):** Standard Next.js App Router patterns for SSG/ISR.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Official docs, stable releases, production-proven. Next.js 15.5, Drizzle, Tailwind v4 all verified. |
| Features | HIGH | Competitor analysis verified against 6+ platforms. Feature priorities clear from market. |
| Architecture | HIGH | Next.js App Router patterns well-documented. Database-first is industry standard. |
| Pitfalls | HIGH | Multiple verified sources. Google updates, FTC penalties, CWV thresholds all documented. |

**Overall confidence:** HIGH

### Gaps to Address

- **Ranking algorithm weights:** Proposed weights (TVL 25%, Volume 20%, etc.) need validation with real data. May need tuning post-launch.
- **Affiliate program specifics:** Which DEXes offer affiliate programs, commission rates, and terms need research during Phase 4 planning.
- **Editorial content scale:** 30-40 reviews at launch is ambitious. May need to validate capacity or adjust scope.
- **Backup data source:** CoinGecko API as DefiLlama backup needs API investigation if redundancy is critical.

---

## Open Questions

1. **Content creation capacity:** Can 30-40 in-depth reviews be created for launch, or should scope be reduced to 10-15?
2. **Neon vs Supabase:** Both are viable. Neon recommended for scale-to-zero and branching, but Supabase offers auth if needed later.
3. **Comparison page strategy:** Generate all possible comparisons programmatically, or start with top 20 high-value matchups?
4. **Mobile strategy:** PWA sufficient, or native app needed for v1?
5. **Admin interface:** CMS for editorial content, or direct database/code management initially?

---

## Sources

### Primary (HIGH confidence)
- [Next.js 15.5 Release Notes](https://nextjs.org/blog/next-15-5)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [DefiLlama API Documentation](https://api-docs.defillama.com/)
- [Tailwind CSS v4 Release](https://tailwindcss.com/blog/tailwindcss-v4)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

### Secondary (MEDIUM confidence)
- [Drizzle vs Prisma Comparison](https://www.bytebase.com/blog/drizzle-vs-prisma/)
- [Neon vs Supabase](https://www.bytebase.com/blog/neon-vs-supabase/)
- [Core Web Vitals 2025 Guide](https://uxify.com/blog/post/core-web-vitals)
- [Google December 2025 Core Update Analysis](https://almcorp.com/blog/google-december-2025-core-update-complete-guide/)

### Tertiary (Domain-specific)
- [DeFiLlama DEX Rankings](https://defillama.com/dexs)
- [DexScreener Guide](https://www.bitbond.com/resources/dex-screener-the-ultimate-guide/)
- [DexTools Analysis](https://www.bitbond.com/resources/dextools-the-ultimate-guide/)
- [FTC Disclosure Guidelines 2025](https://influencermarketinghub.com/ftc-disclosure-checklist-by-platform/)
- [Crypto SEO Guide](https://ninjapromo.io/cryptocurrency-seo-guide)

---

*Research completed: 2026-01-17*
*Ready for roadmap: yes*
