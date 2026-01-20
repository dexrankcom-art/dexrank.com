---
phase: 03-content-differentiation
plan: 01
subsystem: content-infrastructure
tags: [mdx, json-ld, seo, editorial]

dependency_graph:
  requires: []
  provides: [mdx-rendering, json-ld-schemas, editorial-guidelines]
  affects: [03-02, 03-03, 03-04, 03-05, 03-06, 03-07]

tech_stack:
  added: [@next/mdx, @mdx-js/loader, @mdx-js/react, gray-matter, schema-dts, @tailwindcss/typography, @types/mdx]
  patterns: [MDX custom components, type-safe JSON-LD generation, XSS-safe script injection]

key_files:
  created:
    - mdx-components.tsx
    - src/lib/seo/schemas.ts
    - src/components/seo/json-ld.tsx
    - content/STYLE_GUIDE.md
    - content/CONTENT_CHECKLIST.md
  modified:
    - next.config.ts
    - package.json

decisions:
  - decision: MDX component library
    choice: Custom components in mdx-components.tsx
    reason: Direct mapping to Tailwind classes, no additional dependency needed

metrics:
  duration: ~8min
  completed: 2026-01-20
---

# Phase 03 Plan 01: Content Infrastructure Foundation Summary

MDX rendering, JSON-LD structured data, and editorial quality guidelines configured for Phase 3 content features.

## Commits

| Hash | Type | Description |
|------|------|-------------|
| 8c1b8e0 | chore | Install MDX and SEO dependencies (7 packages) |
| 516bbc9 | feat | Configure MDX and create SEO schema infrastructure |
| d87daf4 | docs | Create editorial style guide and content checklist |

## What Was Built

### MDX Infrastructure

- **next.config.ts**: Wrapped with `createMDX()` to enable `.mdx` page extensions
- **mdx-components.tsx**: Custom components for h1-h3, links, paragraphs, lists, blockquotes with Tailwind styling
- **Dependencies**: @next/mdx, @mdx-js/loader, @mdx-js/react, gray-matter, @types/mdx

### JSON-LD Schema System

- **src/lib/seo/schemas.ts**: 5 type-safe schema generators using `schema-dts`:
  - `generateReviewSchema()` - DEX review with rating
  - `generateComparisonSchema()` - DEX vs DEX comparison
  - `generateGuideSchema()` - Article schema for guides
  - `generateChainSchema()` - WebPage for chain landing pages
  - `generateCategorySchema()` - ItemList for category pages
- **src/components/seo/json-ld.tsx**: XSS-safe rendering component that escapes `<` characters

### Editorial Guidelines

- **content/STYLE_GUIDE.md**: Voice/tone, forbidden phrases (anti-AI-slop), Editor's Take structure, data requirements, terminology standards, length guidelines
- **content/CONTENT_CHECKLIST.md**: Pre-publish checklist covering factual accuracy, anti-slop verification, structure, metadata, links

## Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| MDX component library | Custom mdx-components.tsx | Direct Tailwind mapping, no extra dependency |
| JSON-LD types | schema-dts | Official Schema.org TypeScript definitions |
| XSS prevention | Escape `<` as `\u003c` | Prevents script tag injection in JSON-LD |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

| Check | Result |
|-------|--------|
| Build passes | PASS |
| TypeScript passes | PASS |
| mdx-components.tsx exists | PASS |
| schemas.ts exports 5 generators | PASS |
| json-ld.tsx exports JsonLd | PASS |
| STYLE_GUIDE.md has "Forbidden Phrases" | PASS |
| CONTENT_CHECKLIST.md has "Anti-Slop Verification" | PASS |

## Next Phase Readiness

Plan 03-02 (Educational Guides) can now use:
- MDX files for guide content with frontmatter
- JSON-LD `generateGuideSchema()` for Article structured data
- STYLE_GUIDE.md for content creation
- CONTENT_CHECKLIST.md for quality assurance
