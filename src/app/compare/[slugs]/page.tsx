import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getProtocolBySlugWithRanking } from '@/lib/data/protocols';
import { parseComparisonSlug, getCanonicalComparisonSlug } from '@/lib/comparison/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { Breadcrumbs } from '@/components/seo/breadcrumbs';
import { generateComparisonSchema } from '@/lib/seo/schemas';
import { ComparisonHeader } from '@/components/comparison/comparison-header';
import { MetricsComparison } from '@/components/comparison/metrics-comparison';
import { FeatureTable } from '@/components/comparison/feature-table';

export const revalidate = 3600; // 1 hour ISR

// Pre-generate top comparison pairs
export async function generateStaticParams() {
  const topPairs = [
    'pancakeswap-vs-uniswap',
    'sushiswap-vs-uniswap',
    'dydx-vs-hyperliquid',
    'aerodrome-vs-velodrome',
    '1inch-vs-jupiter',
    'curve-finance-vs-uniswap',
    'gmx-vs-hyperliquid',
    'orca-vs-raydium',
    'balancer-vs-uniswap',
    'camelot-vs-uniswap',
  ];
  return topPairs.map((slugs) => ({ slugs }));
}

export const dynamicParams = true; // Allow on-demand generation

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slugs: string }>;
}): Promise<Metadata> {
  const { slugs } = await params;
  const parsed = parseComparisonSlug(slugs);
  if (!parsed) return { title: 'Invalid Comparison - DexRank' };

  const [dex1, dex2] = await Promise.all([
    getProtocolBySlugWithRanking(parsed.dex1),
    getProtocolBySlugWithRanking(parsed.dex2),
  ]);

  if (!dex1 || !dex2) return { title: 'DEX Not Found - DexRank' };

  return {
    title: `${dex1.name} vs ${dex2.name} - DEX Comparison | DexRank`,
    description: `Compare ${dex1.name} and ${dex2.name}: TVL, volume, fees, chains, and DexRank scores. See which DEX is better for your trading needs.`,
    alternates: {
      canonical: `/compare/${slugs}`,
    },
    openGraph: {
      title: `${dex1.name} vs ${dex2.name} Comparison`,
      description: `Side-by-side comparison of ${dex1.name} (score: ${dex1.scoreBreakdown.overall.toFixed(0)}) and ${dex2.name} (score: ${dex2.scoreBreakdown.overall.toFixed(0)}).`,
    },
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slugs: string }>;
}) {
  const { slugs } = await params;

  // Parse the URL
  const parsed = parseComparisonSlug(slugs);
  if (!parsed) {
    notFound();
  }

  const { dex1: slug1, dex2: slug2 } = parsed;

  // Redirect to canonical URL if not alphabetized
  const canonical = getCanonicalComparisonSlug(slug1, slug2);
  if (slugs !== canonical) {
    redirect(`/compare/${canonical}`);
  }

  // Fetch both DEXs
  const [dex1, dex2] = await Promise.all([
    getProtocolBySlugWithRanking(slug1),
    getProtocolBySlugWithRanking(slug2),
  ]);

  if (!dex1 || !dex2) {
    notFound();
  }

  const jsonLd = generateComparisonSchema(
    { name: dex1.name, score: dex1.scoreBreakdown.overall },
    { name: dex2.name, score: dex2.scoreBreakdown.overall }
  );

  return (
    <main className="container mx-auto py-8 px-4">
      <Breadcrumbs items={[
        { name: 'Compare', href: '/compare' },
        { name: `${dex1.name} vs ${dex2.name}`, href: `/compare/${slugs}` },
      ]} />

      <JsonLd data={jsonLd} />

      <ComparisonHeader dex1={dex1} dex2={dex2} />

      <MetricsComparison dex1={dex1} dex2={dex2} />

      <FeatureTable dex1={dex1} dex2={dex2} />
    </main>
  );
}
