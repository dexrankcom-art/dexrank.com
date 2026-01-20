import { db } from '@/db';
import { chains, protocolChains, protocols, protocolMetrics } from '@/db/schema';
import { sql, eq, inArray, desc } from 'drizzle-orm';
import type { Chain } from './types';

/**
 * Get all chains with protocol counts
 */
export async function getChains(): Promise<(Chain & { protocolCount: number })[]> {
  const results = await db
    .select({
      id: chains.id,
      slug: chains.slug,
      name: chains.name,
      chainId: chains.chainId,
      logo: chains.logo,
      createdAt: chains.createdAt,
      updatedAt: chains.updatedAt,
      protocolCount: sql<number>`count(${protocolChains.protocolId})::int`.as('protocol_count'),
    })
    .from(chains)
    .leftJoin(protocolChains, eq(chains.id, protocolChains.chainId))
    .groupBy(chains.id)
    .orderBy(sql`protocol_count DESC`);

  return results;
}

/**
 * Get single chain by slug
 */
export async function getChainBySlug(slug: string): Promise<Chain | null> {
  const [chain] = await db
    .select()
    .from(chains)
    .where(eq(chains.slug, slug))
    .limit(1);

  return chain ?? null;
}

/**
 * Get all chain slugs for static generation
 */
export async function getAllChainSlugs(): Promise<string[]> {
  const results = await db
    .select({ slug: chains.slug })
    .from(chains);

  return results.map((r) => r.slug);
}

/**
 * Get protocols for a specific chain with ranking
 * Returns protocols sorted by TVL descending
 */
export async function getProtocolsByChain(
  chainSlug: string,
  limit: number = 50
): Promise<{
  protocols: Array<{
    id: number;
    slug: string;
    name: string;
    logo: string | null;
    category: string | null;
    tvl: number | null;
    volume24h: number | null;
    tvlChange1d: number | null;
  }>;
  totalCount: number;
}> {
  // Get chain
  const chain = await getChainBySlug(chainSlug);
  if (!chain) {
    return { protocols: [], totalCount: 0 };
  }

  // Get protocol IDs for this chain
  const protocolChainRecords = await db
    .select({ protocolId: protocolChains.protocolId })
    .from(protocolChains)
    .where(eq(protocolChains.chainId, chain.id));

  const protocolIds = protocolChainRecords.map((pc) => pc.protocolId);

  if (protocolIds.length === 0) {
    return { protocols: [], totalCount: 0 };
  }

  // Subquery for latest metrics
  const latestMetricsSubquery = db
    .select({
      protocolId: protocolMetrics.protocolId,
      tvl: protocolMetrics.tvl,
      volume24h: protocolMetrics.volume24h,
      tvlChange1d: protocolMetrics.tvlChange1d,
    })
    .from(protocolMetrics)
    .where(
      sql`${protocolMetrics.id} IN (
        SELECT MAX(id) FROM protocol_metrics GROUP BY protocol_id
      )`
    )
    .as('latest_metrics');

  // Get protocols with metrics
  const results = await db
    .select({
      id: protocols.id,
      slug: protocols.slug,
      name: protocols.name,
      logo: protocols.logo,
      category: protocols.category,
      tvl: latestMetricsSubquery.tvl,
      volume24h: latestMetricsSubquery.volume24h,
      tvlChange1d: latestMetricsSubquery.tvlChange1d,
    })
    .from(protocols)
    .leftJoin(latestMetricsSubquery, eq(protocols.id, latestMetricsSubquery.protocolId))
    .where(inArray(protocols.id, protocolIds))
    .orderBy(desc(latestMetricsSubquery.tvl))
    .limit(limit);

  return {
    protocols: results,
    totalCount: protocolIds.length,
  };
}
