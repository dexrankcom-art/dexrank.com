# Phase 4: Production & Polish - Context

**Gathered:** 2026-01-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Production-ready site with performant animations, dark mode, SEO infrastructure, social sharing, and newsletter signup. Establishes brand identity through the UI, ensures Core Web Vitals compliance, and adds polish that differentiates from data-only competitors.

</domain>

<decisions>
## Implementation Decisions

### Visual Identity
- Direction: "Data-Forward Professional" — DeFiLlama meets Linear
- No crypto clichés (neon gradients, rocket emojis, "to the moon" energy)
- Authority through clarity — data speaks, UI doesn't shout
- Professional for serious traders, approachable for newcomers

### Color Palette (derived from logo)
- Primary: Deep purple `oklch(0.45 0.25 290)` — matches logo background
- Accent: Bright green `oklch(0.75 0.2 145)` — matches logo star
- Positive metrics: Same bright green (reinforces brand)
- Negative metrics: Red `oklch(0.65 0.2 25)`
- Caution/warnings: Amber
- Dark mode background: Purple-tinted black `oklch(0.12 0.03 290)`

### Animation Philosophy
- Principle: "Responsive, not reactive" — animations confirm actions, never distract from data
- Page transitions: Subtle fade + slight vertical shift (150-200ms)
- Micro-interactions:
  - Hover: subtle scale (1.02) + shadow lift on cards
  - Click: brief press feedback (scale 0.98)
  - Number changes: count-up animation on metrics
  - Rank changes: subtle highlight flash
- Loading: Skeleton shimmer (left-to-right gradient), no spinners
- Tables: Row-by-row stagger (50ms delay each)
- Performance rule: Transform and opacity only — 60fps guaranteed

### Animation Implementation
- CSS animations first — hover states, shimmer, basic transitions
- Motion One (3KB) only for orchestrated sequences (staggered lists)
- Skip Framer Motion — overkill for subtle animations, 50KB bundle cost
- Skip View Transitions API — browser support spotty, CSS fade achieves same effect
- Respect `prefers-reduced-motion` always

### Dark Mode
- Approach: "Elevated dark" — not pure inversion
- Background: Purple-tinted dark `oklch(0.12 0.03 290)` — matches logo
- Cards: Slightly lighter for depth hierarchy
- Text: Off-white, not pure white (easier on eyes)
- Borders: Subtle, 10-15% opacity white
- Implementation: next-themes library
- Default: System preference on first visit, persistent toggle after

### Data Presentation
- Tables: Clean rows, generous padding, zebra striping only in dark mode
- Metrics: Large numbers, small labels — hierarchy through size
- Score badges: Filled pill with number, purple for top 10, gray for rest

### Social Sharing / OG Images
- Dark purple background (matches brand)
- Logo + DEX name + key metric (TVL or rank)
- Clean, minimal design
- Implementation: @vercel/og or satori for dynamic generation

### SEO Infrastructure
- XML sitemap: Dynamic generation for all pages
- robots.txt: Standard configuration
- Canonical URLs: Prevent duplicate content issues
- Core Web Vitals target: LCP <2.5s, INP <200ms, CLS <0.1

### Newsletter
- Placement: Footer or dedicated section on homepage
- Simple email capture for launch announcements
- No complex flows — just email field + submit

### Claude's Discretion
- Exact animation timing curves (ease, duration fine-tuning)
- Skeleton component exact dimensions
- OG image layout specifics
- Newsletter form styling
- Error boundary fallback UI design

</decisions>

<specifics>
## Specific Ideas

- Logo reference: `dexrank logo.png` — purple/violet with green star, chart bars, cosmic feel
- "DeFiLlama meets Linear" — clean data presentation with subtle polish
- Purple is distinctive in crypto/finance (most competitors use blue)
- Green accent does double duty: brand color AND positive metrics

</specifics>

<deferred>
## Deferred Ideas

- Sentry error monitoring — tooling, not Phase 4 scope
- Breadcrumb navigation — could be Phase 4 but lower priority
- Content update SOP document — process, not code
- Affiliate link disclaimer — legal/content, not polish

</deferred>

---

*Phase: 04-production-polish*
*Context gathered: 2026-01-20*
