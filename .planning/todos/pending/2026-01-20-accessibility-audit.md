---
created: 2026-01-20T03:50
title: Accessibility audit and fixes
area: ui
files: []
---

## Problem

Phase 4 includes `prefers-reduced-motion` support but lacks comprehensive accessibility coverage. Missing:
- Keyboard navigation (tab order, focus trapping in modals)
- Screen reader support (ARIA labels, live regions for dynamic content)
- Focus indicators (visible focus states for all interactive elements)
- Color contrast verification
- Skip links for main content

Google uses accessibility signals for ranking. Poor a11y also affects INP (Interaction to Next Paint) scores.

## Solution

1. Run Lighthouse accessibility audit on key pages
2. Add skip-to-content link in layout
3. Ensure all interactive elements have visible focus states
4. Add ARIA labels to icon-only buttons (filters, sort, theme toggle)
5. Test keyboard-only navigation through rankings table
6. Add aria-live regions for filter/search result updates
7. Verify color contrast meets WCAG AA (4.5:1 for text)

Consider: axe-core for automated testing in CI.
