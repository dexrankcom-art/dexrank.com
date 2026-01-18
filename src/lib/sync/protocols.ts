import { db } from '@/db';
import { protocols, chains, protocolChains, protocolMetrics } from '@/db/schema';
import { fetchProtocols } from '@/lib/defillama/client';
import { sql, inArray } from 'drizzle-orm';

// Filter for DEX-related categories
const DEX_CATEGORIES = [
  'Dexes',
  'Derivatives',
  'Liquid Staking',
  'CDP',
  'Lending',
  'DEX Aggregator',
];

export async function syncProtocols(): Promise<{ count: number }> {
  const allProtocols = await fetchProtocols();

  // Filter to DEX-related protocols only (reduces from ~7000 to ~200-300)
  const dexProtocols = allProtocols.filter(
    (p) => p.category && DEX_CATEGORIES.includes(p.category)
  );

  console.log(`Syncing ${dexProtocols.length} DEX protocols...`);

  // 1. Collect all unique chains
  const allChains = new Set<string>();
  for (const protocol of dexProtocols) {
    protocol.chains.forEach((c) => allChains.add(c));
  }

  // 2. Upsert chains
  const chainValues = Array.from(allChains).map((name) => ({
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    name,
  }));

  if (chainValues.length > 0) {
    await db
      .insert(chains)
      .values(chainValues)
      .onConflictDoUpdate({
        target: chains.slug,
        set: { name: sql`excluded.name`, updatedAt: new Date() },
      });
  }

  // 3. Get chain ID lookup
  const chainRecords = await db.select().from(chains);
  const chainIdByName = new Map(chainRecords.map((c) => [c.name, c.id]));

  // 4. Upsert protocols
  const protocolValues = dexProtocols.map((p) => ({
    defillamaId: p.id,
    slug: p.slug,
    name: p.name,
    symbol: p.symbol ?? null,
    category: p.category ?? null,
    logo: p.logo ?? null,
    url: p.url ?? null,
  }));

  // Batch upsert in chunks of 100 to avoid query size limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < protocolValues.length; i += BATCH_SIZE) {
    const batch = protocolValues.slice(i, i + BATCH_SIZE);
    await db
      .insert(protocols)
      .values(batch)
      .onConflictDoUpdate({
        target: protocols.defillamaId,
        set: {
          slug: sql`excluded.slug`,
          name: sql`excluded.name`,
          symbol: sql`excluded.symbol`,
          category: sql`excluded.category`,
          logo: sql`excluded.logo`,
          url: sql`excluded.url`,
          updatedAt: new Date(),
        },
      });
  }

  // 5. Get protocol ID lookup
  const protocolRecords = await db.select().from(protocols);
  const protocolIdByDefillamaId = new Map(protocolRecords.map((p) => [p.defillamaId, p.id]));

  // 6. Upsert protocol-chain relationships
  const protocolChainValues: { protocolId: number; chainId: number }[] = [];
  for (const protocol of dexProtocols) {
    const protocolId = protocolIdByDefillamaId.get(protocol.id);
    if (!protocolId) continue;

    for (const chainName of protocol.chains) {
      const chainId = chainIdByName.get(chainName);
      if (chainId) {
        protocolChainValues.push({ protocolId, chainId });
      }
    }
  }

  // Delete existing protocol-chain mappings for these protocols and re-insert
  const protocolIds = [...new Set(protocolChainValues.map((pc) => pc.protocolId))];
  if (protocolIds.length > 0) {
    await db.delete(protocolChains).where(inArray(protocolChains.protocolId, protocolIds));

    // Batch insert
    for (let i = 0; i < protocolChainValues.length; i += BATCH_SIZE) {
      const batch = protocolChainValues.slice(i, i + BATCH_SIZE);
      await db.insert(protocolChains).values(batch);
    }
  }

  // 7. Upsert protocol metrics (TVL)
  const metricsValues = dexProtocols.map((p) => {
    const protocolId = protocolIdByDefillamaId.get(p.id);
    return {
      protocolId: protocolId!,
      tvl: p.tvl,
      tvlChange1h: p.change_1h ?? null,
      tvlChange1d: p.change_1d ?? null,
      tvlChange7d: p.change_7d ?? null,
      chainTvls: p.chainTvls ?? null,
      fetchedAt: new Date(),
    };
  }).filter((m) => m.protocolId != null);

  // Insert new metrics (we keep history, not upsert)
  for (let i = 0; i < metricsValues.length; i += BATCH_SIZE) {
    const batch = metricsValues.slice(i, i + BATCH_SIZE);
    await db.insert(protocolMetrics).values(batch);
  }

  return { count: dexProtocols.length };
}
