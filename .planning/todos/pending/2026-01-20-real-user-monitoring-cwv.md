---
created: 2026-01-20T03:50
title: Add Real User Monitoring for Core Web Vitals
area: tooling
files: []
---

## Problem

Phase 4 targets Core Web Vitals (LCP <2.5s, INP <200ms, CLS <0.1) but there's no way to verify these in production with real users. Lighthouse gives lab data; real-world performance varies by:
- User device capabilities
- Network conditions
- Geographic location
- Browser differences

Can't improve what you can't measure.

## Solution

1. **Option A: Vercel Analytics** (simplest)
   - Enable in Vercel dashboard
   - Automatic CWV tracking
   - Free tier included with Vercel

2. **Option B: web-vitals library + custom reporting**
   - Install `web-vitals` package
   - Report to Sentry Performance or custom endpoint
   - More control over data

3. **Option C: Google Search Console**
   - Free CWV data from actual Google crawls
   - Delayed (days/weeks) but authoritative

Recommendation: Start with Vercel Analytics (zero config), add web-vitals for granular debugging if needed.
