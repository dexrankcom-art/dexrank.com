---
created: 2026-01-20T00:00
title: Add last updated date to articles
area: ui
files: []
---

## Problem

Articles and DEX review pages need a visible "Last updated" date for two reasons:

1. **SEO signal** - Google uses freshness as a ranking factor, especially for YMYL (Your Money Your Life) topics like crypto. A visible date helps Google understand when content was last meaningful updated.

2. **User trust** - Users trust dated content more than undated content. In crypto, outdated information can be costly. Showing when content was last reviewed builds credibility.

Currently, DEX pages show real-time metrics but no indication of when editorial content (Editor's Take, descriptions) was last updated.

## Solution

Add a "Last updated: [date]" element to article/review pages:

```tsx
<p className="text-muted-foreground text-sm">
  Last updated: January 20, 2026
</p>
```

Options for tracking the date:
- Store `contentUpdatedAt` in database alongside editorial content
- Use git commit date of MDX files (if using MDX approach)
- Manual field in CMS (if using headless CMS)

Consider placing near the top of the article or in the metadata section for visibility.
