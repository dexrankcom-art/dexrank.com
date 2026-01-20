---
created: 2026-01-20T00:00
title: Show data refresh timestamp on homepage
area: ui
files: []
---

## Problem

Users don't know how fresh the data is. Showing "Updated 2 hours ago" builds trust and signals active maintenance. Especially important for crypto where data changes rapidly.

## Solution

Add timestamp to homepage showing last successful sync:
- "Data updated: 2 hours ago" or "Last sync: Jan 20, 2026 14:00 UTC"
- Pull from database (sync job can store lastSyncAt)
- Update on each cron run

Place in subtle location (footer of table or near filters). Don't make it prominent but make it findable.
