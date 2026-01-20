# Phase 5: Quality & Production Readiness - Research

**Researched:** 2026-01-20
**Domain:** Accessibility, Error Handling, Monitoring, SEO, Content Quality
**Confidence:** HIGH

## Summary

Phase 5 addresses production hardening across accessibility, error resilience, monitoring, and content quality. The research identified established patterns for each domain that integrate well with the existing Next.js 16 + Tailwind stack.

The core findings:
- **Accessibility**: eslint-plugin-jsx-a11y (already in dependencies via eslint-config-next) provides static analysis; manual WCAG 2.1 AA audit required as @axe-core/react does NOT support React 18+/19
- **Error Boundaries**: Next.js App Router has native error.tsx/global-error.tsx conventions - use these, not custom React error boundaries
- **Sentry**: Official @sentry/nextjs SDK with wizard setup creates all needed config files automatically
- **RUM**: Next.js built-in useReportWebVitals hook or @vercel/analytics for Vercel deployments
- **Breadcrumbs**: BreadcrumbList JSON-LD schema with server-rendered component for SEO
- **Fonts**: Already optimized with next/font (Geist fonts with latin subset)
- **FTC Compliance**: Clear affiliate disclosure required near affiliate links, not buried in footer

**Primary recommendation:** Implement error boundaries and Sentry first (immediate production safety), then accessibility audit, then breadcrumbs/canonical URLs for SEO completeness.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @sentry/nextjs | ^8.x | Error monitoring, tracing, session replay | Official Sentry SDK for Next.js with App Router support |
| eslint-plugin-jsx-a11y | ^6.x | Static accessibility linting | Included in eslint-config-next, WCAG rule enforcement |
| web-vitals | ^4.x | Core Web Vitals measurement | Google's official library, used by useReportWebVitals |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vercel/analytics | ^1.x | RUM with Vercel dashboard | If deploying to Vercel (automatic CWV tracking) |
| schema-dts | ^1.1.5 | TypeScript types for JSON-LD | Already installed, use for BreadcrumbList typing |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @sentry/nextjs | LogRocket, Datadog | Sentry has best Next.js integration, free tier generous |
| @vercel/analytics | Custom web-vitals endpoint | Vercel Analytics gives instant dashboard, no backend needed |
| eslint-plugin-jsx-a11y | @axe-core/react | axe-core/react doesn't support React 18+, use manual testing |

**Installation:**
```bash
npm install @sentry/nextjs @vercel/analytics
```

Note: eslint-plugin-jsx-a11y is already included via eslint-config-next.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── error.tsx           # Route-level error boundary (client)
│   ├── global-error.tsx    # Root error boundary (client)
│   ├── not-found.tsx       # Global 404 page
│   ├── instrumentation.ts  # Sentry server init
│   └── _components/
│       └── web-vitals.tsx  # RUM component (client)
├── components/
│   ├── seo/
│   │   ├── breadcrumbs.tsx # Breadcrumb UI + JSON-LD
│   │   └── canonical.tsx   # Canonical URL helper (optional)
│   └── ui/
│       └── affiliate-disclosure.tsx
├── lib/
│   └── seo/
│       └── schemas.ts      # Extend with BreadcrumbList
└── content/
    ├── STYLE_GUIDE.md      # Already exists
    ├── CONTENT_REVIEW_CHECKLIST.md
    └── CONTENT_UPDATE_SOP.md
```

### Pattern 1: Error Boundary Architecture (Next.js Native)

**What:** Layered error boundaries using Next.js file conventions
**When to use:** All production apps need error isolation

```typescript
// Source: https://nextjs.org/docs/app/api-reference/file-conventions/error
// app/error.tsx - catches errors in route segment

'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="container mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-8">
        We've been notified and are looking into it.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Try again
      </button>
    </div>
  );
}
```

```typescript
// app/global-error.tsx - catches root layout errors
// MUST define own <html> and <body> tags

'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button onClick={reset}>Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
```

### Pattern 2: BreadcrumbList JSON-LD Schema

**What:** Server-rendered breadcrumbs with structured data
**When to use:** Any page with hierarchical navigation (reviews, chains, categories, guides)

```typescript
// Source: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
// components/seo/breadcrumbs.tsx

import { BreadcrumbList, WithContext } from 'schema-dts';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const baseUrl = 'https://dexrank.com';

  const jsonLd: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: index === items.length - 1 ? undefined : `${baseUrl}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span>/</span>}
              {index === items.length - 1 ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.href} className="hover:text-foreground">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

### Pattern 3: Canonical URLs via Metadata

**What:** Prevent duplicate content with canonical URLs
**When to use:** All pages, especially those accessible via multiple URLs

```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx - set metadataBase globally

export const metadata: Metadata = {
  metadataBase: new URL('https://dexrank.com'),
  // ... rest of metadata
};

// app/reviews/[slug]/page.tsx - dynamic canonical

export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;

  return {
    alternates: {
      canonical: `/reviews/${slug}`,
    },
    // ... rest of metadata
  };
}
```

### Pattern 4: RUM with useReportWebVitals

**What:** Report Core Web Vitals to analytics
**When to use:** Production monitoring of real user performance

```typescript
// Source: https://nextjs.org/docs/app/guides/analytics
// app/_components/web-vitals.tsx

'use client';

import { useReportWebVitals } from 'next/web-vitals';

const logWebVitals = (metric: {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) => {
  // Option 1: Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
    return;
  }

  // Option 2: Send to analytics endpoint
  const body = JSON.stringify({
    metric: metric.name,
    value: metric.value,
    rating: metric.rating,
    page: window.location.pathname,
  });

  // Use sendBeacon for reliable delivery
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  }
};

export function WebVitals() {
  useReportWebVitals(logWebVitals);
  return null;
}
```

### Anti-Patterns to Avoid

- **Custom React error boundaries in App Router:** Use native error.tsx convention instead - it integrates with Next.js streaming and suspense
- **Putting affiliate disclosure only in footer:** FTC requires disclosure "near" the endorsement, not hidden away
- **Accessibility testing only via eslint:** Static analysis catches ~30% of issues; manual testing required for keyboard navigation, screen readers, color contrast
- **Canonical URLs pointing to wrong page:** Always verify canonical matches the preferred URL, not a redirect source

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error monitoring | Custom error logging | @sentry/nextjs | Source maps, breadcrumbs, user context, alerting |
| Web Vitals tracking | Manual performance.now() | useReportWebVitals | Handles all 6 metrics with proper attribution |
| Accessibility testing | Visual inspection | axe DevTools + eslint-plugin-jsx-a11y | Catches issues humans miss |
| Breadcrumb schema | Manual JSON strings | schema-dts types | Type safety, validation at build time |
| Font loading | Custom font-face | next/font | Automatic optimization, zero CLS |

**Key insight:** Production monitoring and accessibility are domains where DIY solutions miss edge cases that cause real user harm.

## Common Pitfalls

### Pitfall 1: React 18+/19 Runtime Accessibility Testing

**What goes wrong:** @axe-core/react crashes or doesn't work with React 18+/19
**Why it happens:** Library hasn't been updated for new React concurrent features
**How to avoid:** Use browser-based axe DevTools extension for manual testing, jest-axe for unit tests
**Warning signs:** Errors about ReactDOM.render (deprecated in React 18)

### Pitfall 2: global-error.tsx Missing HTML/Body Tags

**What goes wrong:** global-error.tsx renders inside broken layout
**Why it happens:** global-error replaces root layout, so it MUST define its own tags
**How to avoid:** Always include `<html>` and `<body>` in global-error.tsx
**Warning signs:** Styles don't apply, hydration errors in production

### Pitfall 3: Sentry Build Token Exposed

**What goes wrong:** SENTRY_AUTH_TOKEN committed to repo
**Why it happens:** Forgetting to add .env.sentry-build-plugin to .gitignore
**How to avoid:** Sentry wizard auto-adds to .gitignore; verify before first commit
**Warning signs:** Token visible in git history

### Pitfall 4: Canonical URL Mismatch with Trailing Slashes

**What goes wrong:** Google sees different versions as duplicates
**Why it happens:** Next.js trailingSlash config doesn't match canonical
**How to avoid:** Ensure metadataBase and canonical paths match Next.js routing config
**Warning signs:** Search Console "Duplicate without user-selected canonical" warnings

### Pitfall 5: FTC Disclosure Too Far from Affiliate Link

**What goes wrong:** FTC enforcement or legal exposure
**Why it happens:** Disclosure in sidebar or footer, not near the endorsement
**How to avoid:** Place disclosure within same section as affiliate content
**Warning signs:** Legal review flags, competitor complaints

### Pitfall 6: Error Boundary Doesn't Catch Layout Errors

**What goes wrong:** Errors in layout.tsx crash entire app without fallback
**Why it happens:** error.tsx only catches errors in children, not sibling layout
**How to avoid:** Use global-error.tsx AND ensure layouts have minimal logic
**Warning signs:** White screen on layout component errors

## Code Examples

Verified patterns from official sources:

### Sentry Configuration Files

```typescript
// Source: https://docs.sentry.io/platforms/javascript/guides/nextjs/
// instrumentation.ts (server registration)

import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
```

```typescript
// sentry.client.config.ts

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],
});
```

### Affiliate Disclosure Component

```typescript
// Source: FTC Endorsement Guides
// components/ui/affiliate-disclosure.tsx

export function AffiliateDisclosure() {
  return (
    <aside
      className="bg-muted/50 border rounded-lg p-4 my-4 text-sm"
      role="note"
      aria-label="Affiliate disclosure"
    >
      <p className="text-muted-foreground">
        <strong>Disclosure:</strong> Some links on this page are affiliate links.
        We may earn a commission if you sign up through these links, at no extra
        cost to you. This helps support DexRank's independent research.
      </p>
    </aside>
  );
}
```

### Global 404 Page

```typescript
// app/not-found.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="container mx-auto py-16 px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/">Browse All DEXs</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/guides">Read Guides</Link>
        </Button>
      </div>
    </main>
  );
}
```

### Accessibility eslint Addition

```javascript
// eslint.config.mjs - add strict a11y rules

import jsxA11y from 'eslint-plugin-jsx-a11y';

// Note: eslint-config-next already includes jsx-a11y recommended
// Only add if you want stricter rules:

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      // Upgrade some rules to error
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
    },
  },
  globalIgnores([...]),
]);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React class error boundaries | Next.js error.tsx convention | Next.js 13+ (2022) | Simpler, streaming-compatible |
| FID (First Input Delay) | INP (Interaction to Next Paint) | March 2024 | INP is now the Core Web Vital |
| @axe-core/react runtime | axe DevTools + jest-axe | React 18 (2022) | Runtime testing requires browser tools |
| Custom font preloading | next/font | Next.js 13+ (2022) | Zero-config optimization |

**Deprecated/outdated:**
- `pages/_error.tsx`: Use `app/error.tsx` and `app/global-error.tsx` in App Router
- `reportWebVitals` in _app.tsx: Use `useReportWebVitals` hook in App Router
- Manual font-face with preload: Use next/font for automatic optimization

## Accessibility Audit Checklist (WCAG 2.1 AA)

Manual testing required beyond eslint:

### Perceivable
- [ ] All images have meaningful alt text (or empty for decorative)
- [ ] Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- [ ] Information not conveyed by color alone
- [ ] Text can be resized to 200% without loss of content

### Operable
- [ ] All interactive elements reachable via keyboard
- [ ] Visible focus indicators on all interactive elements
- [ ] No keyboard traps
- [ ] Skip navigation link present
- [ ] Page titles are descriptive and unique

### Understandable
- [ ] Language attribute set on html element
- [ ] Form labels properly associated
- [ ] Error messages are clear and helpful
- [ ] Consistent navigation across pages

### Robust
- [ ] Valid HTML (no duplicate IDs)
- [ ] ARIA attributes used correctly
- [ ] Works with screen readers (VoiceOver, NVDA)

## Content Quality Framework

### Already Exists
- `content/STYLE_GUIDE.md` - Voice, forbidden phrases, structure
- `.planning/phases/03-content-differentiation/03-EDITORIAL-FRAMEWORK.md` - Tier system

### Needs Creation (Phase 5 Work)
1. **Content Review Checklist** - Pre-publish checklist document
2. **Content Update SOP** - Process for keeping content current

### FTC Compliance Checklist
- [ ] Affiliate relationships disclosed near links
- [ ] Disclosure language is clear ("We earn commission" not "affiliate link")
- [ ] Disclosure visible without scrolling where endorsement appears
- [ ] All platforms covered (not just blog posts)

## Open Questions

Things that couldn't be fully resolved:

1. **Vercel Analytics vs Custom Endpoint**
   - What we know: @vercel/analytics gives instant dashboard, useReportWebVitals allows custom endpoint
   - What's unclear: Whether project is deployed to Vercel (affects choice)
   - Recommendation: If Vercel deployment, use @vercel/analytics for simplicity; otherwise use useReportWebVitals with Sentry or custom endpoint

2. **Content Update SOP Scope**
   - What we know: STYLE_GUIDE exists with basic update triggers
   - What's unclear: How detailed the SOP needs to be (tooling, workflow, ownership)
   - Recommendation: Start simple - document triggers, who reviews, how to update lastUpdated field

## Sources

### Primary (HIGH confidence)
- [Next.js Error Handling Docs](https://nextjs.org/docs/app/getting-started/error-handling) - error.tsx convention, global-error.tsx
- [Next.js error.tsx API Reference](https://nextjs.org/docs/app/api-reference/file-conventions/error) - Props, TypeScript signatures
- [Sentry Next.js Guide](https://docs.sentry.io/platforms/javascript/guides/nextjs/) - SDK setup, App Router specifics
- [Next.js generateMetadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) - Canonical URLs via alternates
- [Next.js useReportWebVitals](https://nextjs.org/docs/app/guides/analytics) - RUM implementation
- [Google BreadcrumbList Structured Data](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) - JSON-LD requirements

### Secondary (MEDIUM confidence)
- [FTC Affiliate Disclosure Guide](https://www.referralcandy.com/blog/ftc-affiliate-disclosure) - Compliance requirements
- [eslint-plugin-jsx-a11y GitHub](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y) - Flat config setup
- [Ethereum.org Style Guide](https://ethereum.org/contributing/style-guide/) - Crypto content best practices
- [web-vitals GitHub](https://github.com/GoogleChrome/web-vitals) - Library documentation

### Tertiary (LOW confidence)
- WebSearch results on @axe-core/react React 19 compatibility (needs validation in implementation)

## Metadata

**Confidence breakdown:**
- Error handling: HIGH - Official Next.js documentation verified
- Sentry setup: HIGH - Official Sentry docs + wizard handles config
- Accessibility: MEDIUM - eslint setup clear, but manual testing approach needs validation
- RUM/Analytics: HIGH - Next.js official hooks well documented
- Breadcrumbs: HIGH - Google's structured data guide is authoritative
- FTC compliance: MEDIUM - Based on FTC guidance summaries, not direct FTC.gov content
- Content quality: HIGH - Existing STYLE_GUIDE.md provides foundation

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (30 days - stable domain, frameworks mature)
