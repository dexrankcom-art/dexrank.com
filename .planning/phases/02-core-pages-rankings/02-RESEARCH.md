# Phase 02: Core Pages & Rankings - Research

**Researched:** 2026-01-18
**Domain:** DEX ranking algorithms, data tables, filter/search UX, review page structure
**Confidence:** HIGH (verified with official docs and multiple sources)

## Summary

This phase requires building a ranking algorithm for ~1500 DEX protocols, displaying them in a filterable/sortable data table, and creating individual review pages. The research covers five key domains:

1. **Ranking Algorithm**: Use percentile rank normalization for metrics with high variance (TVL ranges from $0 to billions). Calculate composite score using weighted average of normalized metrics. Market share approach (value / total) works well for financial data.

2. **Data Tables**: TanStack Table v8 with shadcn/ui Table component is the standard stack. Table logic must be client-side ("use client") but data can be fetched server-side. shadcn/ui provides excellent starter patterns.

3. **URL State**: nuqs library is the current SOTA for URL-synced filter/sort state in Next.js. Used by Vercel, Supabase, Sentry. Provides type-safe parsers and handles batched updates.

4. **Search**: For ~1500 items, client-side filtering with `useDeferredValue` is ideal - no debounce delay needed, React handles prioritization. SQL ILIKE already implemented in data layer as fallback.

5. **Review Pages**: Use `generateStaticParams` for SEO + ISR with `revalidate` for fresh data. Template structure: Overview, Features, Fees, Security, Pros/Cons, Verdict.

**Primary recommendation:** Build ranking calculation in the data layer (server-side), use TanStack Table + nuqs for the interactive homepage, and leverage existing `getProtocols` queries with URL params driving filters.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tanstack/react-table | ^8.x | Data table logic | Industry standard, headless, fully typed |
| nuqs | ^2.x | URL state management | Type-safe, Next.js native, used by Vercel/Supabase |
| shadcn/ui Table | latest | Table UI components | Already installed, pairs with TanStack |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | ^0.562.0 | Icons | Already installed, use for sort arrows/filters |
| zod | ^4.3.5 | Validation | Already installed, validate ranking weights |

### Already Installed (No New Dependencies Needed For Core Features)
The project already has: shadcn/ui components, Tailwind CSS, Drizzle ORM with server-side filtering/sorting implemented.

**Installation (only new packages):**
```bash
npm install @tanstack/react-table nuqs
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── app/
│   ├── page.tsx                    # Homepage (Server Component, fetches data)
│   ├── reviews/
│   │   └── [slug]/
│   │       └── page.tsx            # DEX review page (SSG + ISR)
│   └── providers.tsx               # NuqsAdapter wrapper
├── components/
│   ├── rankings/
│   │   ├── columns.tsx             # Column definitions ("use client")
│   │   ├── data-table.tsx          # DataTable component ("use client")
│   │   ├── table-toolbar.tsx       # Filters, search ("use client")
│   │   └── rank-badge.tsx          # Score display component
│   └── reviews/
│       ├── review-header.tsx       # DEX name, logo, score
│       ├── metrics-grid.tsx        # TVL, volume cards
│       └── review-sections.tsx     # Templated content sections
├── lib/
│   ├── ranking/
│   │   ├── calculate-score.ts      # DexRank algorithm
│   │   ├── normalize.ts            # Percentile/market-share normalization
│   │   └── weights.ts              # Configurable weight constants
│   └── data/
│       └── protocols.ts            # Existing - add ranking queries
└── types/
    └── ranking.ts                  # Score breakdown types
```

### Pattern 1: Ranking Calculation (Server-Side)

**What:** Calculate DexRank scores in the data layer, not client-side
**When to use:** Always - scores should be computed with full dataset context

```typescript
// src/lib/ranking/calculate-score.ts
// Source: Placeholder VC methodology + percentile normalization research

export type RankingWeights = {
  tvl: number;           // e.g., 0.30
  volume: number;        // e.g., 0.25
  growth: number;        // e.g., 0.20
  liquidity: number;     // e.g., 0.15
  trust: number;         // e.g., 0.10
};

export const DEFAULT_WEIGHTS: RankingWeights = {
  tvl: 0.30,
  volume: 0.25,
  growth: 0.20,
  liquidity: 0.15,
  trust: 0.10,
};

export type ScoreBreakdown = {
  overall: number;       // 0-100 composite score
  components: {
    tvl: number;         // 0-100 normalized
    volume: number;
    growth: number;
    liquidity: number;
    trust: number;
  };
  rank: number;          // Position 1-N
  percentile: number;    // 0-100 (top X%)
};

/**
 * Normalize using percentile rank (handles extreme variance in financial data)
 * Better than min-max for TVL data where top protocols dominate
 */
export function percentileNormalize(values: number[], value: number): number {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = sorted.findIndex(v => v >= value);
  return (rank / sorted.length) * 100;
}

/**
 * Market share approach (used by Placeholder VC)
 * Value as percentage of total across all protocols
 */
export function marketShareNormalize(total: number, value: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}
```

### Pattern 2: TanStack Table + shadcn/ui

**What:** Client-side table with server-fetched data
**When to use:** Homepage rankings display

```typescript
// src/components/rankings/columns.tsx
// Source: shadcn/ui Data Table documentation
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export type RankedProtocol = {
  rank: number;
  slug: string;
  name: string;
  logo: string | null;
  category: string | null;
  chains: string[];
  dexRankScore: number;
  tvl: number | null;
  volume24h: number | null;
};

export const columns: ColumnDef<RankedProtocol>[] = [
  {
    accessorKey: "rank",
    header: "#",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("rank")}</span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.logo && (
          <img src={row.original.logo} alt="" className="h-6 w-6 rounded" />
        )}
        <span className="font-medium">{row.getValue("name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "dexRankScore",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        DexRank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-primary">
        {row.getValue<number>("dexRankScore").toFixed(1)}
      </span>
    ),
  },
  // ... TVL, Volume columns with formatters
];
```

### Pattern 3: URL State with nuqs

**What:** Sync filter/sort state to URL for shareability and SSR
**When to use:** Homepage filters, any stateful UI that should be shareable

```typescript
// src/app/providers.tsx
// Source: nuqs documentation
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>
}

// src/components/rankings/table-toolbar.tsx
"use client"
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs'

const sortOptions = ['rank', 'tvl', 'volume', 'name'] as const;
type SortOption = typeof sortOptions[number];

export function useTableFilters() {
  return useQueryStates({
    search: parseAsString.withDefault(''),
    chain: parseAsString,
    category: parseAsString,
    sort: parseAsStringEnum(sortOptions).withDefault('rank'),
    order: parseAsStringEnum(['asc', 'desc'] as const).withDefault('desc'),
  }, {
    shallow: false, // Trigger server re-render for SSR
  });
}
```

### Pattern 4: Mobile-Responsive Table

**What:** Hide columns on mobile, show card view or expandable rows
**When to use:** Tables that must work on mobile (HOME-07 requirement)

```typescript
// src/components/rankings/columns.tsx
// Source: TanStack Table responsive discussions

// Extend ColumnMeta for responsive behavior
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    hideOnMobile?: boolean;
  }
}

// Column with mobile visibility
{
  accessorKey: "volume24h",
  meta: { hideOnMobile: true },
  header: "24h Volume",
  // ...
}

// In data-table.tsx - apply responsive classes
{table.getHeaderGroups().map((headerGroup) => (
  <TableRow key={headerGroup.id}>
    {headerGroup.headers.map((header) => (
      <TableHead
        key={header.id}
        className={header.column.columnDef.meta?.hideOnMobile ? "hidden md:table-cell" : ""}
      >
        {/* ... */}
      </TableHead>
    ))}
  </TableRow>
))}
```

### Pattern 5: Review Page with ISR

**What:** Static generation with incremental regeneration for fresh metrics
**When to use:** Individual DEX review pages (REVIEW-01, REVIEW-02)

```typescript
// src/app/reviews/[slug]/page.tsx
// Source: Next.js ISR documentation

import { getProtocolBySlug, getAllProtocolSlugs } from '@/lib/data/protocols';

// Revalidate every hour for fresh metrics
export const revalidate = 3600;

// Pre-generate pages for all known protocols
export async function generateStaticParams() {
  const slugs = await getAllProtocolSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Allow new protocols to be generated on-demand
export const dynamicParams = true;

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) {
    notFound();
  }

  return (
    <article>
      <ReviewHeader protocol={protocol} />
      <MetricsGrid metrics={protocol.latestMetrics} />
      <ReviewSections protocol={protocol} />
    </article>
  );
}
```

### Anti-Patterns to Avoid
- **Client-side score calculation:** Don't calculate DexRank in the browser - metrics need full dataset context for percentile ranking
- **useState for filters:** Don't use local state for filters - use nuqs for URL state (shareability, SSR, back button)
- **Fetching in DataTable:** Don't fetch data inside the table component - pass data from Server Component
- **Fixed debounce for search:** Don't use arbitrary debounce delays - use `useDeferredValue` for natural prioritization

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Table sorting/filtering logic | Custom sort functions | TanStack Table | Handles edge cases, accessibility, performance |
| URL query state sync | Manual URLSearchParams | nuqs | Handles serialization, batching, history, types |
| Multi-select filter dropdowns | Custom checkbox lists | shadcn/ui DropdownMenuCheckboxItem | Accessibility, keyboard nav, focus management |
| Currency/number formatting | Manual toLocaleString | Intl.NumberFormat | Handles locales, edge cases correctly |
| Table pagination state | Custom page tracking | TanStack Table getPaginationRowModel | Handles page bounds, row counts |

**Key insight:** Data tables have dozens of edge cases (keyboard navigation, focus management, screen readers, empty states, loading states). TanStack Table + shadcn/ui handle all of these.

## Common Pitfalls

### Pitfall 1: Score Comparison Without Normalization
**What goes wrong:** Comparing raw TVL ($10B) with raw volume ($50M) creates meaningless composite scores
**Why it happens:** Different metrics have different scales and distributions
**How to avoid:** Always normalize metrics to 0-100 scale before weighting
**Warning signs:** One metric dominates the score regardless of weights

### Pitfall 2: Client-Side Filtering for Large Datasets
**What goes wrong:** Filtering 1500+ items on every keystroke causes jank
**Why it happens:** React re-renders entire list on each filter change
**How to avoid:** Use `useDeferredValue` to deprioritize list re-renders, or use server-side filtering (already implemented in `getProtocols`)
**Warning signs:** Noticeable lag when typing in search box

### Pitfall 3: Forgetting nuqs shallow: false
**What goes wrong:** Filters update URL but Server Component doesn't re-fetch
**Why it happens:** nuqs defaults to shallow: true (client-only updates)
**How to avoid:** Set `shallow: false` when filters should trigger server re-render
**Warning signs:** URL changes but data doesn't update until page refresh

### Pitfall 4: Mobile Table Horizontal Scroll
**What goes wrong:** Users can't see important columns without scrolling
**Why it happens:** Default table behavior with many columns
**How to avoid:** Use `hideOnMobile` meta + responsive classes to prioritize columns
**Warning signs:** Horizontal scrollbar appears on mobile, key info off-screen

### Pitfall 5: Missing generateStaticParams Return
**What goes wrong:** Review pages return 404 or slow initial loads
**Why it happens:** Dynamic routes without static generation
**How to avoid:** Implement `generateStaticParams` to pre-build known pages
**Warning signs:** First visit to review page is slow, Vercel shows dynamic function invocations

### Pitfall 6: Stale ISR Data
**What goes wrong:** Review pages show outdated metrics for hours
**Why it happens:** revalidate set too high, or on-demand revalidation not triggered
**How to avoid:** Use reasonable revalidate (3600s = 1 hour), trigger revalidatePath after sync
**Warning signs:** Metrics don't match API data, user complaints about stale data

## Code Examples

Verified patterns from official sources:

### Complete DataTable with Filtering
```typescript
// src/components/rankings/data-table.tsx
// Source: shadcn/ui Data Table + TanStack Table v8 docs
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search DEXs..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
```

### nuqs Filter State Management
```typescript
// src/hooks/use-protocol-filters.ts
// Source: nuqs documentation
"use client"

import { parseAsString, parseAsStringEnum, parseAsInteger, useQueryStates } from 'nuqs'

export const sortFields = ['rank', 'tvl', 'volume24h', 'name'] as const;
export type SortField = typeof sortFields[number];

export function useProtocolFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      chain: parseAsString,
      category: parseAsString,
      sort: parseAsStringEnum(sortFields).withDefault('rank'),
      order: parseAsStringEnum(['asc', 'desc'] as const).withDefault('asc'),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false, // Important: triggers server re-render
    }
  );

  return {
    filters,
    setSearch: (search: string) => setFilters({ search, page: 1 }),
    setChain: (chain: string | null) => setFilters({ chain, page: 1 }),
    setCategory: (category: string | null) => setFilters({ category, page: 1 }),
    setSort: (sort: SortField, order: 'asc' | 'desc') => setFilters({ sort, order }),
    setPage: (page: number) => setFilters({ page }),
  };
}
```

### Percentile Rank Calculation
```typescript
// src/lib/ranking/normalize.ts
// Source: Feature scaling research (Wikipedia, academic papers)

/**
 * Calculate percentile rank for a value within a sorted array
 * Returns 0-100 where 100 = top value
 *
 * Better than min-max for financial data because:
 * 1. Handles extreme outliers (top DEX has 100x more TVL than median)
 * 2. Preserves meaningful ranking differences
 * 3. Result is intuitive (percentile = "better than X% of peers")
 */
export function percentileRank(sortedValues: number[], value: number): number {
  if (sortedValues.length === 0) return 0;
  if (value <= sortedValues[0]) return 0;
  if (value >= sortedValues[sortedValues.length - 1]) return 100;

  // Count values less than current value
  let count = 0;
  for (const v of sortedValues) {
    if (v < value) count++;
    else break;
  }

  return (count / sortedValues.length) * 100;
}

/**
 * Batch calculate percentile ranks for efficiency
 * Pre-sorts once, then calculates all ranks
 */
export function batchPercentileRanks(
  values: { id: number; value: number | null }[]
): Map<number, number> {
  const validValues = values
    .filter((v): v is { id: number; value: number } => v.value !== null)
    .sort((a, b) => a.value - b.value);

  const ranks = new Map<number, number>();

  validValues.forEach((item, index) => {
    // Rank = position / total * 100
    ranks.set(item.id, (index / validValues.length) * 100);
  });

  // Null values get 0 percentile
  values
    .filter((v) => v.value === null)
    .forEach((v) => ranks.set(v.id, 0));

  return ranks;
}
```

### Review Page Template Structure
```typescript
// src/app/reviews/[slug]/page.tsx
// Source: DEX review page research (Cryptonews, CoinBureau patterns)

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProtocolBySlug, getProtocolScoreBreakdown } from '@/lib/data/protocols';

export const revalidate = 3600; // ISR: revalidate hourly

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) return { title: 'Not Found' };

  return {
    title: `${protocol.name} Review - DexRank`,
    description: `${protocol.name} DEX review with DexRank score, TVL, volume, fees, and security analysis.`,
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = await getProtocolBySlug(slug);

  if (!protocol) {
    notFound();
  }

  const scoreBreakdown = await getProtocolScoreBreakdown(protocol.id);

  return (
    <article className="container mx-auto py-8">
      {/* Header: Name, Logo, Overall Score */}
      <ReviewHeader protocol={protocol} score={scoreBreakdown.overall} />

      {/* Real-time metrics grid */}
      <MetricsGrid metrics={protocol.latestMetrics} />

      {/* Score breakdown visualization */}
      <ScoreBreakdown breakdown={scoreBreakdown} />

      {/* Templated sections (REVIEW-03) */}
      <section id="overview">
        <h2>Overview</h2>
        <p>{protocol.description || 'No description available.'}</p>
      </section>

      <section id="features">
        <h2>Features</h2>
        {/* Chain support, trading pairs, etc. */}
      </section>

      <section id="fees">
        <h2>Fees</h2>
        {/* Fee structure if available */}
      </section>

      <section id="security">
        <h2>Security</h2>
        {/* Audit info, smart contract links */}
      </section>

      <section id="pros-cons">
        <h2>Pros & Cons</h2>
        {/* Generated from score breakdown */}
      </section>

      <section id="verdict">
        <h2>Verdict</h2>
        {/* Summary based on DexRank score */}
      </section>
    </article>
  );
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Table v7 | TanStack Table v8 | 2022 | Headless, smaller bundle, better types |
| useState + useEffect for URL | nuqs | 2023-2024 | Type-safe, batched updates, framework support |
| Fixed debounce timers | useDeferredValue | React 18 (2022) | Adaptive, no artificial delays |
| getStaticPaths | generateStaticParams | Next.js 13 (2022) | App Router native, simpler API |
| Client-side global state | URL params + Server Components | Next.js 13+ | Better SSR, shareability, SEO |

**Deprecated/outdated:**
- **react-table v7:** Replace with @tanstack/react-table v8
- **next-usequerystate:** Renamed to nuqs (same maintainer)
- **Custom debounce hooks for search:** Use useDeferredValue instead

---

## Ranking Algorithm Deep-Dive

**Research Date:** 2026-01-18
**Confidence:** MEDIUM-HIGH (verified with multiple industry sources)

### Normalization Techniques Comparison

| Technique | Best For | Pros | Cons | DexRank Recommendation |
|-----------|----------|------|------|------------------------|
| **Percentile Rank** | High-variance data (TVL) | Eliminates outliers automatically, intuitive interpretation | Loses magnitude information | **USE for TVL, Volume** |
| **Min-Max** | Bounded data | Simple, preserves relative distances | Sensitive to outliers, shifts when new data added | Avoid for financial metrics |
| **Z-Score** | Normally distributed data | Good for mixed-scale data | Less intuitive, can produce negative values | Consider for growth rates |
| **Log Transform** | Exponential distributions | Compresses extreme values | Zero/negative values problematic | Pre-process before percentile |
| **Rank Transform** | Any distribution | Most robust to outliers | Only preserves order, not magnitude | Alternative to percentile |

**Source:** [COINr Normalisation Guide](https://bluefoxr.github.io/COINrDoc/normalisation.html), [OpenSearch Rank Normalization](https://opensearch.org/blog/How-does-the-rank-normalization-work-in-hybrid-search/)

### Industry Weight Distribution Analysis

#### DefiLlama Approach
- **Does NOT use weighted composite scores** - pure TVL ranking
- Protocols ranked by single metric (Total Value Locked)
- No multi-factor weighting system
- Source: [DefiLlama Methodology](https://docs.llama.fi/)

#### CoinGecko Trust Score (Exchanges)
Weighted 0-10 scale with these components:
| Component | Weight | What It Measures |
|-----------|--------|------------------|
| Liquidity | 4/10 (40%) | Order book depth, spread, trading activity |
| Cybersecurity | 2/10 (20%) | Hacken security audit score |
| Scale | 1/10 (10%) | Volume and order book depth analysis |
| Past Incidents | 1/10 (10%) | Regulatory issues, hacks, disputes |
| Proof of Assets | 1/10 (10%) | Reserve disclosure, audits |
| Team Presence | 1/10 (10%) | Operational transparency |

**Key insight:** CoinGecko does NOT apply Trust Score to DEXs - "For decentralized exchanges, there's no Trust Score; instead, rankings rely on trading volume."
Source: [CoinGecko Trust Score Methodology](https://support.coingecko.com/hc/en-us/articles/36442561461657-Trust-Score-Methodology)

#### ConsenSys DeFi Score
| Category | Weight | Sub-components |
|----------|--------|----------------|
| Smart Contract Security | 45% | Time on mainnet, audits, bug bounty, vulnerabilities |
| Financial Risk (Collateral) | 20% | CVaR model, utilization rates |
| Financial Risk (Liquidity) | 10% | Available liquidity |
| Centralization (Admin) | 12.5% | Timelocks, multi-sig controls |
| Centralization (Oracles) | 12.5% | Oracle decentralization |

**Normalization used:** Min-max for Utilization Index and Liquidity Index
Source: [ConsenSys DeFi Score GitHub](https://github.com/Consensys/defi-score)

### Recommended DexRank Weight Distribution

Based on industry analysis and available data:

```typescript
// Phase 1 Weights (TVL + Volume only - what we have)
export const PHASE1_WEIGHTS = {
  tvl: 0.60,           // Primary metric - available
  volume24h: 0.40,     // Secondary metric - partially available
};

// Phase 2 Weights (adding growth metrics)
export const PHASE2_WEIGHTS = {
  tvl: 0.40,           // Still important but reduced
  volume24h: 0.25,     // Trading activity
  tvlGrowth7d: 0.20,   // Growth trajectory (calculate from historical)
  volumeGrowth7d: 0.15,// Volume momentum
};

// Future Weights (if trust data becomes available)
export const FUTURE_WEIGHTS = {
  tvl: 0.30,
  volume24h: 0.20,
  growth: 0.20,
  security: 0.15,      // From DeFiSafety if API available
  liquidity: 0.15,     // Derived from TVL/volume ratio
};
```

**Rationale:**
1. TVL is the most reliable metric we have (100% coverage)
2. Volume is important but only ~3% of protocols have it
3. Growth can be derived from historical TVL (we store daily snapshots)
4. Security/trust requires external data sources (see Trust Score section)

### Missing Data Strategy

**Current state:** 97% of protocols have null volume data.

| Strategy | When to Use | Implementation |
|----------|-------------|----------------|
| **Neutral Score (50)** | Metric unavailable, shouldn't penalize | `normalizedValue = metricAvailable ? percentile : 50` |
| **Zero Score (0)** | Missing = bad signal (e.g., no audit) | `normalizedValue = metricAvailable ? percentile : 0` |
| **Exclude from calculation** | Too much missing data | Redistribute weights to available metrics |
| **Cross-sectional mean** | Sparse but pattern exists | `value = mean(availableValues)` |

**DexRank recommendation:** Use **weight redistribution** for Phase 1:

```typescript
export function calculateScore(
  protocol: Protocol,
  allProtocols: Protocol[]
): number {
  const metrics = {
    tvl: { value: protocol.tvl, weight: 0.60, available: protocol.tvl !== null },
    volume: { value: protocol.volume24h, weight: 0.40, available: protocol.volume24h !== null },
  };

  // Redistribute weights to available metrics
  const availableMetrics = Object.values(metrics).filter(m => m.available);
  const totalAvailableWeight = availableMetrics.reduce((sum, m) => sum + m.weight, 0);

  let score = 0;
  for (const metric of availableMetrics) {
    const normalizedWeight = metric.weight / totalAvailableWeight;
    const percentile = calculatePercentile(metric.value, allProtocols, metric.key);
    score += percentile * normalizedWeight;
  }

  return score;
}
```

**Research finding:** Financial research shows cross-sectional mean imputation performs well for predictor data because "missingness tends to occur in blocks organized by the underlying data source." Our volume data fits this pattern.
Source: [Missing Values in Machine Learning Portfolios](https://www.sciencedirect.com/science/article/abs/pii/S0304405X24000382)

### Composite Score Formula

**Recommended approach:** Weighted Additive (not multiplicative)

| Approach | Formula | Use When |
|----------|---------|----------|
| **Additive (WSM)** | `score = sum(weight_i * normalized_i)` | Metrics can compensate each other |
| **Multiplicative (WPM)** | `score = product(normalized_i ^ weight_i)` | All metrics must be good |

**Why additive for DexRank:**
1. A DEX with high TVL but lower volume is still valuable
2. Multiplicative would unfairly penalize protocols missing metrics
3. Industry standard (CoinGecko, ConsenSys use additive)

Source: [Add or Multiply? Tutorial on Multi-Criteria Ranking](https://pubsonline.informs.org/doi/pdf/10.1287/ited.2013.0124)

```typescript
// Final formula for DexRank Score
export function calculateDexRankScore(
  tvlPercentile: number,      // 0-100
  volumePercentile: number,   // 0-100 or null
  weights: RankingWeights
): number {
  if (volumePercentile === null) {
    // TVL-only score when volume unavailable
    return tvlPercentile;
  }

  // Weighted additive composite
  const totalWeight = weights.tvl + weights.volume;
  return (
    (tvlPercentile * weights.tvl + volumePercentile * weights.volume) /
    totalWeight
  );
}
```

---

## Trust Score Integration Research

**Research Date:** 2026-01-18
**Confidence:** HIGH (verified with official API documentation)

### Trustpilot API Assessment

#### API Availability: CONFIRMED
Trustpilot has a public API with these relevant endpoints:
- `GET /v1/business-units/find?name={domain}` - Find business by domain
- `GET /v1/business-units/{id}` - Get business details including trust score
- `GET /v1/business-units/{id}/reviews` - Get reviews (up to 100,000)

**Authentication:** API Key only (no OAuth required for public endpoints)
**Rate Limits:** Not publicly documented, "rate limiting best practices" guide exists

Source: [Trustpilot Developers](https://developers.trustpilot.com/), [Business Units API (Public)](https://developers.trustpilot.com/business-units-api-(public)/)

#### Pricing: PROBLEMATIC
- **Free plan:** Basic review collection only, NO API access
- **Paid plans start at $259/month** (Plus tier)
- **API access is an add-on** to paid plans, additional cost
- **Annual commitment required** - no month-to-month
- **Per-domain pricing** - each website needs separate plan

Source: [Trustpilot Pricing](https://business.trustpilot.com/pricing), [Trustpilot Pricing Analysis](https://wiserreview.com/blog/trustpilot-pricing/)

#### DEX Coverage on Trustpilot: VERIFIED BUT PROBLEMATIC

| DEX | Trustpilot URL | Score | Reviews | Status |
|-----|----------------|-------|---------|--------|
| Uniswap | trustpilot.com/review/app.uniswap.org | 1.1/5 | 883 | Claimed, 97% 1-star |
| PancakeSwap | trustpilot.com/review/pancakeswap.finance | 1.5/5 | 175 | Unclaimed, 77% 1-star |
| dYdX | Not found | N/A | N/A | No page exists |
| GMX | Not found | N/A | N/A | No page exists |

**Critical finding:** DEX Trustpilot reviews are overwhelmingly negative (scam complaints, phishing victims, failed transactions). These scores do NOT reflect actual protocol quality - they reflect user confusion between legitimate DEXs and scam sites impersonating them.

**Recommendation:** DO NOT USE Trustpilot for DEX trust scores. The data is:
1. Incomplete (many DEXs have no page)
2. Misleading (scam victims rate legitimate sites)
3. Expensive to access via API
4. Not claimed/managed by actual protocols

### Alternative Trust/Reputation Sources

#### DeFiSafety - RECOMMENDED
- **Coverage:** 340+ protocols across 24 blockchains
- **Score format:** 0-100% based on code quality, documentation, testing, security, admin controls
- **API availability:** NO public API - requires sign-in, custom research reports available
- **Data access:** Would require scraping or partnership arrangement
- **Quality:** High - independent security-focused reviews

Source: [DeFiSafety](https://www.defisafety.com/)

#### CoinGecko Trust Score - NOT APPLICABLE
- Only applies to centralized exchanges, NOT DEXs
- DEXs ranked by volume only on CoinGecko

Source: [CoinGecko Trust Score](https://support.coingecko.com/hc/en-us/sections/8168778514713-Trust-Score)

#### Crypto Sentiment APIs

| Provider | What It Offers | Pricing | DexRank Fit |
|----------|----------------|---------|-------------|
| Santiment | Social + on-chain analytics | Paid tiers | MEDIUM - more for trading signals |
| StockGeist | Real-time social sentiment | REST API available | LOW - 400 coins only |
| Token Metrics | AI-driven ratings | Paid | LOW - token focus, not protocols |
| BittsAnalytics | Social sentiment indices | API available | LOW - token focus |

Source: [Top Crypto APIs 2025](https://www.tokenmetrics.com/blog/top-5-cryptocurrency-apis-2025)

#### On-Chain Metrics as Trust Proxy

Since external trust APIs are either unavailable or inappropriate for DEXs, consider deriving trust signals from on-chain/available data:

| Proxy Metric | What It Indicates | How to Calculate |
|--------------|-------------------|------------------|
| **Protocol Age** | Battle-tested, survived market cycles | `daysSince(launchDate)` |
| **TVL Stability** | Not a rug-pull risk | `stddev(tvl_30d) / mean(tvl_30d)` |
| **Chain Count** | Ecosystem trust (multiple chain deployments) | `count(chains)` |
| **Volume/TVL Ratio** | Actual usage vs locked value | `volume24h / tvl` |

### Recommended Trust Score Approach for DexRank

**Phase 1 (MVP):** Do not include explicit trust score
- Focus on TVL and Volume ranking
- These metrics implicitly capture some trust (users don't lock funds in untrusted protocols)

**Phase 2 (Enhancement):** Derived trust proxy
```typescript
export function calculateTrustProxy(protocol: Protocol): number {
  const scores = {
    // Age score: 0-30 points (max at 2+ years)
    age: Math.min(30, protocol.ageInDays / 730 * 30),

    // TVL stability: 0-30 points (lower volatility = higher score)
    stability: Math.max(0, 30 - (protocol.tvlVolatility30d * 100)),

    // Multi-chain: 0-20 points (1 chain = 5, 4+ chains = 20)
    multiChain: Math.min(20, protocol.chainCount * 5),

    // Has volume data: 0-20 points (indicates real trading activity)
    hasVolume: protocol.volume24h !== null ? 20 : 0,
  };

  return scores.age + scores.stability + scores.multiChain + scores.hasVolume;
}
```

**Phase 3 (Future):** External data integration
- Partner with DeFiSafety for security scores (requires business relationship)
- Integrate audit data if available from DefiLlama or other sources
- Consider L2Beat for Ethereum L2 risk assessments

---

## Open Questions

Things that couldn't be fully resolved:

1. **Security/Trust Metric Data Source**
   - What we know: RANK-01 mentions "security" and "trust" as scoring components
   - What's unclear: No security audit data exists in current schema; DefiLlama doesn't provide this
   - Recommendation: Use derived trust proxy (age, stability, chain count) for Phase 1; explore DeFiSafety partnership for Phase 2

2. **User Growth Metric**
   - What we know: RANK-01 mentions "user growth" as a component
   - What's unclear: DefiLlama doesn't provide user/wallet count data
   - Recommendation: Either (a) integrate with DappRadar API for UAW data, (b) use volume growth as proxy, or (c) mark as "coming soon"

3. **Review Page Static Content**
   - What we know: REVIEW-03 requires templated structure with overview, features, fees, security, pros/cons, verdict
   - What's unclear: How much content is dynamic vs manually written?
   - Recommendation: Start with 100% dynamic (generated from metrics/scores), plan for CMS integration later

4. **Trustpilot API Access Without Business Account**
   - What we know: Public API endpoints exist, require API key
   - What's unclear: Can API key be obtained without paid business account?
   - Recommendation: Do not pursue Trustpilot - DEX data quality is poor regardless of API access

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Data Table](https://ui.shadcn.com/docs/components/data-table) - Complete table implementation guide
- [nuqs Documentation](https://nuqs.dev) - URL state management API
- [Next.js ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration) - generateStaticParams patterns
- [React useDeferredValue](https://react.dev/reference/react/useDeferredValue) - Search optimization
- [Trustpilot Developers Portal](https://developers.trustpilot.com/) - API documentation
- [Trustpilot Business Units API](https://developers.trustpilot.com/business-units-api-(public)/) - Public endpoints
- [CoinGecko Trust Score Methodology](https://support.coingecko.com/hc/en-us/articles/36442561461657-Trust-Score-Methodology) - Weight distribution
- [ConsenSys DeFi Score](https://github.com/Consensys/defi-score) - Scoring framework

### Secondary (MEDIUM confidence)
- [Placeholder VC Combined Metrics](https://www.placeholder.vc/blog/2025/4/16/combined-metrics-for-tracking-smart-contract-networks) - Market share normalization methodology
- [TanStack Table Responsive Discussion](https://github.com/TanStack/table/discussions/3259) - Mobile column collapse patterns
- [nuqs React Advanced 2025](https://www.infoq.com/news/2025/12/nuqs-react-advanced/) - Production validation (Vercel, Supabase, Sentry)
- [DefiLlama Methodology](https://docs.llama.fi/) - TVL ranking approach
- [DeFiSafety](https://www.defisafety.com/) - Protocol security reviews
- [COINr Normalisation Guide](https://bluefoxr.github.io/COINrDoc/normalisation.html) - Composite indicator methods
- [Add or Multiply Tutorial](https://pubsonline.informs.org/doi/pdf/10.1287/ited.2013.0124) - Multi-criteria ranking

### Tertiary (LOW confidence - patterns only)
- [DEX Review Templates](https://cryptonews.com/reviews/hyperliquid-dex-review/) - Section structure examples
- [Feature Scaling Wikipedia](https://en.wikipedia.org/wiki/Feature_scaling) - Normalization theory
- [Trustpilot Uniswap Reviews](https://www.trustpilot.com/review/app.uniswap.org) - DEX coverage verification
- [Trustpilot PancakeSwap Reviews](https://www.trustpilot.com/review/pancakeswap.finance) - DEX coverage verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - TanStack Table + shadcn/ui verified in official docs
- URL state (nuqs): HIGH - Production validated, official Next.js support
- Ranking algorithm: MEDIUM-HIGH - Based on CoinGecko, ConsenSys, academic research
- Normalization: HIGH - COINr guide + OpenSearch documentation
- Missing data handling: MEDIUM - Financial research papers, pattern fits our data
- Trustpilot API: HIGH - Verified in official docs, DEX coverage verified manually
- Trust alternatives: MEDIUM - DeFiSafety exists but no public API confirmed
- Review structure: MEDIUM - Based on competitor analysis, not spec-defined

**Research date:** 2026-01-18
**Valid until:** 2026-02-18 (30 days - stable ecosystem)
