---
created: 2026-01-20T00:00
title: Implement breadcrumb navigation
area: ui
files: []
---

## Problem

No breadcrumb navigation on DEX pages or chain pages. Breadcrumbs help users understand site hierarchy and navigate back. Also provides SEO benefit via BreadcrumbList structured data.

## Solution

Add breadcrumb component showing path:
- Home > DEX Rankings > Uniswap
- Home > Chains > Ethereum > Top DEXs

Use shadcn/ui Breadcrumb component or build simple one. Include JSON-LD BreadcrumbList markup for SEO.
