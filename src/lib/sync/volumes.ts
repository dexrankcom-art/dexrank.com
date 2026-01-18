import { db } from '@/db';
import { protocols, protocolMetrics } from '@/db/schema';
import { fetchDexVolumes } from '@/lib/defillama/client';
import { eq, desc } from 'drizzle-orm';

export async function syncVolumes(): Promise<{ count: number }> {
  const volumeData = await fetchDexVolumes();

  console.log(`Syncing volumes for ${volumeData.protocols.length} DEXs...`);

  // Get all protocols from DB
  const dbProtocols = await db.select().from(protocols);
  const protocolByName = new Map(dbProtocols.map((p) => [p.name.toLowerCase(), p]));

  let updated = 0;

  for (const dex of volumeData.protocols) {
    // Match by name (case-insensitive)
    const protocol = protocolByName.get(dex.name.toLowerCase())
      ?? protocolByName.get(dex.displayName?.toLowerCase() ?? '');

    if (!protocol) {
      // Protocol not in our DB (might not be DEX category)
      continue;
    }

    // Find the most recent metrics record for this protocol
    const latestMetrics = await db
      .select()
      .from(protocolMetrics)
      .where(eq(protocolMetrics.protocolId, protocol.id))
      .orderBy(desc(protocolMetrics.fetchedAt))
      .limit(1);

    if (latestMetrics.length > 0) {
      // Update the latest record with volume data
      await db
        .update(protocolMetrics)
        .set({
          volume24h: dex.total24h ?? null,
          volume7d: dex.total7d ?? null,
          volume30d: dex.total30d ?? null,
          volumeChange1d: dex.change_1d ?? null,
          volumeChange7d: dex.change_7d ?? null,
          updatedAt: new Date(),
        })
        .where(eq(protocolMetrics.id, latestMetrics[0].id));

      updated++;
    }
  }

  return { count: updated };
}
