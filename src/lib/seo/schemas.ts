import type { Review, SoftwareApplication, ItemList, WithContext, Article, FAQPage, WebPage } from 'schema-dts';

interface ProtocolForSchema {
  name: string;
  logo: string | null;
  url: string | null;
  description?: string | null;
}

export function generateReviewSchema(
  protocol: ProtocolForSchema,
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
      description: protocol.description || undefined,
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
    description: `Side-by-side comparison of ${dex1.name} and ${dex2.name} decentralized exchanges.`,
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
  guide: { title: string; description: string; publishedAt: string; updatedAt?: string; slug: string }
): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    url: `https://dexrank.com/guides/${guide.slug}`,
    author: {
      '@type': 'Organization',
      name: 'DexRank',
      url: 'https://dexrank.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DexRank',
      url: 'https://dexrank.com',
    },
  };
}

export function generateChainSchema(
  chain: { name: string; slug: string; logo: string | null },
  protocolCount: number
): WithContext<WebPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Best DEXs on ${chain.name}`,
    description: `Top ${protocolCount} decentralized exchanges on ${chain.name}. Compare TVL, volume, and DexRank scores.`,
    url: `https://dexrank.com/chains/${chain.slug}`,
  };
}

export function generateCategorySchema(
  category: { name: string; slug: string; description: string },
  protocolCount: number
): WithContext<ItemList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Best ${category.name}`,
    description: category.description,
    url: `https://dexrank.com/categories/${category.slug}`,
    numberOfItems: protocolCount,
  };
}
