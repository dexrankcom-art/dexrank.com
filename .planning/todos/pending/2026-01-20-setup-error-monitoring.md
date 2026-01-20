---
created: 2026-01-20T00:00
title: Set up error monitoring (Sentry)
area: tooling
files: []
---

## Problem

No visibility into production errors. If sync jobs fail, pages break, or API errors occur, there's no alerting. Problems go unnoticed until users complain.

## Solution

Integrate Sentry (or similar):
1. Install @sentry/nextjs
2. Configure for both client and server errors
3. Set up alerting for critical errors
4. Track sync job failures specifically

Sentry has generous free tier. Essential for production reliability.
