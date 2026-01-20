import type { MetadataRoute } from 'next';
import { getAllProtocolSlugs } from '@/lib/data/protocols';
import { getChains } from '@/lib/data/chains';
import { getAllGuides } from '@/lib/content/guides';
import { CATEGORY_DEFINITIONS } from '@/lib/data/categories';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://dexrank.com';

// ISR: regenerate sitemap every hour
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/how-we-rank`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // DEX review pages (~500+ pages)
  const protocolSlugs = await getAllProtocolSlugs();
  const dexPages: MetadataRoute.Sitemap = protocolSlugs.map((slug) => ({
    url: `${BASE_URL}/reviews/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Chain pages (~259 pages)
  const chains = await getChains();
  const chainPages: MetadataRoute.Sitemap = chains.map((chain) => ({
    url: `${BASE_URL}/chains/${chain.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Category pages (7 pages)
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_DEFINITIONS.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }));

  // Guide pages (~16 pages)
  const guides = await getAllGuides();
  const guidePages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...dexPages,
    ...chainPages,
    ...categoryPages,
    ...guidePages,
  ];
}
