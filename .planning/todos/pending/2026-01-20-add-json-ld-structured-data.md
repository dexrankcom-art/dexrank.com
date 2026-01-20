---
created: 2026-01-20T00:00
title: Add JSON-LD structured data to DEX pages
area: seo
files: []
---

## Problem

DEX review pages lack structured data markup. Without JSON-LD, Google can't display rich snippets (ratings, key facts, breadcrumbs) in search results. Rich snippets increase click-through rates significantly.

## Solution

Add JSON-LD schema markup to DEX pages:
- `Organization` or `SoftwareApplication` schema for DEX info
- `BreadcrumbList` for navigation path
- `Review` schema if adding editorial ratings
- `FAQPage` schema if adding FAQ sections

Implement via Next.js `<script type="application/ld+json">` in page head.
