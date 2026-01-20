import { db } from '@/db';
import {
  protocols,
  chains,
  protocolChains,
  protocolMetrics,
} from '@/db/schema';
import { eq, desc, asc, sql, ilike, and, inArray } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';
import type {
  ProtocolWithMetrics,
  ProtocolListItem,
  ProtocolFilters,
  ProtocolSortField,
  SortOrder,
  RankedProtocol,
  ScoreBreakdown,
} from './types';
import { calculateDexRankScores } from '@/lib/ranking';

/**
 * Get all protocols with latest metrics for listing
 */
export async function getProtocols(
  filters: ProtocolFilters = {},
  sortBy: ProtocolSortField = 'tvl',
  sortOrder: SortOrder = 'desc'
): Promise<ProtocolListItem[]> {
  const { chain, category, search, limit = 100, offset = 0 } = filters;

  // Build WHERE conditions
  const conditions: ReturnType<typeof eq>[] = [];

  if (category) {
    conditions.push(eq(protocols.category, category));
  }

  if (search) {
    conditions.push(ilike(protocols.name, `%${search}%`));
  }

  // If chain filter, get protocol IDs that have this chain
  let protocolIdsWithChain: number[] | null = null;
  if (chain) {
    const chainRecord = await db
      .select()
      .from(chains)
      .where(eq(chains.slug, chain.toLowerCase()))
      .limit(1);

    if (chainRecord.length > 0) {
      const protocolChainRecords = await db
        .select({ protocolId: protocolChains.protocolId })
        .from(protocolChains)
        .where(eq(protocolChains.chainId, chainRecord[0].id));

      protocolIdsWithChain = protocolChainRecords.map((pc) => pc.protocolId);
    } else {
      return []; // Chain not found
    }
  }

  if (protocolIdsWithChain && protocolIdsWithChain.length > 0) {
    conditions.push(inArray(protocols.id, protocolIdsWithChain));
  } else if (protocolIdsWithChain !== null) {
    return []; // Chain filter specified but no matching protocols
  }

  // Subquery for latest metrics per protocol
  const latestMetricsSubquery = db
    .select({
      protocolId: protocolMetrics.protocolId,
      tvl: protocolMetrics.tvl,
      tvlChange24h: protocolMetrics.tvlChange1d,
      volume24h: protocolMetrics.volume24h,
      volumeChange24h: protocolMetrics.volumeChange1d,
    })
    .from(protocolMetrics)
    .where(
      sql`${protocolMetrics.id} IN (
        SELECT MAX(id) FROM protocol_metrics GROUP BY protocol_id
      )`
    )
    .as('latest_metrics');

  // Determine sort column
  const getSortColumn = () => {
    switch (sortBy) {
      case 'name':
        return protocols.name;
      case 'tvl':
        return latestMetricsSubquery.tvl;
      case 'volume24h':
        return latestMetricsSubquery.volume24h;
      case 'tvlChange24h':
        return latestMetricsSubquery.tvlChange24h;
      default:
        return latestMetricsSubquery.tvl;
    }
  };

  const sortColumn = getSortColumn();

  // Main query
  const results = await db
    .select({
      id: protocols.id,
      slug: protocols.slug,
      name: protocols.name,
      logo: protocols.logo,
      category: protocols.category,
      tvl: latestMetricsSubquery.tvl,
      tvlChange24h: latestMetricsSubquery.tvlChange24h,
      volume24h: latestMetricsSubquery.volume24h,
      volumeChange24h: latestMetricsSubquery.volumeChange24h,
    })
    .from(protocols)
    .leftJoin(latestMetricsSubquery, eq(protocols.id, latestMetricsSubquery.protocolId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(sortOrder === 'desc' ? desc(sortColumn) : asc(sortColumn))
    .limit(limit)
    .offset(offset);

  // Get chains for each protocol
  const protocolIds = results.map((r) => r.id);

  let chainMappings: { protocolId: number; chainName: string }[] = [];
  if (protocolIds.length > 0) {
    chainMappings = await db
      .select({
        protocolId: protocolChains.protocolId,
        chainName: chains.name,
      })
      .from(protocolChains)
      .innerJoin(chains, eq(protocolChains.chainId, chains.id))
      .where(inArray(protocolChains.protocolId, protocolIds));
  }

  const chainsByProtocol = new Map<number, string[]>();
  for (const mapping of chainMappings) {
    const existing = chainsByProtocol.get(mapping.protocolId) ?? [];
    existing.push(mapping.chainName);
    chainsByProtocol.set(mapping.protocolId, existing);
  }

  return results.map((r) => ({
    id: r.id,
    slug: r.slug,
    name: r.name,
    logo: r.logo,
    category: r.category,
    chains: chainsByProtocol.get(r.id) ?? [],
    tvl: r.tvl,
    tvlChange24h: r.tvlChange24h,
    volume24h: r.volume24h,
    volumeChange24h: r.volumeChange24h,
  }));
}

/**
 * Get single protocol by slug with full details
 */
export async function getProtocolBySlug(slug: string): Promise<ProtocolWithMetrics | null> {
  const [protocol] = await db
    .select()
    .from(protocols)
    .where(eq(protocols.slug, slug))
    .limit(1);

  if (!protocol) return null;

  // Get chains
  const protocolChainRecords = await db
    .select({ chain: chains })
    .from(protocolChains)
    .innerJoin(chains, eq(protocolChains.chainId, chains.id))
    .where(eq(protocolChains.protocolId, protocol.id));

  // Get latest metrics
  const [latestMetrics] = await db
    .select()
    .from(protocolMetrics)
    .where(eq(protocolMetrics.protocolId, protocol.id))
    .orderBy(desc(protocolMetrics.fetchedAt))
    .limit(1);

  return {
    ...protocol,
    chains: protocolChainRecords.map((pc) => pc.chain),
    latestMetrics: latestMetrics ?? null,
  };
}

/**
 * Get total protocol count (for pagination)
 */
export async function getProtocolCount(filters: ProtocolFilters = {}): Promise<number> {
  const { category, search, chain } = filters;

  const conditions: ReturnType<typeof eq>[] = [];

  if (category) {
    conditions.push(eq(protocols.category, category));
  }

  if (search) {
    conditions.push(ilike(protocols.name, `%${search}%`));
  }

  // If chain filter, get protocol IDs that have this chain
  if (chain) {
    const chainRecord = await db
      .select()
      .from(chains)
      .where(eq(chains.slug, chain.toLowerCase()))
      .limit(1);

    if (chainRecord.length > 0) {
      const protocolChainRecords = await db
        .select({ protocolId: protocolChains.protocolId })
        .from(protocolChains)
        .where(eq(protocolChains.chainId, chainRecord[0].id));

      const protocolIds = protocolChainRecords.map((pc) => pc.protocolId);
      if (protocolIds.length > 0) {
        conditions.push(inArray(protocols.id, protocolIds));
      } else {
        return 0; // Chain has no protocols
      }
    } else {
      return 0; // Chain not found
    }
  }

  const [result] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(protocols)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  return result?.count ?? 0;
}

/**
 * Get unique categories
 */
export async function getCategories(): Promise<string[]> {
  const results = await db
    .selectDistinct({ category: protocols.category })
    .from(protocols)
    .where(sql`${protocols.category} IS NOT NULL`);

  return results.map((r) => r.category!).sort();
}

/**
 * Get unique chain names
 */
export async function getChainNames(): Promise<string[]> {
  const results = await db
    .selectDistinct({ name: chains.name })
    .from(chains)
    .orderBy(chains.name);

  return results.map((r) => r.name);
}

/**
 * Get protocols with DexRank scores calculated
 * Wrapper around getProtocols that adds ranking
 */
export async function getProtocolsWithRanking(
  filters: ProtocolFilters = {},
  sortBy: ProtocolSortField | 'dexRankScore' = 'dexRankScore',
  sortOrder: SortOrder = 'desc'
): Promise<RankedProtocol[]> {
  // Get ALL protocols for ranking context (scores need full dataset)
  // Then filter after ranking
  const allProtocols = await getProtocols(
    { ...filters, limit: 10000, offset: 0 }, // Get all matching filters except pagination
    'tvl', // Default sort, will re-sort by score
    'desc'
  );

  // Calculate scores
  const rankedProtocols = calculateDexRankScores(allProtocols);

  // Apply sort preference
  if (sortBy === 'dexRankScore') {
    // Already sorted by score from calculateDexRankScores
    if (sortOrder === 'asc') {
      rankedProtocols.reverse();
    }
  } else if (sortBy === 'tvl') {
    rankedProtocols.sort((a, b) =>
      sortOrder === 'desc' ? (b.tvl ?? 0) - (a.tvl ?? 0) : (a.tvl ?? 0) - (b.tvl ?? 0)
    );
  } else if (sortBy === 'volume24h') {
    rankedProtocols.sort((a, b) =>
      sortOrder === 'desc' ? (b.volume24h ?? 0) - (a.volume24h ?? 0) : (a.volume24h ?? 0) - (b.volume24h ?? 0)
    );
  } else if (sortBy === 'name') {
    rankedProtocols.sort((a, b) =>
      sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
  }

  // Apply pagination from original filters
  const { limit = 100, offset = 0 } = filters;
  return rankedProtocols.slice(offset, offset + limit);
}

/**
 * Get all protocol slugs for static generation
 * Cached during build to avoid redundant queries
 */
export const getAllProtocolSlugs = unstable_cache(
  async (): Promise<string[]> => {
    const results = await db
      .select({ slug: protocols.slug })
      .from(protocols);

    return results.map((r) => r.slug);
  },
  ['all-protocol-slugs'],
  { revalidate: 3600 } // 1 hour cache
);

/**
 * Get all protocols with ranking data - CACHED
 * This is the expensive operation that fetches all protocols for ranking calculation.
 * Cached during build so all 1600+ review pages share the same data.
 */
const getAllRankedProtocolsCached = unstable_cache(
  async (): Promise<RankedProtocol[]> => {
    const allProtocols = await getProtocols({ limit: 10000 }, 'tvl', 'desc');
    return calculateDexRankScores(allProtocols);
  },
  ['all-ranked-protocols'],
  { revalidate: 3600 } // 1 hour cache - matches ISR revalidation
);

/**
 * Get single protocol with ranking score
 * Calculates ranking in context of all protocols for accurate percentile.
 * Uses cached ranking data to avoid fetching all protocols for every page.
 */
export async function getProtocolBySlugWithRanking(
  slug: string
): Promise<(ProtocolWithMetrics & { scoreBreakdown: ScoreBreakdown; rank: number; totalProtocols: number }) | null> {
  // Get the protocol
  const protocol = await getProtocolBySlug(slug);
  if (!protocol) return null;

  // Get cached ranked protocols (this is the key optimization!)
  // During build, this single DB query result is reused across all 1600+ pages
  const rankedProtocols = await getAllRankedProtocolsCached();

  // Find this protocol in ranked list
  const rankedProtocol = rankedProtocols.find((p) => p.slug === slug);

  if (!rankedProtocol) {
    // Protocol exists but wasn't in the list (shouldn't happen)
    // Return with default score
    return {
      ...protocol,
      scoreBreakdown: {
        overall: 0,
        rank: rankedProtocols.length + 1,
        percentile: 0,
        components: { tvl: 0, volume: null },
        weights: { tvl: 1, volume: 0 },
      },
      rank: rankedProtocols.length + 1,
      totalProtocols: rankedProtocols.length,
    };
  }

  return {
    ...protocol,
    scoreBreakdown: rankedProtocol.scoreBreakdown,
    rank: rankedProtocol.scoreBreakdown.rank,
    totalProtocols: rankedProtocols.length,
  };
}
