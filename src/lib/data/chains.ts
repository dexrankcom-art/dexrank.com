import { db } from '@/db';
import { chains, protocolChains } from '@/db/schema';
import { sql, eq } from 'drizzle-orm';
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
