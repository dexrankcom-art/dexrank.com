import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProtocolBySlugWithRanking, getAllProtocolSlugs } from '@/lib/data/protocols';
import { ReviewHeader } from '@/components/reviews/review-header';
import { MetricsGrid } from '@/components/reviews/metrics-grid';
import { ScoreBreakdown } from '@/components/reviews/score-breakdown';
import { ReviewSections } from '@/components/reviews/review-sections';

// ISR: Revalidate every hour for fresh metrics
export const revalidate = 3600;

// Pre-generate pages for all known protocols
export async function generateStaticParams() {
  const slugs = await getAllProtocolSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Allow new protocols to be generated on-demand
export const dynamicParams = true;

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const protocol = await getProtocolBySlugWithRanking(slug);

  if (!protocol) {
    return {
      title: 'Protocol Not Found - DexRank',
    };
  }

  return {
    title: `${protocol.name} Review - DexRank`,
    description: `${protocol.name} DEX review with DexRank score (${protocol.scoreBreakdown.overall.toFixed(1)}/100), TVL, volume, and detailed analysis.`,
    openGraph: {
      title: `${protocol.name} Review - DexRank`,
      description: `DexRank score: ${protocol.scoreBreakdown.overall.toFixed(1)}/100. Rank #${protocol.rank} of ${protocol.totalProtocols} protocols.`,
      images: protocol.logo ? [{ url: protocol.logo }] : [],
    },
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const protocol = await getProtocolBySlugWithRanking(slug);

  if (!protocol) {
    notFound();
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <ReviewHeader
        protocol={protocol}
        scoreBreakdown={protocol.scoreBreakdown}
        totalProtocols={protocol.totalProtocols}
      />

      <MetricsGrid metrics={protocol.latestMetrics} />

      <ScoreBreakdown breakdown={protocol.scoreBreakdown} />

      <ReviewSections protocol={protocol} />
    </main>
  );
}
