# Roadmap: DexRank

## Overview

DexRank v1.0 delivers a database-first DEX comparison platform covering **500 DEXs across 27+ chains** in five phases. Phase 1 establishes data infrastructure (DefiLlama sync to PostgreSQL). Phase 2 builds the homepage rankings, basic DEX pages with real-time metrics, and comprehensive sitemap planning (570+ URLs). Phase 3 adds editorial content, comparison tools, chain pages, guides, and methodology transparency for SEO differentiation. Phase 4 delivers modern 2026 UI polish with performant animations, dark mode, social sharing, and newsletter signup. Phase 5 enhances data depth with historical TVL/volume charts and security indicators.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Data Foundation** - Database schema, DefiLlama sync, data reliability
- [x] **Phase 2: Core Pages & Rankings** - Homepage, ranking algorithm, basic DEX pages
- [ ] **Phase 3: Content & Differentiation** - Editorial reviews, comparisons, chain pages, guides, methodology
- [ ] **Phase 4: Production & Polish** - Animations, dark mode, SEO, social sharing, newsletter
- [ ] **Phase 5: Data Enhancements** - Historical charts, security indicators, trust signals

## Phase Details

### Phase 1: Data Foundation
**Goal**: Reliable data infrastructure that syncs DEX metrics from DefiLlama to a local database, preventing single-point-of-failure and enabling fast page loads.
**Depends on**: Nothing (first phase)
**Requirements**: DATA-01, DATA-02, DATA-03, DATA-04, DATA-05, DATA-06, TECH-01, TECH-02, TECH-03
**Success Criteria** (what must be TRUE):
  1. Database contains 100+ DEXs with metadata (name, logo, chains, type)
  2. TVL and volume metrics (24h/7d/30d) refresh automatically on schedule
  3. System serves cached data when DefiLlama API is unavailable
  4. Developer can query DEX data via Drizzle ORM with full TypeScript types
  5. Next.js app scaffolding exists with Tailwind and shadcn/ui configured
**Plans**: 3 plans in 3 waves (sequential)

Plans:
- [x] 01-01-PLAN.md — Project scaffolding, Drizzle schema, Neon PostgreSQL, shadcn/ui setup
- [x] 01-02-PLAN.md — DefiLlama API client, sync service, Vercel cron endpoint
- [x] 01-03-PLAN.md — Data access layer, cache fallback, API endpoints

### Phase 2: Core Pages & Rankings
**Goal**: Users can browse DEX rankings on the homepage, filter/sort/search, and view individual DEX pages with real-time metrics. Comprehensive sitemap planning for 500 DEXs.
**Depends on**: Phase 1
**Requirements**: RANK-01, RANK-02, RANK-03, RANK-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, REVIEW-01, REVIEW-02, REVIEW-03, REVIEW-05
**Success Criteria** (what must be TRUE):
  1. User sees homepage with top DEXs sorted by DexRank score
  2. User can filter DEXs by chain and type (spot/perp/hybrid)
  3. User can sort by rank score, TVL, or volume
  4. User can search DEXs by name
  5. User can click a DEX to view its dedicated page with metrics and score breakdown
  6. Sitemap planning complete for 500 DEXs across 5 tiers (570+ URLs)
**Plans**: 3 plans in 3 waves (sequential)

Plans:
- [x] 02-01-PLAN.md — DexRank scoring algorithm (percentile normalization, weighted composite, score breakdown)
- [x] 02-02-PLAN.md — Homepage with rankings table (TanStack Table, nuqs URL state, filters/search)
- [x] 02-03-PLAN.md — DEX review pages with ISR (metrics grid, score breakdown, templated sections)

### Phase 3: Content & Differentiation
**Goal**: Editorial content, comparison tools, chain pages, guides, and methodology transparency that differentiate DexRank from data-only competitors.
**Depends on**: Phase 2
**Requirements**: REVIEW-04, REVIEW-06, REVIEW-07, REVIEW-08, COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, CHAIN-01, CHAIN-02, CHAIN-03, CHAIN-04, CHAIN-05, GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-04, GUIDE-05, GUIDE-06, GUIDE-07, METH-01, METH-02, METH-03
**Success Criteria** (what must be TRUE):
  1. Tier 1-2 DEX reviews (50 DEXs) include editorial "Editor's Take" with unique insights
  2. User can compare two DEXs side-by-side at /compare/[dex-1]-vs-[dex-2] (10+ comparisons)
  3. User can browse chain-specific pages showing top DEXs per chain (27 chains)
  4. User can read educational guides explaining DEX concepts (16 guides)
  5. User can view "How We Rank" page explaining the ranking methodology
  6. Category pages live for all 7 DEX types (spot, perp, aggregator, cross-chain, options, prediction, yield)
**Plans**: TBD

Plans:
- [ ] 03-01: Editorial content system
- [ ] 03-02: DEX comparison tool
- [ ] 03-03: Chain-specific pages
- [ ] 03-04: Educational guides
- [ ] 03-05: Methodology page

### Phase 4: Production & Polish
**Goal**: Production-ready site with performant 2026-style animations, SEO optimization, Core Web Vitals passing, and modern UI polish with zero-lag interactions.
**Depends on**: Phase 3
**Requirements**: TECH-04, TECH-05, TECH-06, TECH-07, TECH-08, TECH-09, ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-05, ANIM-06
**Success Criteria** (what must be TRUE):
  1. All pages are server-side rendered or statically generated
  2. Core Web Vitals pass (LCP <2.5s, INP <200ms, CLS <0.1)
  3. XML sitemap generated dynamically includes all 570+ URLs (500 DEXs, 27 chains, categories, guides)
  4. robots.txt and canonical URLs are configured correctly
  5. Site is mobile-responsive and works across all viewport sizes
  6. Page transitions are smooth with no layout jank (View Transitions API)
  7. Data loading shows skeleton shimmer animations
  8. Interactive elements have micro-interaction feedback (hover, click, state changes)
  9. All animations run at 60fps with zero lag (GPU-accelerated transform/opacity only)
  10. Animations respect `prefers-reduced-motion` for accessibility
  11. Dark mode toggle with system preference detection
  12. OG images and Twitter cards generated for social sharing
  13. Newsletter signup captures emails for launch announcements
**Plans**: 7 plans

Plans:
- [ ] 04-01: Animation foundation (Motion library setup, GPU-accelerated patterns, reduced-motion support)
- [ ] 04-02: Page transitions (View Transitions API, route animations, loading states)
- [ ] 04-03: Micro-interactions (hover effects, click feedback, number counters, rank changes)
- [ ] 04-04: Loading states (skeleton shimmer, data table animations, chart entrances)
- [ ] 04-05: Dark mode (theme toggle, system preference, persistent selection)
- [ ] 04-06: Social sharing (OG images, Twitter cards, dynamic meta images)
- [ ] 04-07: SEO infrastructure (sitemap, robots, canonicals, newsletter signup, Core Web Vitals audit)

### Phase 5: Data Enhancements
**Goal**: Richer data visualization with historical trends and security transparency that builds user trust and engagement.
**Depends on**: Phase 4
**Requirements**: DATA-07, DATA-09, CHART-01, CHART-02, CHART-03, SEC-01, SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. User can view 30/60/90 day TVL and volume charts on DEX pages
  2. Charts animate smoothly on load with staggered entrance
  3. Security section shows audit status with links to audit reports
  4. Security section displays hack/exploit history (if any) with dates and amounts
  5. Security score contributes to overall DexRank calculation
  6. Historical data syncs from DefiLlama on daily schedule
**Plans**: 3 plans

Plans:
- [ ] 05-01: Historical data sync (DefiLlama historical endpoints, daily cron, data schema)
- [ ] 05-02: Interactive charts (TVL/volume trends, responsive, animated)
- [ ] 05-03: Security indicators (audit status, hack history, security score integration)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Foundation | 3/3 | Complete | 2026-01-18 |
| 2. Core Pages & Rankings | 3/3 | Complete | 2026-01-18 |
| 3. Content & Differentiation | 0/5 | Not started | - |
| 4. Production & Polish | 0/7 | Not started | - |
| 5. Data Enhancements | 0/3 | Not started | - |

---

## Future Vision: v2 and Beyond

### v2 Milestone: Monetization & Engagement

After v1.0 launch, focus on sustainable revenue and user engagement:
- Affiliate link integration with click tracking
- Fee/revenue data per DEX
- Category rankings (best for stablecoins, perps, memecoins)
- Fees calculator ("What would X trade cost?")
- User growth metrics integration

### v3 Milestone: Verified User Reviews (END GOAL)

**DexRank becomes the "Trustpilot for DEXs"** — the trusted source for verified user reviews.

**Why traditional reviews fail for DEXs:**
- Uniswap has 1.1/5 on Trustpilot (97% one-star) despite billions in volume
- 80%+ of negative reviews are phishing victims, scam token buyers, or user error
- Reviews reflect crypto literacy gaps and scammer activity — not protocol quality

**The DexRank solution:**
1. User connects wallet to submit review
2. System verifies on-chain transactions (proof of usage)
3. Minimum usage threshold (3+ transactions, $100+ volume)
4. Structured review template with weighted scores
5. Sybil resistance via Human Passport
6. Aggregated "DexRank User Score" from verified reviews only

**Why this matters:**
- Only platform where reviewers prove actual protocol usage
- Scam victims can't bomb legitimate protocols
- DEXs get actionable feedback from real users
- Users can trust scores reflect actual quality

*This is the long-term vision that makes DexRank the definitive DEX authority.*

See: REQUIREMENTS.md → v3 Vision: Verified User Reviews

---
*Roadmap created: 2026-01-17*
*Phase 1 planned: 2026-01-17*
*Phase 2 planned: 2026-01-18*
*Phase 2 complete: 2026-01-18*
*Sitemap expanded to 500 DEXs: 2026-01-20*
*Animation system added to Phase 4: 2026-01-20*
*Phase 5 added (data enhancements): 2026-01-20*
*Milestone: v1.0*
*Future vision added: 2026-01-18*
