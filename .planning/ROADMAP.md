# Roadmap: DexRank

## Overview

DexRank v1.0 delivers a database-first DEX comparison platform in four phases. Phase 1 establishes data infrastructure (DefiLlama sync to PostgreSQL). Phase 2 builds the homepage rankings and basic DEX pages with real-time metrics. Phase 3 adds editorial content, comparison tools, chain pages, guides, and methodology transparency for SEO differentiation. Phase 4 finalizes production readiness with Core Web Vitals optimization, SEO metadata, and deployment configuration.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Data Foundation** - Database schema, DefiLlama sync, data reliability
- [ ] **Phase 2: Core Pages & Rankings** - Homepage, ranking algorithm, basic DEX pages
- [ ] **Phase 3: Content & Differentiation** - Editorial reviews, comparisons, chain pages, guides, methodology
- [ ] **Phase 4: Production & Polish** - SEO optimization, Core Web Vitals, deployment readiness

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
- [ ] 01-01-PLAN.md — Project scaffolding, Drizzle schema, Neon PostgreSQL, shadcn/ui setup
- [ ] 01-02-PLAN.md — DefiLlama API client, sync service, Vercel cron endpoint
- [ ] 01-03-PLAN.md — Data access layer, cache fallback, API endpoints

### Phase 2: Core Pages & Rankings
**Goal**: Users can browse DEX rankings on the homepage, filter/sort/search, and view individual DEX pages with real-time metrics.
**Depends on**: Phase 1
**Requirements**: RANK-01, RANK-02, RANK-03, RANK-04, HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, REVIEW-01, REVIEW-02, REVIEW-03, REVIEW-05
**Success Criteria** (what must be TRUE):
  1. User sees homepage with top DEXs sorted by DexRank score
  2. User can filter DEXs by chain and type (spot/perp/hybrid)
  3. User can sort by rank score, TVL, or volume
  4. User can search DEXs by name
  5. User can click a DEX to view its dedicated page with metrics and score breakdown
**Plans**: TBD

Plans:
- [ ] 02-01: Ranking algorithm implementation
- [ ] 02-02: Homepage with rankings table
- [ ] 02-03: DEX review page template

### Phase 3: Content & Differentiation
**Goal**: Editorial content, comparison tools, chain pages, guides, and methodology transparency that differentiate DexRank from data-only competitors.
**Depends on**: Phase 2
**Requirements**: REVIEW-04, REVIEW-06, REVIEW-07, REVIEW-08, COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06, CHAIN-01, CHAIN-02, CHAIN-03, CHAIN-04, CHAIN-05, GUIDE-01, GUIDE-02, GUIDE-03, GUIDE-04, GUIDE-05, GUIDE-06, GUIDE-07, METH-01, METH-02, METH-03
**Success Criteria** (what must be TRUE):
  1. 30-40 DEX reviews include editorial "Editor's Take" with unique insights
  2. User can compare two DEXs side-by-side at /compare/[dex-1]-vs-[dex-2]
  3. User can browse chain-specific pages showing top DEXs per chain (10 chains)
  4. User can read educational guides explaining DEX concepts (5+ guides)
  5. User can view "How We Rank" page explaining the ranking methodology
**Plans**: TBD

Plans:
- [ ] 03-01: Editorial content system
- [ ] 03-02: DEX comparison tool
- [ ] 03-03: Chain-specific pages
- [ ] 03-04: Educational guides
- [ ] 03-05: Methodology page

### Phase 4: Production & Polish
**Goal**: Production-ready site with SEO optimization, Core Web Vitals passing, and all technical requirements for search engine visibility.
**Depends on**: Phase 3
**Requirements**: TECH-04, TECH-05, TECH-06, TECH-07, TECH-08, TECH-09
**Success Criteria** (what must be TRUE):
  1. All pages are server-side rendered or statically generated
  2. Core Web Vitals pass (LCP <2.5s, INP <200ms, CLS <0.1)
  3. XML sitemap is generated automatically and includes all pages
  4. robots.txt and canonical URLs are configured correctly
  5. Site is mobile-responsive and works across all viewport sizes
**Plans**: TBD

Plans:
- [ ] 04-01: SSR/SSG optimization
- [ ] 04-02: Core Web Vitals and performance
- [ ] 04-03: SEO infrastructure (sitemap, robots, canonicals)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Data Foundation | 0/3 | Planned | - |
| 2. Core Pages & Rankings | 0/3 | Not started | - |
| 3. Content & Differentiation | 0/5 | Not started | - |
| 4. Production & Polish | 0/3 | Not started | - |

---
*Roadmap created: 2026-01-17*
*Phase 1 planned: 2026-01-17*
*Milestone: v1.0*
