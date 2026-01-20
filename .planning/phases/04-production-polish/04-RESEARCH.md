# Phase 4: Production & Polish - Research

**Researched:** 2026-01-20
**Domain:** Next.js 16 animations, theming, OG images, SEO infrastructure, Core Web Vitals
**Confidence:** HIGH (primary sources verified)

## Summary

This research covers the technical implementation for Phase 4's production polish requirements: animations, dark mode, OG image generation, SEO infrastructure, Core Web Vitals optimization, and newsletter signup.

The project uses **Next.js 16.1.3** (App Router) with **React 19.2.3**, **Tailwind CSS v4**, and **shadcn/ui** components. Key decisions from CONTEXT.md constrain implementation: CSS animations first, Motion library only for orchestrated sequences, skip View Transitions API, use next-themes for dark mode, and Resend for newsletter.

**Key findings:**
- **Animation approach:** CSS animations first for hover states and transitions. Motion library (`motion` package v12.x) only when orchestration is needed. Use `useAnimate` hook from `motion/react-mini` at just 2.3KB for staggered lists.
- **Dark mode:** next-themes v0.4.6 is the standard solution. Requires `suppressHydrationWarning` on `<html>` element. Works with Tailwind CSS v4's `@custom-variant dark` syntax (already configured in the project).
- **OG images:** Use `ImageResponse` from `next/og` (built into Next.js 16 App Router). Supports JSX with flexbox layout. **Critical:** In Next.js 16+, `params` is now a Promise that must be awaited.
- **SEO:** Next.js 16 has built-in file conventions for `sitemap.ts` and `robots.ts`. Dynamic generation is type-safe and cached by default.
- **Newsletter:** Resend v6.x with Contacts API. As of 2025, contacts are global entities identified by email - simplified API without mandatory audience_id.

**Primary recommendation:** Leverage Next.js 16's built-in capabilities for SEO and OG images. Use CSS animations for 90% of interactions; reserve Motion library's `useAnimate` hook (2.3KB) for staggered table rows and orchestrated sequences only.

## Standard Stack

### Core Libraries

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next-themes | ^0.4.6 | Dark mode toggle with system preference | Standard for Next.js, handles SSR hydration, React 19 compatible |
| motion | ^12.27.1 | Orchestrated animations (stagger, sequences) | `useAnimate` mini is 2.3KB, built on WAAPI, GPU-accelerated |
| resend | ^6.8.0 | Newsletter email capture | Modern DX, global contacts API, 1K free contacts/month |

### Supporting Libraries (Already in Project)

| Library | Version | Purpose | Phase 4 Role |
|---------|---------|---------|--------------|
| tw-animate-css | ^1.4.0 | CSS animation utilities | Micro-interactions, hover states |
| lucide-react | ^0.562.0 | Icons | Theme toggle (Sun/Moon), newsletter UI |
| zod | ^4.3.5 | Validation | Newsletter form validation |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion useAnimate | CSS @keyframes only | CSS can't orchestrate staggered sequences easily |
| Resend | Buttondown | Buttondown is newsletter-focused but less programmable |
| next-themes | Manual CSS + context | next-themes handles SSR edge cases automatically |

### Installation

```bash
npm install next-themes motion resend
```

**Note:** `@vercel/og` is already included in Next.js 16 App Router via `next/og` - no separate installation needed.

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # ThemeProvider wrapper, suppressHydrationWarning
│   ├── sitemap.ts              # Dynamic sitemap generation (570+ URLs)
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
│       └── skeleton.tsx        # Shimmer loading (enhance existing)
├── lib/
│   └── animations.ts           # Shared animation CSS classes
└── styles/
    └── globals.css             # CSS animations, shimmer keyframes
```

### Pattern 1: next-themes Setup (Avoiding Hydration Mismatch)

**What:** Configure dark mode with system preference detection
**When to use:** Root layout setup
**Source:** [next-themes GitHub](https://github.com/pacocoursey/next-themes)

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

**What:** Client component for switching themes with hydration-safe rendering
**When to use:** Header/navbar

```tsx
// src/components/theme-toggle.tsx
'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden="true" />;
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

**What:** Micro-interactions using pure CSS (no JS bundle cost)
**When to use:** Hover states, click feedback, simple transitions
**Source:** [Core Web Vitals Guide 2025](https://www.digitalapplied.com/blog/core-web-vitals-optimization-guide-2025)

```css
/* Add to src/app/globals.css */

/* Shimmer animation for skeletons - GPU accelerated */
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.animate-shimmer {
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Card hover lift - GPU accelerated (transform + opacity only) */
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

/* Reduced motion support - REQUIRED for accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Pattern 4: Motion useAnimate for Staggered Lists

**What:** Orchestrated stagger animations with minimal bundle (2.3KB)
**When to use:** Table rows appearing, list item staggers
**Source:** [Motion useAnimate docs](https://motion.dev/docs/react-use-animate)

```tsx
// src/components/animated/stagger-rows.tsx
'use client';

import { useAnimate, stagger } from 'motion/react-mini';
import { useEffect } from 'react';

interface StaggerRowsProps {
  children: React.ReactNode;
  staggerDelay?: number;
}

export function StaggerRows({ children, staggerDelay = 0.05 }: StaggerRowsProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    animate(
      '[data-row]',
      { opacity: [0, 1], y: [8, 0] },
      { delay: stagger(staggerDelay), duration: 0.2 }
    );
  }, [animate, staggerDelay]);

  return <div ref={scope}>{children}</div>;
}
```

**Key:** Import from `motion/react-mini` (2.3KB) not `motion/react` (34KB). The mini version uses WAAPI exclusively for hardware acceleration.

### Pattern 5: OG Image Generation (Next.js 16 API)

**What:** Dynamic Open Graph images per page
**When to use:** DEX detail pages, chain pages
**Source:** [Next.js ImageResponse Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)

```tsx
// src/app/dex/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og';

export const alt = 'DEX Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// CRITICAL: In Next.js 16+, params is a Promise
export default async function Image({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params; // Must await!

  // Fetch DEX data
  const dex = await getDexBySlug(slug);

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
          backgroundColor: '#1a0a2e', // Brand purple-black
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
            color: '#4ade80', // Brand green
          }}
        >
          ${formatTVL(dex.tvl)} TVL
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

**Important limitations:**
- Only flexbox layout (`display: flex`), no CSS grid
- Total assets must be under 500KB
- Use `ttf` or `otf` fonts, not `woff2`
- OKLCH colors may not work - use hex/rgb

### Pattern 6: Dynamic Sitemap Generation

**What:** Programmatic sitemap for all 570+ URLs
**When to use:** Root app directory
**Source:** [Next.js Sitemap Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { dexes, chains } from '@/lib/db/schema';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dexrank.com';

export const revalidate = 3600; // ISR: regenerate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all slugs from database
  const allDexes = await db.select({ slug: dexes.slug }).from(dexes);
  const allChains = await db.select({ slug: chains.slug }).from(chains);

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/rankings`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${BASE_URL}/chains`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const dexPages: MetadataRoute.Sitemap = allDexes.map(({ slug }) => ({
    url: `${BASE_URL}/dex/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  const chainPages: MetadataRoute.Sitemap = allChains.map(({ slug }) => ({
    url: `${BASE_URL}/chain/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...dexPages, ...chainPages];
}
```

### Pattern 7: robots.ts Configuration

**What:** Dynamic robots.txt with sitemap reference
**Source:** [Next.js robots Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)

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

### Pattern 8: Newsletter Signup with Resend (2025 API)

**What:** Simple email capture using Resend's global contacts API
**When to use:** Footer newsletter form
**Source:** [Resend Contacts API](https://resend.com/docs/dashboard/audiences/introduction)

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

    // 2025 API: Contacts are global entities, no audience_id required
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: false,
    });

    if (error) {
      // Handle duplicate email gracefully
      if (error.message?.includes('already exists')) {
        return Response.json({ success: true, message: 'Already subscribed' });
      }
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

- **Using `motion/react` for simple hover states:** CSS is faster, smaller (0KB vs 34KB), and sufficient for single-element animations.
- **Not using `suppressHydrationWarning`:** Will cause hydration errors with next-themes.
- **Rendering theme UI before mount check:** Server doesn't know the theme, causing mismatches.
- **Importing from `motion/react` instead of `motion/react-mini`:** Full import is 34KB vs 2.3KB for useAnimate.
- **Animating `width`, `height`, `margin`:** These trigger layout recalculations. Only use `transform` and `opacity` for 60fps.
- **Not respecting `prefers-reduced-motion`:** Accessibility violation and poor UX for users with vestibular disorders.
- **Using OKLCH in ImageResponse:** OG image generation doesn't support OKLCH colors - use hex or rgb.
- **Not awaiting params in Next.js 16:** In v16+, `params` is a Promise that must be awaited.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Theme persistence | localStorage + custom context | next-themes | Handles SSR, system preference, hydration |
| OG image rendering | Canvas/Puppeteer | `next/og` ImageResponse | Built-in, Edge-optimized, JSX syntax |
| Sitemap generation | Manual XML files | `sitemap.ts` convention | Type-safe, automatic caching, dynamic |
| robots.txt | Static file | `robots.ts` convention | Dynamic, type-safe, references sitemap |
| Email capture | SMTP/nodemailer | Resend | Modern API, global contacts, free tier |
| Shimmer animation | Complex JS animation | CSS `@keyframes` | GPU-accelerated, zero JS |
| Reduced motion | Manual media query | CSS `@media (prefers-reduced-motion)` | Automatic, no JS |
| Staggered animations | Manual setTimeout loops | `motion/react-mini` useAnimate | 2.3KB, handles cleanup |

**Key insight:** Next.js 16 has built-in conventions for most SEO and metadata needs. The App Router's file-based metadata system (`sitemap.ts`, `robots.ts`, `opengraph-image.tsx`) is type-safe and automatically cached - no external libraries needed.

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
**Why it happens:** Default `motion/react` import includes all features
**How to avoid:**
1. Use CSS for hover states, press feedback, fades (0KB)
2. Use `useAnimate` from `motion/react-mini` (2.3KB) for orchestration
3. Never use full `motion` components unless LazyMotion is configured
**Warning signs:** Bundle size jumps significantly after adding animations

### Pitfall 3: OG Image Generation Failures

**What goes wrong:** OG images fail to generate or look broken
**Why it happens:** ImageResponse has strict limitations - flexbox only, 500KB limit, limited CSS
**How to avoid:**
1. Only use flexbox (`display: flex`), no CSS grid
2. Keep total assets under 500KB (inline fonts, minimal images)
3. Use `ttf` or `otf` fonts, not `woff2`
4. Use hex/rgb colors, not oklch
5. In Next.js 16+, always `await params`
**Warning signs:** Blank images, SSR errors in production

### Pitfall 4: Sitemap Caching in Next.js 16

**What goes wrong:** Sitemap regenerates on every request (slow, high DB load)
**Why it happens:** Using dynamic APIs opts out of static caching
**How to avoid:**
1. Add `export const revalidate = 3600` for ISR
2. Use efficient DB queries (select only slugs, not full records)
3. Consider splitting into multiple sitemaps if >50K URLs
**Warning signs:** High database load, slow `/sitemap.xml` responses

### Pitfall 5: CLS from Theme Toggle Icon

**What goes wrong:** Layout shift when theme icon changes between Sun/Moon
**Why it happens:** Icon renders as nothing during hydration, then appears
**How to avoid:**
1. Return a placeholder `<div>` with exact same dimensions as icon
2. Use `w-9 h-9` or explicit sizing that matches mounted state
3. Use `aria-hidden="true"` on placeholder
**Warning signs:** CLS score > 0.1, visible jump when page loads

### Pitfall 6: INP Issues from Heavy JS

**What goes wrong:** INP exceeds 200ms threshold
**Why it happens:** Too much JavaScript blocking the main thread
**How to avoid:**
1. Keep animation JS minimal (CSS first, 2.3KB useAnimate second)
2. Use React Server Components - they ship zero JS
3. Defer non-critical scripts with `<Script strategy="lazyOnload">`
4. Avoid large bundle imports in client components
**Warning signs:** INP > 200ms in PageSpeed Insights

## Code Examples

### Skeleton with Shimmer (Enhancement to Existing)

```tsx
// src/components/ui/skeleton.tsx - Enhanced version
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.ComponentProps<'div'> {
  shimmer?: boolean;
}

function Skeleton({ className, shimmer = true, ...props }: SkeletonProps) {
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

export function CountUp({
  end,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0
}: CountUpProps) {
  const [count, setCount] = useState(0);
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

      // Ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure exact final value
      }
    };

    requestAnimationFrame(animate);

    return () => {
      startTimeRef.current = null;
    };
  }, [end, duration]);

  const formatted = count.toFixed(decimals);
  return <span className="tabular-nums">{prefix}{formatted}{suffix}</span>;
}
```

### Newsletter Form Component

```tsx
// src/components/newsletter-form.tsx
'use client';

import { useState } from 'react';
import { z } from 'zod';

const emailSchema = z.string().email();

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="flex-1 px-4 py-2 rounded-md border bg-background"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {message && (
        <p className={status === 'success' ? 'text-green-500' : 'text-destructive'}>
          {message}
        </p>
      )}
    </form>
  );
}
```

## Core Web Vitals Optimization Techniques

### LCP (Largest Contentful Paint) - Target: <2.5s

| Technique | Implementation |
|-----------|---------------|
| Preload hero images | `<Image priority />` on above-fold images |
| Use Next.js Image | Automatic optimization, `sizes` prop for responsive |
| Server Components | Ship zero JS, faster HTML delivery |
| Edge deployment | Vercel Edge Network reduces TTFB |

### INP (Interaction to Next Paint) - Target: <200ms

| Technique | Implementation |
|-----------|---------------|
| Minimize client JS | Use Server Components (can reduce bundle 30-60%) |
| Small animation bundle | `motion/react-mini` at 2.3KB vs 34KB |
| Defer non-critical scripts | `<Script strategy="lazyOnload">` |
| Avoid layout-triggering animations | Only animate `transform` and `opacity` |

### CLS (Cumulative Layout Shift) - Target: <0.1

| Technique | Implementation |
|-----------|---------------|
| Reserve space for dynamic content | Use Skeleton with explicit dimensions |
| Specify image dimensions | Always set `width` and `height` on Image |
| Avoid FOUT | Use `display: swap` for fonts, reserve space |
| Theme toggle placeholder | Same-size div until mounted |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` import | `motion/react` import | 2024 (Motion rebrand) | Same features, cleaner imports |
| Full motion bundle (34KB) | `motion/react-mini` (2.3KB) | Available now | 93% smaller for useAnimate |
| Manual OG with Puppeteer | `next/og` ImageResponse | Next.js 13.3+ | Edge-native, 10x faster |
| External sitemap libs | `sitemap.ts` convention | Next.js 13+ | Type-safe, zero config |
| Sync params access | `await params` (Promise) | Next.js 16.0.0 | Breaking change |
| `darkMode: ['class']` in config | `@custom-variant` in CSS | Tailwind v4 | Simpler, CSS-native |
| FID metric | INP metric | March 2024 | Focus on all interactions |
| Resend audience-scoped contacts | Global contacts by email | 2025 | Simpler API |

**Deprecated/outdated:**
- `framer-motion` package name: Still works but `motion` is the new package
- Sync `params` access: Must await in Next.js 16+
- `darkMode: ['class']` in tailwind.config: Tailwind v4 uses `@custom-variant` in CSS
- `@vercel/og` separate install: Now built into `next/og` in App Router
- Resend `audienceId` required: 2025 API makes contacts global

## Open Questions

1. **Inter tabular figures via Google Fonts**
   - What we know: Google Fonts Inter strips OpenType features to reduce file size
   - What's unclear: Whether `font-feature-settings: 'tnum'` works with Google Fonts Inter
   - Recommendation: Test with Google Fonts first; if tabular figures don't work, self-host Inter from rsms.me

2. **OKLCH in OG images**
   - What we know: ImageResponse uses Satori which has limited CSS support
   - What's unclear: Whether oklch colors work in ImageResponse
   - Recommendation: Use hex colors (#1a0a2e for purple-black, #4ade80 for green) in OG images

3. **Resend free tier limits**
   - What we know: 1,000 contacts free, then $40/mo for 5K contacts
   - What's unclear: Whether storing emails in own DB + sending via Resend is better
   - Recommendation: Start with Resend contacts; evaluate DB storage if list grows large

## Sources

### Primary (HIGH confidence)
- [Next.js ImageResponse API Docs](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image) - OG image generation, params Promise change
- [Next.js Sitemap File Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) - Dynamic sitemap generation
- [Next.js robots.txt Convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots) - robots.ts configuration
- [next-themes GitHub](https://github.com/pacocoursey/next-themes) - Theme provider setup, hydration handling
- [Resend Next.js Docs](https://resend.com/docs/send-with-nextjs) - Newsletter integration
- [Motion Library GitHub](https://github.com/motiondivision/motion) - Animation library
- [Motion useAnimate Docs](https://motion.dev/docs/react-use-animate) - Stagger animation patterns
- [Motion Bundle Size Docs](https://motion.dev/docs/react-reduce-bundle-size) - mini vs hybrid packages

### Secondary (MEDIUM confidence)
- [Core Web Vitals Optimization Guide 2025](https://www.digitalapplied.com/blog/core-web-vitals-optimization-guide-2025) - LCP, INP, CLS techniques
- [How to Optimize Core Web Vitals in NextJS 2025](https://makersden.io/blog/optimize-web-vitals-in-nextjs-2025) - Next.js specific patterns
- [shadcn/ui Skeleton](https://ui.shadcn.com/docs/components/skeleton) - Skeleton component patterns
- [Resend Audiences Introduction](https://resend.com/docs/dashboard/audiences/introduction) - 2025 contacts API changes

### Tertiary (LOW confidence - verify before use)
- Various blog posts on specific implementation details

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs and widely adopted libraries verified
- Architecture patterns: HIGH - Based on official Next.js 16 conventions
- Pitfalls: HIGH - Verified from official docs and changelog
- Animation specifics: HIGH - Motion docs verified, bundle sizes confirmed
- Core Web Vitals: MEDIUM - Multiple sources agree, techniques proven

**Research date:** 2026-01-20
**Valid until:** 2026-02-20 (30 days - stable libraries, established patterns)
