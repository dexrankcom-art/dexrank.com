# Phase 4: Production & Polish - Research

**Researched:** 2026-01-20
**Domain:** Next.js 15 animations, theming, OG images, SEO infrastructure, Core Web Vitals
**Confidence:** HIGH (primary sources verified)

## Summary

This research covers the technical implementation for Phase 4's production polish requirements: animations, dark mode, OG image generation, SEO infrastructure, Core Web Vitals optimization, and newsletter signup.

**Key findings:**
- **Animation approach:** CSS animations first, with Motion library (new name for Framer Motion) only when orchestration is needed. The vanilla JS `animate()` API is 3.8KB; React integration via `motion/react` can be optimized to ~4.6KB with LazyMotion.
- **Dark mode:** next-themes is the standard solution. Requires `suppressHydrationWarning` on `<html>` element. Works with Tailwind CSS v4's `@custom-variant dark` syntax (already configured in the project).
- **OG images:** Use `ImageResponse` from `next/og` (built into Next.js 15 App Router). Supports JSX/CSS with flexbox layout, custom fonts, and 500KB bundle limit.
- **SEO:** Next.js 15 has built-in metadata file conventions for sitemap.xml and robots.txt. Dynamic generation via `sitemap.ts` and `robots.ts` is type-safe and cached by default.
- **Newsletter:** Resend is the modern standard for transactional email in Next.js. 3,000 emails/month free tier. Simple API route integration with Server Actions.

**Primary recommendation:** Leverage Next.js 15's built-in capabilities for SEO and OG images. Use CSS animations for 90% of interactions; reserve Motion library for staggered list animations and orchestrated sequences only.

## Standard Stack

### Core Libraries

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-themes | ^0.4.x | Dark mode toggle with system preference | Standard for Next.js, handles SSR hydration |
| motion | ^11.x | Orchestrated animations (stagger, sequences) | Lightweight (3.8KB vanilla, 4.6KB React optimized), built on WAAPI |
| resend | ^4.x | Newsletter email sending | Modern DX, 3K free emails/month, React Email support |
| @vercel/og | (built-in) | OG image generation | Built into Next.js 15 via `next/og` |

### Supporting Libraries (Already in Project)

| Library | Version | Purpose | Phase 4 Role |
|---------|---------|---------|--------------|
| tw-animate-css | ^1.4.0 | CSS animation utilities | Micro-interactions, hover states |
| lucide-react | ^0.562.0 | Icons | Theme toggle, newsletter UI |
| zod | ^4.3.5 | Validation | Newsletter form validation |

### Installation

```bash
npm install next-themes motion resend
```

**Note:** `@vercel/og` is already included in Next.js 15 App Router - no separate installation needed.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # ThemeProvider wrapper
│   ├── sitemap.ts              # Dynamic sitemap generation
│   ├── robots.ts               # Dynamic robots.txt
│   ├── opengraph-image.tsx     # Default OG image
│   ├── api/
│   │   └── newsletter/
│   │       └── route.ts        # Newsletter signup endpoint
│   ├── dex/
│   │   └── [slug]/
│   │       └── opengraph-image.tsx  # Per-DEX OG images
│   └── chain/
│       └── [slug]/
│           └── opengraph-image.tsx  # Per-chain OG images
├── components/
│   ├── theme-toggle.tsx        # Dark mode toggle button
│   ├── newsletter-form.tsx     # Email capture form
│   ├── animated/               # Motion-powered components
│   │   ├── stagger-list.tsx    # Staggered table rows
│   │   └── count-up.tsx        # Number animations
│   └── ui/
│       └── skeleton.tsx        # Shimmer loading (already exists)
├── lib/
│   ├── email.ts                # Resend client
│   └── animations.ts           # Shared animation configs
└── styles/
    └── globals.css             # CSS animations, shimmer keyframes
```

### Pattern 1: next-themes Setup (Avoiding Hydration Mismatch)

**What:** Configure dark mode with system preference detection
**When to use:** Root layout setup
**Source:** [next-themes GitHub](https://github.com/pacocoursey/next-themes), [Next.js Hydration Docs](https://nextjs.org/docs/messages/react-hydration-error)

```tsx
// src/app/layout.tsx
import { ThemeProvider } from 'next-themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**Critical:** The `suppressHydrationWarning` on `<html>` is REQUIRED because next-themes modifies the element. Use `attribute="class"` to work with existing Tailwind `dark:` variant (already configured via `@custom-variant dark (&:is(.dark *))` in globals.css).

### Pattern 2: Theme Toggle Component

**What:** Client component for switching themes
**When to use:** Header/navbar

```tsx
// src/components/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder same size as button
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-md hover:bg-accent transition-colors"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
```

### Pattern 3: CSS-First Animations with GPU Acceleration

**What:** Micro-interactions using pure CSS
**When to use:** Hover states, click feedback, simple transitions
**Source:** [Core Web Vitals Guide](https://www.digitalapplied.com/blog/core-web-vitals-optimization-guide-2025)

```css
/* src/styles/globals.css - Add to existing file */

/* Shimmer animation for skeletons */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Card hover lift - GPU accelerated */
.card-hover {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.card-hover:hover {
  transform: translateY(-2px) scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Click press feedback */
.press-feedback:active {
  transform: scale(0.98);
}

/* Fade-in on mount */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Pattern 4: Motion Library for Staggered Lists

**What:** Orchestrated animations with Motion library
**When to use:** Table rows appearing, list item staggers
**Source:** [Motion Installation Docs](https://motion.dev/docs/react-installation)

```tsx
// src/components/animated/stagger-list.tsx
'use client';

import { motion, stagger, useAnimate } from 'motion/react';
import { useEffect } from 'react';

interface StaggerListProps {
  children: React.ReactNode[];
  staggerDelay?: number;
}

export function StaggerList({ children, staggerDelay = 0.05 }: StaggerListProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    animate(
      'li',
      { opacity: [0, 1], y: [8, 0] },
      { delay: stagger(staggerDelay), duration: 0.2 }
    );
  }, [animate, staggerDelay]);

  return (
    <ul ref={scope}>
      {children.map((child, i) => (
        <li key={i} style={{ opacity: 0 }}>
          {child}
        </li>
      ))}
    </ul>
  );
}
```

### Pattern 5: OG Image Generation

**What:** Dynamic Open Graph images per page
**When to use:** DEX detail pages, chain pages
**Source:** [Next.js ImageResponse Docs](https://nextjs.org/docs/app/api-reference/functions/image-response)

```tsx
// src/app/dex/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const alt = 'DEX Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  // Fetch DEX data
  const dex = await getDexBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'oklch(0.12 0.03 290)', // Brand purple-black
          padding: '60px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
          }}
        >
          {dex.name}
        </div>
        <div
          style={{
            fontSize: 36,
            color: 'oklch(0.75 0.2 145)', // Brand green
          }}
        >
          ${formatNumber(dex.tvl)} TVL
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: 24,
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          DexRank.com
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### Pattern 6: Dynamic Sitemap Generation

**What:** Programmatic sitemap for all 570+ URLs
**When to use:** Root app directory
**Source:** [Next.js Sitemap Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { getAllDexSlugs, getAllChainSlugs } from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dexrank.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const dexSlugs = await getAllDexSlugs();  // ~500 DEXs
  const chainSlugs = await getAllChainSlugs(); // ~27 chains

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/rankings`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/chains`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const dexPages: MetadataRoute.Sitemap = dexSlugs.map((slug) => ({
    url: `${BASE_URL}/dex/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const chainPages: MetadataRoute.Sitemap = chainSlugs.map((slug) => ({
    url: `${BASE_URL}/chain/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...dexPages, ...chainPages];
}
```

### Pattern 7: Newsletter Signup with Resend

**What:** Simple email capture API route
**When to use:** Footer newsletter form
**Source:** [Resend Next.js Docs](https://resend.com/docs/send-with-nextjs)

```typescript
// src/app/api/newsletter/route.ts
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = subscribeSchema.parse(body);

    // Add to Resend audience (or your preferred list management)
    const { data, error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 400 });
    }

    return Response.json({ success: true, id: data?.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors[0].message }, { status: 400 });
    }
    return Response.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
```

### Anti-Patterns to Avoid

- **Using Motion/Framer Motion for simple hover states:** CSS is faster, smaller, and sufficient. Motion adds unnecessary JS for single-element animations.
- **Not using `suppressHydrationWarning`:** Will cause hydration errors with next-themes.
- **Rendering theme-dependent UI before mount check:** Server doesn't know the theme, causing mismatches.
- **Using Framer Motion's full import:** Use LazyMotion + `motion/react-m` to reduce bundle from ~34KB to ~4.6KB.
- **Animating `width`, `height`, `margin`:** These trigger layout recalculations. Only use `transform` and `opacity` for 60fps.
- **Not respecting `prefers-reduced-motion`:** Accessibility violation and poor UX for users with vestibular disorders.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence | localStorage + custom context | next-themes | Handles SSR, system preference, hydration |
| OG image rendering | Canvas/Puppeteer | `next/og` ImageResponse | Built-in, Edge-optimized, JSX syntax |
| Sitemap generation | Manual XML files | `sitemap.ts` convention | Type-safe, automatic caching, dynamic |
| Email sending | SMTP setup, nodemailer | Resend | Modern API, React templates, free tier |
| Shimmer animation | Complex JS animation | CSS `@keyframes` + `background-position` | GPU-accelerated, zero JS |
| Reduced motion detection | Manual media query listening | CSS `@media (prefers-reduced-motion)` | Automatic, no JS needed |

**Key insight:** Next.js 15 has built-in conventions for most SEO and metadata needs. The App Router's file-based metadata system (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) is type-safe and automatically cached - no external libraries needed.

## Common Pitfalls

### Pitfall 1: next-themes Hydration Mismatch

**What goes wrong:** Error "Text content does not match server-rendered HTML" or flash of wrong theme (FOWT)
**Why it happens:** Server renders without knowing user's theme preference (stored in localStorage)
**How to avoid:**
1. Add `suppressHydrationWarning` to `<html>` element
2. Wrap theme-dependent rendering in a mount check (`useState(false)` -> `useEffect` -> `true`)
3. Use placeholder of same dimensions while unmounted to prevent CLS
**Warning signs:** Console hydration errors, theme flash on page load

### Pitfall 2: Motion Library Bundle Bloat

**What goes wrong:** 34KB+ added to bundle when only simple animations are needed
**Why it happens:** Default `motion` import includes all features
**How to avoid:**
1. Use CSS for hover states, press feedback, fades
2. Use `useAnimate` hook for orchestration (smallest API, 2.3KB)
3. If using `motion` components, use `LazyMotion` + `domAnimation` feature set
**Warning signs:** Bundle size jumps significantly after adding animations

### Pitfall 3: OG Image Generation Failures

**What goes wrong:** OG images fail to generate or look broken
**Why it happens:** ImageResponse has strict limitations - flexbox only, 500KB limit, limited CSS
**How to avoid:**
1. Only use flexbox (`display: flex`), no grid
2. Keep total assets under 500KB (inline fonts, minimal images)
3. Use `ttf` or `otf` fonts, not `woff2`
4. Test locally with debug mode: `{ debug: true }`
**Warning signs:** Blank images, SSR errors in production

### Pitfall 4: Sitemap Dynamic Rendering in Next.js 15

**What goes wrong:** Sitemap regenerates on every request instead of being cached
**Why it happens:** Next.js 15 changed sitemap behavior - using dynamic APIs opts out of caching
**How to avoid:**
1. Use `unstable_cache` for database queries in sitemap
2. Or accept dynamic behavior but add ISR: `export const revalidate = 3600`
3. Avoid `revalidateTag` in sitemap unless needed
**Warning signs:** High database load, slow `/sitemap.xml` responses

### Pitfall 5: CLS from Theme Toggle Icon

**What goes wrong:** Layout shift when theme icon changes between Sun/Moon
**Why it happens:** Icon renders as nothing during hydration, then appears
**How to avoid:**
1. Return a placeholder `<div>` with exact same dimensions as icon
2. Use `w-9 h-9` or explicit sizing that matches mounted state
**Warning signs:** CLS score > 0.1, visible jump when page loads

## Code Examples

### Skeleton with Shimmer (Enhancement to Existing)

```tsx
// Enhanced src/components/ui/skeleton.tsx
import { cn } from '@/lib/utils';

function Skeleton({ className, shimmer = false, ...props }: React.ComponentProps<'div'> & { shimmer?: boolean }) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'rounded-md bg-muted',
        shimmer
          ? 'bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer'
          : 'animate-pulse',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
```

```css
/* Add to globals.css */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}
```

### robots.ts Configuration

```typescript
// src/app/robots.ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dexrank.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

### Count-Up Animation for Metrics

```tsx
// src/components/animated/count-up.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({ end, duration = 1000, prefix = '', suffix = '', decimals = 0 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

      // Ease-out curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      countRef.current = easeOut * end;
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration]);

  const formatted = count.toFixed(decimals);
  return <span>{prefix}{formatted}{suffix}</span>;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` import | `motion/react` import | 2024 (Motion rebrand) | Same features, cleaner imports |
| Manual OG with Puppeteer | `next/og` ImageResponse | Next.js 13.3+ | Edge-native, 10x faster |
| External sitemap libs | `sitemap.ts` convention | Next.js 13+ | Type-safe, zero config |
| CSS darkMode selector | `@custom-variant dark` | Tailwind v4 | Simpler config in globals.css |
| FID metric | INP metric | March 2024 | Focus on all interactions, not just first |

**Deprecated/outdated:**
- `framer-motion` package name: Still works but `motion` is the new package
- `darkMode: ['class']` in tailwind.config: Tailwind v4 uses `@custom-variant` in CSS
- `@vercel/og` separate install: Now built into `next/og` in App Router

## Open Questions

1. **Inter tabular figures via Google Fonts**
   - What we know: Google Fonts Inter strips OpenType features to reduce file size
   - What's unclear: Whether `font-feature-settings: 'tnum'` works with Google Fonts Inter
   - Recommendation: Test with Google Fonts first; if tabular figures don't work, self-host Inter from rsms.me

2. **Sitemap caching behavior in Next.js 15**
   - What we know: Behavior changed from static (Next.js 14) to dynamic (Next.js 15) when using dynamic APIs
   - What's unclear: Exact ISR revalidation strategy for database-driven sitemaps
   - Recommendation: Test with `export const revalidate = 3600` and monitor database load

3. **Resend audience management vs simple list**
   - What we know: Resend supports contacts API with audiences
   - What's unclear: Whether simple list storage (database) is better for launch announcements only
   - Recommendation: Start with Resend audiences for simplicity; migrate to database if needed

## Sources

### Primary (HIGH confidence)
- [Next.js ImageResponse API Docs](https://nextjs.org/docs/app/api-reference/functions/image-response) - OG image generation
- [Next.js Sitemap File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Dynamic sitemap generation
- [Next.js robots.txt Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - robots.txt generation
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - Theme provider setup
- [Resend Next.js Docs](https://resend.com/docs/send-with-nextjs) - Newsletter integration
- [Motion Installation Docs](https://motion.dev/docs/react-installation) - Animation library setup

### Secondary (MEDIUM confidence)
- [Core Web Vitals Optimization Guide 2025](https://www.digitalapplied.com/blog/core-web-vitals-optimization-guide-2025) - LCP, INP, CLS techniques
- [Motion Bundle Size Docs](https://motion.dev/docs/react-reduce-bundle-size) - LazyMotion optimization
- [shadcn/ui Skeleton](https://ui.shadcn.com/docs/components/skeleton) - Skeleton component patterns

### Tertiary (LOW confidence - verify before use)
- Various Medium/DEV.to articles on specific implementation details

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs and widely adopted libraries
- Architecture patterns: HIGH - Based on official Next.js conventions
- Pitfalls: HIGH - Verified from official docs and GitHub issues
- Animation specifics: MEDIUM - Motion docs fetched but some details from secondary sources

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (30 days - stable libraries, established patterns)
