import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { db } from '@/db';
import { protocols, protocolMetrics } from '@/db/schema';
import { eq, sql, desc, ilike, or } from 'drizzle-orm';

export interface CategoryMeta {
  slug: string;
  name: string;
  pluralName: string;
  description: string;
  dbCategories: string[]; // Categories from DefiLlama to match
}

// Map our 7 category types to database category values
export const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  {
    slug: 'spot-dex',
    name: 'Spot DEX',
    pluralName: 'Spot DEXs',
    description: 'Decentralized exchanges for spot trading via automated market makers.',
    dbCategories: ['Dexes'],
  },
  {
    slug: 'perpetual-dex',
    name: 'Perpetual DEX',
    pluralName: 'Perpetual DEXs',
    description: 'Decentralized derivatives exchanges for perpetual futures trading.',
    dbCategories: ['Derivatives'],
  },
  {
    slug: 'dex-aggregators',
    name: 'DEX Aggregator',
    pluralName: 'DEX Aggregators',
    description: 'Protocols that route trades through multiple DEXs for best execution.',
    dbCategories: ['Dexes'], // Will filter by name patterns
  },
  {
    slug: 'cross-chain-dex',
    name: 'Cross-chain DEX',
    pluralName: 'Cross-chain DEXs',
    description: 'Protocols enabling swaps across different blockchains.',
    dbCategories: ['Bridge', 'Cross Chain'],
  },
  {
    slug: 'options-dex',
    name: 'Options DEX',
    pluralName: 'Options DEXs',
    description: 'Decentralized exchanges for options trading.',
    dbCategories: ['Options', 'Options Vault'],
  },
  {
    slug: 'prediction-markets',
    name: 'Prediction Market',
    pluralName: 'Prediction Markets',
    description: 'Protocols for betting on real-world event outcomes.',
    dbCategories: ['Prediction Market'],
  },
  {
    slug: 'yield-aggregators',
    name: 'Yield Aggregator',
    pluralName: 'Yield Aggregators',
    description: 'Protocols that auto-compound yields across DeFi.',
    dbCategories: ['Yield Aggregator', 'Yield'],
  },
];

// Known aggregator names for filtering (since they share "Dexes" category)
const KNOWN_AGGREGATORS = ['1inch', 'Jupiter', 'ParaSwap', 'CoW', 'OpenOcean', 'KyberSwap', 'Matcha', '0x'];

export function getAllCategorySlugs(): string[] {
  return CATEGORY_DEFINITIONS.map((c) => c.slug);
}

export function getCategoryBySlug(slug: string): CategoryMeta | null {
  return CATEGORY_DEFINITIONS.find((c) => c.slug === slug) || null;
}

interface CategoryFrontmatter {
  title: string;
  description: string;
  intro?: string;
}

export async function getCategoryContent(slug: string): Promise<{ intro: string } | null> {
  const filePath = path.join(process.cwd(), 'content/categories', `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const source = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(source);
    const frontmatter = data as CategoryFrontmatter;

    return {
      intro: frontmatter.intro || frontmatter.description || '',
    };
  } catch {
    return null;
  }
}

export async function getProtocolsByCategory(
  categorySlug: string,
  limit: number = 100
): Promise<{
  protocols: Array<{
    id: number;
    slug: string;
    name: string;
    logo: string | null;
    category: string | null;
    tvl: number | null;
    volume24h: number | null;
  }>;
  totalCount: number;
}> {
  const categoryMeta = getCategoryBySlug(categorySlug);
  if (!categoryMeta) {
    return { protocols: [], totalCount: 0 };
  }

  // Subquery for latest metrics
  const latestMetricsSubquery = db
    .select({
      protocolId: protocolMetrics.protocolId,
      tvl: protocolMetrics.tvl,
      volume24h: protocolMetrics.volume24h,
    })
    .from(protocolMetrics)
    .where(
      sql`${protocolMetrics.id} IN (
        SELECT MAX(id) FROM protocol_metrics GROUP BY protocol_id
      )`
    )
    .as('latest_metrics');

  // Build category conditions
  const categoryConditions = categoryMeta.dbCategories.map((cat) =>
    ilike(protocols.category, `%${cat}%`)
  );

  // Special handling for aggregators - they share "Dexes" category
  // but we identify them by name patterns
  let nameFilter = null;
  if (categorySlug === 'dex-aggregators') {
    const aggregatorPatterns = KNOWN_AGGREGATORS.map((name) =>
      ilike(protocols.name, `%${name}%`)
    );
    nameFilter = or(...aggregatorPatterns);
  }

  const whereClause = nameFilter || or(...categoryConditions);

  const results = await db
    .select({
      id: protocols.id,
      slug: protocols.slug,
      name: protocols.name,
      logo: protocols.logo,
      category: protocols.category,
      tvl: latestMetricsSubquery.tvl,
      volume24h: latestMetricsSubquery.volume24h,
    })
    .from(protocols)
    .leftJoin(latestMetricsSubquery, eq(protocols.id, latestMetricsSubquery.protocolId))
    .where(whereClause)
    .orderBy(desc(latestMetricsSubquery.tvl))
    .limit(limit * 2); // Get extra to filter

  // Post-filter for spot-dex to exclude aggregators
  let filtered = results;
  if (categorySlug === 'spot-dex') {
    filtered = results.filter((p) => {
      const isAggregator = KNOWN_AGGREGATORS.some((agg) =>
        p.name.toLowerCase().includes(agg.toLowerCase())
      );
      return !isAggregator;
    });
  }

  return {
    protocols: filtered.slice(0, limit),
    totalCount: filtered.length,
  };
}
