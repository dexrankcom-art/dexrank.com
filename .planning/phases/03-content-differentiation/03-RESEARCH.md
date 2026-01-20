# Phase 3: Content & Differentiation - Research

**Researched:** 2026-01-20
**Domain:** Editorial content, MDX, SEO schema markup, content pages
**Confidence:** HIGH

## Summary

Phase 3 transforms DexRank from a data-only platform to a content-rich authority site. The core technical domains are:

1. **MDX Content System** - For editorial content (guides, Editor's Takes, chain context)
2. **JSON-LD Schema Markup** - For SEO rich snippets (Review, SoftwareApplication, ItemList)
3. **Dynamic Route Patterns** - For comparison pages `/compare/[dex-1]-vs-[dex-2]` and category pages
4. **Content Architecture** - File-based MDX content with frontmatter metadata

The recommended approach uses Next.js App Router with `@next/mdx` for static editorial content stored in Git (guides, methodology), combined with database-driven pages (comparisons, chains) that pull dynamic metrics. This keeps editorial content version-controlled while metrics stay fresh via ISR.

**Primary recommendation:** Use `@next/mdx` with `gray-matter` for frontmatter parsing. Store editorial content as MDX files in `/content` directory. Use `schema-dts` for type-safe JSON-LD structured data.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @next/mdx | ^15.0.0 | MDX page support | Official Next.js MDX integration |
| @mdx-js/loader | ^3.0.0 | MDX webpack loader | Required by @next/mdx |
| @mdx-js/react | ^3.0.0 | MDX React runtime | Required for components in MDX |
| gray-matter | ^4.0.3 | YAML frontmatter parsing | Industry standard, 30M+ weekly downloads |
| schema-dts | ^1.1.2 | TypeScript types for Schema.org | Type-safe JSON-LD generation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tailwindcss/typography | ^0.5.0 | Prose styling for MDX | Already have Tailwind; `prose` classes for rich text |
| @types/mdx | ^2.0.0 | TypeScript MDX types | Already have TypeScript |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @next/mdx | Contentlayer | More features but beta/unmaintained since 2023 |
| @next/mdx | next-mdx-remote | Better for remote content; overkill for local files |
| File-based content | CMS (Sanity, etc) | Complexity overhead for 16 guides + 50 reviews |

**Installation:**
```bash
npm install @next/mdx @mdx-js/loader @mdx-js/react gray-matter schema-dts @tailwindcss/typography @types/mdx
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── compare/
│   │   └── [slugs]/           # /compare/uniswap-vs-sushiswap
│   │       └── page.tsx       # Dynamic, DB-driven comparison
│   ├── chains/
│   │   └── [slug]/            # /chains/ethereum
│   │       └── page.tsx       # Dynamic, DB-driven chain page
│   ├── guides/
│   │   └── [slug]/            # /guides/what-is-a-dex
│   │       └── page.tsx       # Loads MDX from /content/guides
│   ├── category/
│   │   └── [slug]/            # /category/spot, /category/perp
│   │       └── page.tsx       # Dynamic, DB-driven category page
│   └── how-we-rank/
│       └── page.tsx           # Static methodology page
├── content/
│   ├── guides/                # MDX files with frontmatter
│   │   ├── what-is-a-dex.mdx
│   │   ├── dex-vs-cex.mdx
│   │   └── ...
│   ├── reviews/               # Editor's Takes for Tier 1-2 DEXs
│   │   ├── uniswap.mdx
│   │   ├── pancakeswap.mdx
│   │   └── ...
│   └── chains/                # Chain ecosystem context
│       ├── ethereum.mdx
│       ├── solana.mdx
│       └── ...
├── components/
│   ├── mdx/                   # Custom MDX components
│   │   ├── callout.tsx
│   │   ├── comparison-table.tsx
│   │   └── internal-link.tsx
│   ├── comparison/
│   │   ├── comparison-header.tsx
│   │   ├── feature-table.tsx
│   │   ├── metrics-comparison.tsx
│   │   └── best-for-section.tsx
│   ├── chain/
│   │   ├── chain-header.tsx
│   │   ├── chain-dex-list.tsx
│   │   └── ecosystem-overview.tsx
│   └── seo/
│       └── json-ld.tsx        # Reusable JSON-LD component
└── lib/
    ├── content/
    │   ├── mdx.ts             # MDX loading utilities
    │   └── frontmatter.ts     # Frontmatter types/parsing
    └── seo/
        ├── schemas.ts         # JSON-LD schema generators
        └── meta.ts            # Metadata generators
```

### Pattern 1: MDX Content with Frontmatter

**What:** Load MDX files with YAML frontmatter for metadata
**When to use:** Guides, Editor's Takes, chain context content

```typescript
// Source: gray-matter docs + Next.js MDX guide
// lib/content/mdx.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GuideFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  seoKeywords?: string[];
}

export async function getGuideBySlug(slug: string) {
  const filePath = path.join(process.cwd(), 'content/guides', `${slug}.mdx`);
  const source = fs.readFileSync(filePath, 'utf8');
  const { content, data } = matter(source);

  return {
    content,
    frontmatter: data as GuideFrontmatter,
    slug,
  };
}

export async function getAllGuideSlugs(): Promise<string[]> {
  const guidesDir = path.join(process.cwd(), 'content/guides');
  const files = fs.readdirSync(guidesDir);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}
```

### Pattern 2: JSON-LD Schema Markup

**What:** Type-safe structured data for SEO rich snippets
**When to use:** All content pages (reviews, comparisons, guides)

```typescript
// Source: Next.js JSON-LD guide + schema-dts docs
// lib/seo/schemas.ts
import type { Review, SoftwareApplication, ItemList, WithContext, Article } from 'schema-dts';

export function generateReviewSchema(
  protocol: { name: string; logo: string | null; url: string | null },
  score: number,
  rank: number,
  totalProtocols: number
): WithContext<Review> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: protocol.name,
      image: protocol.logo || undefined,
      url: protocol.url || undefined,
      applicationCategory: 'DeFi',
      applicationSubCategory: 'Decentralized Exchange',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: score,
      bestRating: 100,
      worstRating: 0,
    },
    author: {
      '@type': 'Organization',
      name: 'DexRank',
      url: 'https://dexrank.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DexRank',
    },
  };
}

export function generateComparisonSchema(
  dex1: { name: string; score: number },
  dex2: { name: string; score: number }
): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${dex1.name} vs ${dex2.name} Comparison`,
    numberOfItems: 2,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'SoftwareApplication',
          name: dex1.name,
          applicationCategory: 'DeFi',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'SoftwareApplication',
          name: dex2.name,
          applicationCategory: 'DeFi',
        },
      },
    ],
  };
}

export function generateGuideSchema(
  guide: { title: string; description: string; publishedAt: string; updatedAt?: string }
): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'DexRank',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DexRank',
      url: 'https://dexrank.com',
    },
  };
}
```

### Pattern 3: Reusable JSON-LD Component

**What:** XSS-safe JSON-LD rendering component
**When to use:** All pages with structured data

```typescript
// Source: Next.js JSON-LD guide
// components/seo/json-ld.tsx
import type { Thing, WithContext } from 'schema-dts';

interface JsonLdProps {
  data: WithContext<Thing>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
```

### Pattern 4: Comparison Page URL Structure

**What:** SEO-friendly comparison URLs with deterministic ordering
**When to use:** Comparison pages at `/compare/[dex-1]-vs-[dex-2]`

```typescript
// Source: SEO best practices for comparison pages
// lib/comparison/utils.ts

// Always alphabetize to create canonical URLs
// /compare/uniswap-vs-aave redirects to /compare/aave-vs-uniswap
export function getCanonicalComparisonSlug(slug1: string, slug2: string): string {
  const sorted = [slug1, slug2].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}

export function parseComparisonSlug(slugs: string): { dex1: string; dex2: string } | null {
  const match = slugs.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  return { dex1: match[1], dex2: match[2] };
}
```

### Pattern 5: Editorial Content Tiers

**What:** Different content depth for different DEX tiers
**When to use:** Prioritizing editorial effort

```
Tier 1 (Top 10 by TVL): Full editorial content
- 1000+ word Editor's Take
- Detailed pros/cons
- Feature deep-dive
- Security analysis
- Fee structure breakdown
- "Best for" recommendations

Tier 2 (11-50 by TVL): Moderate editorial content
- 300-500 word Editor's Take
- Key pros/cons
- Brief security notes

Tier 3 (51+): Template-only
- Auto-generated from data
- No manual editorial content
```

### Anti-Patterns to Avoid

- **Storing editorial content in database:** Use Git-based MDX files for version control, easy editing, and collaboration
- **Generating all comparison pages at build:** With 200+ DEXs, that's 20,000+ combinations. Use ISR with on-demand generation
- **Hardcoding JSON-LD:** Use typed schemas for maintainability and type safety
- **Single MDX component file:** Separate components for reuse across guides
- **Non-canonical comparison URLs:** Always alphabetize slugs to prevent duplicate content

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| YAML frontmatter parsing | Custom regex parser | gray-matter | Edge cases with multiline values, escaping, types |
| Prose typography | Custom CSS for headers, lists, etc | @tailwindcss/typography | Consistent, responsive, dark mode support |
| Schema.org types | Manual TypeScript interfaces | schema-dts | 600+ types, always in sync with schema.org |
| MDX compilation | Custom markdown parser | @next/mdx + @mdx-js | RSC support, plugins, error handling |
| Comparison URL parsing | String.split() | Regex with validation | Handle edge cases (dex names with hyphens) |

**Key insight:** Content management looks simple but has many edge cases. Using established libraries saves debugging time and handles internationalization, escaping, and edge cases automatically.

## Common Pitfalls

### Pitfall 1: MDX Build-Time Only
**What goes wrong:** MDX content only available at build time, no ISR
**Why it happens:** Using file imports instead of dynamic loading
**How to avoid:** Use `fs.readFileSync` in server components with ISR
**Warning signs:** Editorial updates require full rebuild

### Pitfall 2: Duplicate Comparison Pages
**What goes wrong:** `/compare/a-vs-b` and `/compare/b-vs-a` both exist as separate pages
**Why it happens:** Not canonicalizing comparison URLs
**How to avoid:** Always sort slugs alphabetically, redirect non-canonical URLs
**Warning signs:** Google Search Console shows duplicate content warnings

### Pitfall 3: Missing JSON-LD on Client Navigation
**What goes wrong:** JSON-LD only renders on initial page load
**Why it happens:** JSON-LD in `<head>` not updating on client navigation
**How to avoid:** Place JSON-LD in page component (not layout), Next.js handles it
**Warning signs:** Rich results work for direct URLs but not after navigation

### Pitfall 4: Stale Editorial with Fresh Metrics
**What goes wrong:** Editor's Take says "TVL of $1B" but current TVL is $500M
**Why it happens:** Mixing static editorial with dynamic data
**How to avoid:** Never hardcode metrics in editorial content. Reference them programmatically
**Warning signs:** Editorial content contradicts displayed metrics

### Pitfall 5: Over-Generating Static Pages
**What goes wrong:** Build takes 30+ minutes, 20,000+ comparison pages
**Why it happens:** Using generateStaticParams for all possible comparisons
**How to avoid:** Only pre-generate top 20-50 comparisons, use ISR for rest
**Warning signs:** Build time increases exponentially with protocol count

### Pitfall 6: Thin Content on Auto-Generated Pages
**What goes wrong:** Chain/category pages have no unique content, just filtered lists
**Why it happens:** No editorial context or ecosystem overview
**How to avoid:** Add MDX content for chain ecosystem context, category explanations
**Warning signs:** Pages rank poorly despite good technical SEO

## Code Examples

Verified patterns from official sources:

### Next.js MDX Configuration
```javascript
// Source: https://nextjs.org/docs/app/guides/mdx
// next.config.mjs
import createMDX from '@next/mdx';

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

const withMDX = createMDX({
  // Add markdown plugins here if needed
});

export default withMDX(nextConfig);
```

### MDX Components File (Required)
```typescript
// Source: https://nextjs.org/docs/app/guides/mdx
// mdx-components.tsx (project root)
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import Link from 'next/link';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mt-6 mb-3">{children}</h2>
    ),
    a: ({ href, children }) => (
      <Link href={href || '#'} className="text-blue-600 hover:underline">
        {children}
      </Link>
    ),
    img: (props) => (
      <Image
        {...props}
        alt={props.alt || ''}
        width={800}
        height={400}
        className="rounded-lg my-4"
      />
    ),
    ...components,
  };
}
```

### Guide Page with MDX + Frontmatter
```typescript
// Source: gray-matter docs + Next.js patterns
// app/guides/[slug]/page.tsx
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { JsonLd } from '@/components/seo/json-ld';
import { generateGuideSchema } from '@/lib/seo/schemas';

export const revalidate = 86400; // 24 hours for guides

export async function generateStaticParams() {
  const guidesDir = path.join(process.cwd(), 'content/guides');
  const files = fs.readdirSync(guidesDir);
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => ({ slug: f.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: `${guide.frontmatter.title} | DexRank Guides`,
    description: guide.frontmatter.description,
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      type: 'article',
    },
  };
}

async function getGuide(slug: string) {
  try {
    const filePath = path.join(process.cwd(), 'content/guides', `${slug}.mdx`);
    const source = fs.readFileSync(filePath, 'utf8');
    const { content, data } = matter(source);
    return { content, frontmatter: data, slug };
  } catch {
    return null;
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  if (!guide) notFound();

  const { default: MDXContent } = await import(`@/content/guides/${slug}.mdx`);
  const jsonLd = generateGuideSchema(guide.frontmatter);

  return (
    <main className="container mx-auto py-8 px-4">
      <JsonLd data={jsonLd} />
      <article className="prose prose-lg dark:prose-invert max-w-none">
        <h1>{guide.frontmatter.title}</h1>
        <MDXContent />
      </article>
    </main>
  );
}
```

### Comparison Page Pattern
```typescript
// app/compare/[slugs]/page.tsx
import { notFound, redirect } from 'next/navigation';
import { getProtocolBySlugWithRanking } from '@/lib/data/protocols';
import { getCanonicalComparisonSlug, parseComparisonSlug } from '@/lib/comparison/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { generateComparisonSchema } from '@/lib/seo/schemas';

export const revalidate = 3600; // 1 hour ISR

export async function generateStaticParams() {
  // Pre-generate only top comparison pairs
  const topPairs = [
    'uniswap-vs-pancakeswap',
    'uniswap-vs-sushiswap',
    // ... top 10-20 pairs
  ];
  return topPairs.map((slugs) => ({ slugs }));
}

export const dynamicParams = true; // Allow on-demand generation

export default async function ComparePage({ params }: { params: Promise<{ slugs: string }> }) {
  const { slugs } = await params;
  const parsed = parseComparisonSlug(slugs);
  if (!parsed) notFound();

  const { dex1: slug1, dex2: slug2 } = parsed;

  // Redirect to canonical URL if not alphabetized
  const canonical = getCanonicalComparisonSlug(slug1, slug2);
  if (slugs !== canonical) {
    redirect(`/compare/${canonical}`);
  }

  const [dex1, dex2] = await Promise.all([
    getProtocolBySlugWithRanking(slug1),
    getProtocolBySlugWithRanking(slug2),
  ]);

  if (!dex1 || !dex2) notFound();

  const jsonLd = generateComparisonSchema(
    { name: dex1.name, score: dex1.scoreBreakdown.overall },
    { name: dex2.name, score: dex2.scoreBreakdown.overall }
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <JsonLd data={jsonLd} />
      {/* Comparison UI components */}
    </main>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Contentlayer | @next/mdx + gray-matter | 2024 | Contentlayer unmaintained; official MDX is stable |
| Microdata schema | JSON-LD | 2020+ | Google prefers JSON-LD, easier to maintain |
| getStaticProps | Server Components | Next.js 13+ | Simpler data fetching, better caching |
| Manual frontmatter parsing | gray-matter | Long standard | Handles YAML/JSON/TOML, multiline, escaping |

**Deprecated/outdated:**
- Contentlayer: Development stalled since late 2023, use @next/mdx instead
- next-mdx-enhanced: Archived, replaced by @next/mdx
- Microdata: Still works but JSON-LD preferred by search engines

## Open Questions

Things that couldn't be fully resolved:

1. **Editor's Take Content Source**
   - What we know: Need 50 DEX reviews with editorial content
   - What's unclear: Will content be written manually or AI-assisted?
   - Recommendation: Plan for manual MDX file creation; AI generation is editorial decision

2. **Comparison Page Count**
   - What we know: 200+ DEXs = 20,000+ possible comparisons
   - What's unclear: Which specific pairs to pre-generate?
   - Recommendation: Pre-generate top 10-20 by search volume/importance, ISR for rest

3. **Chain Ecosystem Content Depth**
   - What we know: 27 chains need pages
   - What's unclear: How much unique content per chain?
   - Recommendation: Start with 10 priority chains (CHAIN-05 requirement), 200-300 words each

## Sources

### Primary (HIGH confidence)
- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx) - Official setup, configuration, patterns
- [Next.js JSON-LD Guide](https://nextjs.org/docs/app/guides/json-ld) - Official structured data approach
- [Schema.org Review](https://schema.org/Review) - Review schema properties
- [Schema.org ItemList](https://schema.org/ItemList) - List/comparison schema
- [Schema.org SoftwareApplication](https://schema.org/SoftwareApplication) - App schema for DEXs
- [gray-matter npm](https://www.npmjs.com/package/gray-matter) - Frontmatter parsing

### Secondary (MEDIUM confidence)
- [Tailwind Typography Plugin](https://github.com/tailwindlabs/tailwindcss-typography) - Prose styling
- [CoinGecko Trust Score Methodology](https://support.coingecko.com/hc/en-us/articles/36442561461657-Trust-Score-Methodology) - Industry methodology page pattern
- [Tech Pilot MDX Guide](https://www.yourtechpilot.com/blog/building-mdx-blog-nextjs) - Next.js 16 MDX patterns

### Tertiary (LOW confidence)
- WebSearch results for Contentlayer status - Development appears stalled
- WebSearch results for comparison page SEO - General best practices

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Next.js + established npm packages
- Architecture: HIGH - Direct from Next.js docs and MDX patterns
- JSON-LD schemas: HIGH - Schema.org official documentation
- Pitfalls: MEDIUM - Derived from common patterns, not verified by production use

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - stack is stable)
