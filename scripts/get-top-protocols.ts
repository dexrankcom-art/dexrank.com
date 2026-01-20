import { db } from '../src/db';
import { protocols, protocolMetrics } from '../src/db/schema';
import { desc, sql } from 'drizzle-orm';

async function main() {
  const results = await db
    .select({
      slug: protocols.slug,
      name: protocols.name,
      category: protocols.category,
      tvl: sql<number>`(SELECT tvl FROM protocol_metrics WHERE protocol_id = protocols.id ORDER BY fetched_at DESC LIMIT 1)`,
      volume: sql<number>`(SELECT volume_24h FROM protocol_metrics WHERE protocol_id = protocols.id ORDER BY fetched_at DESC LIMIT 1)`,
    })
    .from(protocols)
    .orderBy(desc(sql`(SELECT tvl FROM protocol_metrics WHERE protocol_id = protocols.id ORDER BY fetched_at DESC LIMIT 1)`))
    .limit(60);

  console.log('Top 60 protocols by TVL:');
  results.forEach((r, i) => {
    const tvl = r.tvl ? (Number(r.tvl)/1000000).toFixed(1) + 'M' : 'N/A';
    console.log(`${i+1}. ${r.slug} (${r.name}) - ${r.category} - TVL: ${tvl}`);
  });

  process.exit(0);
}

main().catch(console.error);
