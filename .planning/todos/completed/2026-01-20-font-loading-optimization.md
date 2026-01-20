---
created: 2026-01-20T03:50
title: Optimize font loading for LCP
area: ui
files: []
---

## Problem

Font loading can block text rendering, hurting LCP (Largest Contentful Paint). Common issues:
- FOIT (Flash of Invisible Text) - text hidden until font loads
- FOUT (Flash of Unstyled Text) - text shifts when font swaps
- Large font files downloading on every page

Next.js has built-in font optimization but needs proper configuration.

## Solution

1. Use `next/font` for automatic optimization:
   ```tsx
   import { Inter } from 'next/font/google'
   const inter = Inter({ subsets: ['latin'], display: 'swap' })
   ```

2. Key optimizations:
   - `display: 'swap'` - show fallback immediately, swap when ready
   - `subsets: ['latin']` - only load needed character sets
   - `preload: true` - hint browser to fetch early
   - Self-hosting (next/font does this automatically)

3. Verify with Lighthouse:
   - Check "Ensure text remains visible during webfont load"
   - Check font file sizes in Network tab

Quick win with significant LCP impact.
