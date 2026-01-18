# Requirements: DexRank

**Defined:** 2026-01-17
**Core Value:** Accurate, real-time DEX data and transparent rankings that users can trust to make informed trading decisions.

## v1 Requirements

Requirements for initial release. Each maps to roadmap phases.

### Data Infrastructure

- [ ] **DATA-01**: System syncs DEX TVL data from DefiLlama API to local database
- [ ] **DATA-02**: System syncs 24h/7d/30d volume data from DefiLlama API
- [ ] **DATA-03**: System supports 10+ blockchain networks (Ethereum, Solana, Arbitrum, Base, BSC, Polygon, Optimism, Avalanche, zkSync, etc.)
- [ ] **DATA-04**: Data refreshes automatically on scheduled intervals (configurable)
- [ ] **DATA-05**: System handles DefiLlama API failures gracefully with cached fallback
- [ ] **DATA-06**: Database stores 100+ DEX platforms with metadata (name, logo, chains, type)

### Ranking Algorithm

- [x] **RANK-01**: System calculates DexRank score based on weighted metrics (TVL, volume, security, liquidity, user growth, trust)
- [x] **RANK-02**: Ranking weights are configurable and documented
- [x] **RANK-03**: Rankings update automatically when data refreshes
- [x] **RANK-04**: User can view score breakdown for each DEX

### Homepage & Rankings

- [x] **HOME-01**: Homepage displays top DEXs sorted by DexRank score
- [x] **HOME-02**: User can filter DEXs by blockchain network
- [x] **HOME-03**: User can filter DEXs by type (spot, perpetual, hybrid)
- [x] **HOME-04**: User can sort DEXs by rank score, TVL, or volume
- [x] **HOME-05**: User can search DEXs by name
- [x] **HOME-06**: Homepage displays real-time metrics (TVL, volume) per DEX
- [x] **HOME-07**: Homepage is mobile responsive

### DEX Review Pages

- [x] **REVIEW-01**: Each DEX has a dedicated review page at `/reviews/[dex-slug]`
- [x] **REVIEW-02**: Review pages display real-time metrics pulled from database
- [x] **REVIEW-03**: Review pages use consistent templated structure (overview, features, fees, security, pros/cons, verdict)
- [ ] **REVIEW-04**: Review pages include editorial "Editor's Take" section
- [x] **REVIEW-05**: Review pages display DexRank score with breakdown
- [ ] **REVIEW-06**: 30-40 DEX reviews completed at launch
- [ ] **REVIEW-07**: Review pages have SEO meta tags (title, description, OG tags)
- [ ] **REVIEW-08**: Review pages have schema markup (JSON-LD Review)

### Comparison Tool

- [ ] **COMP-01**: User can compare 2 DEXs side-by-side
- [ ] **COMP-02**: Comparison pages accessible at `/compare/[dex-1]-vs-[dex-2]`
- [ ] **COMP-03**: Comparison displays feature-by-feature table
- [ ] **COMP-04**: Comparison displays metrics comparison (TVL, volume, fees)
- [ ] **COMP-05**: Comparison includes "Best for..." recommendations
- [ ] **COMP-06**: Comparison pages have SEO meta tags and schema markup

### Chain-Specific Pages

- [ ] **CHAIN-01**: Each major chain has a dedicated page at `/chains/[chain-slug]`
- [ ] **CHAIN-02**: Chain pages list top DEXs available on that chain
- [ ] **CHAIN-03**: Chain pages include chain-specific context (ecosystem overview)
- [ ] **CHAIN-04**: Chain pages have SEO meta tags
- [ ] **CHAIN-05**: Minimum 10 chain pages at launch (Ethereum, Solana, Arbitrum, Base, BSC, Polygon, Optimism, Avalanche, zkSync, Fantom)

### Educational Guides

- [ ] **GUIDE-01**: Guides accessible at `/guides/[guide-slug]`
- [ ] **GUIDE-02**: "What is a DEX?" guide explaining decentralized exchanges
- [ ] **GUIDE-03**: "DEX vs CEX" comparison guide
- [ ] **GUIDE-04**: "How to use a DEX" beginner guide
- [ ] **GUIDE-05**: "Liquidity pools explained" guide
- [ ] **GUIDE-06**: "Impermanent loss" guide for liquidity providers
- [ ] **GUIDE-07**: Guides have SEO meta tags and internal linking

### Methodology & Trust

- [ ] **METH-01**: "How We Rank" page at `/how-we-rank` explains ranking algorithm
- [ ] **METH-02**: Methodology page shows weight distribution for each factor
- [ ] **METH-03**: Methodology page is linked from homepage and rankings

### Technical & SEO

- [ ] **TECH-01**: Site built with Next.js 15+ App Router
- [ ] **TECH-02**: Site uses Tailwind CSS + shadcn/ui components
- [ ] **TECH-03**: Site uses PostgreSQL database (Neon)
- [ ] **TECH-04**: All pages server-side rendered or statically generated for SEO
- [ ] **TECH-05**: Core Web Vitals pass (LCP <2.5s, INP <200ms, CLS <0.1)
- [ ] **TECH-06**: XML sitemap generated automatically
- [ ] **TECH-07**: robots.txt configured for search engines
- [ ] **TECH-08**: Canonical URLs set for all pages
- [ ] **TECH-09**: Mobile-first responsive design

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Monetization

- **MON-01**: Affiliate links on DEX review and comparison pages
- **MON-02**: Click tracking for affiliate analytics
- **MON-03**: Fees calculator ("What would it cost to trade X?")
- **MON-04**: FTC-compliant affiliate disclosure

### Data Enhancements

- **DATA-07**: Historical TVL/volume charts (30/60/90 day trends)
- **DATA-08**: Fee/revenue data per DEX
- **DATA-09**: Security score based on audits and incident history
- **DATA-10**: User growth metrics

### Content Expansion

- **CONT-01**: 100+ DEX reviews total
- **CONT-02**: Category rankings (best for stablecoins, perps, memecoins)
- **CONT-03**: News section for DEX updates
- **CONT-04**: Video review content

### Features

- **FEAT-01**: Multi-language support (DE, FR, SE)
- **FEAT-02**: Newsletter signup and email marketing
- **FEAT-03**: API access for developers
- **FEAT-04**: AI chatbot for DEX recommendations

## v3 Vision: Verified User Reviews

**End Goal:** DexRank becomes the "Trustpilot for DEXs" — the trusted source for verified user reviews where reviewers prove on-chain protocol usage.

### Why Not Traditional Reviews?

Traditional review platforms (Trustpilot, G2) fail catastrophically for DEXs:
- **Uniswap:** 1.1/5 stars (97% one-star) — yet processes billions in volume
- **PancakeSwap:** 1.5/5 stars — same pattern

**Root cause:** 80%+ of negative reviews are NOT protocol failures:
1. **Phishing victims** who used fake sites (unioswap.com, pancakeswapmeta.pro)
2. **Scam token victims** who blame permissionless protocols for third-party rug pulls
3. **User error** (gas fees, slippage, wrong network)

These reviews reflect crypto literacy gaps and scammer activity — not protocol quality.

### Verified User Review System

- **VREV-01**: User connects wallet to submit review
- **VREV-02**: System verifies on-chain transactions with the DEX (proof of usage)
- **VREV-03**: Minimum usage threshold required (e.g., 3+ transactions, $100+ volume)
- **VREV-04**: Structured review template (UX, speed, fees, liquidity, overall experience)
- **VREV-05**: Review weighted by usage depth (heavy users have more weight)
- **VREV-06**: Sybil resistance via Human Passport or similar identity verification
- **VREV-07**: Reviews stored on-chain or IPFS for immutability
- **VREV-08**: Aggregated "DexRank User Score" from verified reviews

### Technical Approach

- **Identity:** Human Passport (2M+ users, stamp-based Sybil resistance)
- **On-chain verification:** Query transaction history via blockchain explorers/APIs
- **Storage:** Hybrid — metadata on-chain (attestations), full review on IPFS
- **Anti-gaming:** Usage thresholds, identity verification, anomaly detection

### Why This Matters

DexRank would be the ONLY platform where:
1. Reviewers prove they actually used the protocol
2. Scam victims can't bomb legitimate protocols
3. DEXs get actionable feedback from real users
4. Users can trust review scores reflect actual protocol quality

*This is the long-term differentiation that makes DexRank the definitive DEX authority.*

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Native token/tokenomics | Destroys trust; DeFiLlama's no-token approach is better |
| Real-time trading/swaps | Regulatory complexity, liability; link to DEXs instead |
| Wallet connection | Security liability, not core to comparison use case |
| Paid promoted rankings | Destroys ranking credibility |
| Token price alerts | DexScreener already dominates this |
| Portfolio tracking | CoinGecko/DexScreener do this; stay focused |
| Social features (comments, reactions) | Moderation burden, distraction |
| Mobile native apps | PWA sufficient initially; consider v3+ |
| User accounts | Adds GDPR complexity; anonymous use first |
| Real-time trading charts | DexScreener/DexTools own this space |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| DATA-01 | Phase 1 | Complete |
| DATA-02 | Phase 1 | Complete |
| DATA-03 | Phase 1 | Complete |
| DATA-04 | Phase 1 | Complete |
| DATA-05 | Phase 1 | Complete |
| DATA-06 | Phase 1 | Complete |
| RANK-01 | Phase 2 | Complete |
| RANK-02 | Phase 2 | Complete |
| RANK-03 | Phase 2 | Complete |
| RANK-04 | Phase 2 | Complete |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Complete |
| HOME-04 | Phase 2 | Complete |
| HOME-05 | Phase 2 | Complete |
| HOME-06 | Phase 2 | Complete |
| HOME-07 | Phase 2 | Complete |
| REVIEW-01 | Phase 2 | Complete |
| REVIEW-02 | Phase 2 | Complete |
| REVIEW-03 | Phase 2 | Complete |
| REVIEW-04 | Phase 3 | Pending |
| REVIEW-05 | Phase 2 | Complete |
| REVIEW-06 | Phase 3 | Pending |
| REVIEW-07 | Phase 3 | Pending |
| REVIEW-08 | Phase 3 | Pending |
| COMP-01 | Phase 3 | Pending |
| COMP-02 | Phase 3 | Pending |
| COMP-03 | Phase 3 | Pending |
| COMP-04 | Phase 3 | Pending |
| COMP-05 | Phase 3 | Pending |
| COMP-06 | Phase 3 | Pending |
| CHAIN-01 | Phase 3 | Pending |
| CHAIN-02 | Phase 3 | Pending |
| CHAIN-03 | Phase 3 | Pending |
| CHAIN-04 | Phase 3 | Pending |
| CHAIN-05 | Phase 3 | Pending |
| GUIDE-01 | Phase 3 | Pending |
| GUIDE-02 | Phase 3 | Pending |
| GUIDE-03 | Phase 3 | Pending |
| GUIDE-04 | Phase 3 | Pending |
| GUIDE-05 | Phase 3 | Pending |
| GUIDE-06 | Phase 3 | Pending |
| GUIDE-07 | Phase 3 | Pending |
| METH-01 | Phase 3 | Pending |
| METH-02 | Phase 3 | Pending |
| METH-03 | Phase 3 | Pending |
| TECH-01 | Phase 1 | Complete |
| TECH-02 | Phase 1 | Complete |
| TECH-03 | Phase 1 | Complete |
| TECH-04 | Phase 4 | Pending |
| TECH-05 | Phase 4 | Pending |
| TECH-06 | Phase 4 | Pending |
| TECH-07 | Phase 4 | Pending |
| TECH-08 | Phase 4 | Pending |
| TECH-09 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0

---
*Requirements defined: 2026-01-17*
*Last updated: 2026-01-18 after Phase 2 completion*
