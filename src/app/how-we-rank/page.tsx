import { Metadata } from 'next';
import Link from 'next/link';
import { WeightVisualization } from '@/components/methodology/weight-visualization';
import { FactorCard } from '@/components/methodology/factor-card';

export const metadata: Metadata = {
  title: 'How We Rank DEXs - DexRank Methodology',
  description: 'Learn how DexRank calculates scores for decentralized exchanges. Transparent methodology with weighted metrics including TVL and trading volume.',
  openGraph: {
    title: 'DexRank Methodology - How We Rank DEXs',
    description: 'Transparent ranking methodology using percentile normalization and weighted metrics.',
  },
};

const currentWeights = [
  { name: 'TVL Score', weight: 60, color: 'bg-blue-500' },
  { name: 'Volume Score', weight: 40, color: 'bg-green-500' },
];

export default function HowWeRankPage() {
  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">How We Rank DEXs</h1>
      <p className="text-lg text-muted-foreground mb-8">
        DexRank scores are calculated using a transparent, data-driven methodology.
        Here&apos;s exactly how we determine which decentralized exchanges rank highest.
      </p>

      {/* Executive Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">The DexRank Score</h2>
        <p className="mb-4">
          Every DEX receives a score from 0-100 based on two key metrics:
          <strong> Total Value Locked (TVL)</strong> and <strong>Trading Volume</strong>.
          These metrics are normalized using percentile ranking, then combined with
          weighted importance.
        </p>

        <WeightVisualization weights={currentWeights} title="Current Weight Distribution" />
      </section>

      {/* Ranking Factors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Ranking Factors Explained</h2>

        <div className="space-y-6">
          <FactorCard
            name="Total Value Locked (TVL)"
            weight="60%"
            description="TVL represents the total value of assets deposited in a DEX's smart contracts. Higher TVL generally indicates greater trust, liquidity depth, and platform stability."
            calculation="We use percentile normalization: a DEX with higher TVL than 90% of others gets a TVL score of 90. This prevents outliers (like Uniswap's massive TVL) from compressing everyone else's scores."
            dataSource="DefiLlama API - updated every 6 hours"
          />

          <FactorCard
            name="Trading Volume"
            weight="40%"
            description="24-hour trading volume shows actual usage and demand. High volume indicates active traders and liquid markets, making it easier to execute large trades."
            calculation="Same percentile normalization as TVL. DEXs without volume data have their TVL weight increased to 100% for a fair comparison."
            dataSource="DefiLlama Volumes API - updated every 6 hours"
          />
        </div>
      </section>

      {/* Methodology Details */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Methodology Details</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Why Percentile Normalization?</h3>
            <p className="text-muted-foreground">
              Raw TVL values span from millions to billions. Simple scaling would make
              mid-tier DEXs indistinguishable. Percentile normalization preserves
              meaningful ranking differences across the full spectrum.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Handling Missing Data</h3>
            <p className="text-muted-foreground">
              Not all DEXs have volume data available. When volume is missing, we
              redistribute its weight to TVL (TVL becomes 100% of the score). This
              ensures DEXs aren&apos;t penalized for data gaps while still providing
              meaningful comparisons.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Update Frequency</h3>
            <p className="text-muted-foreground">
              Data syncs from DefiLlama every 6 hours. Rankings reflect the latest
              available metrics. Individual DEX pages show the timestamp of the
              most recent data.
            </p>
          </div>
        </div>
      </section>

      {/* Future Factors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Future Ranking Factors</h2>
        <p className="text-muted-foreground mb-4">
          We&apos;re working to incorporate additional factors to make rankings more comprehensive:
        </p>

        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Security Score</strong> - Audit status, hack history, and smart contract risk
          </li>
          <li>
            <strong className="text-foreground">Fee Efficiency</strong> - Trading costs relative to competitors
          </li>
          <li>
            <strong className="text-foreground">User Growth</strong> - Unique wallet trends over time
          </li>
          <li>
            <strong className="text-foreground">Verified User Reviews</strong> - On-chain verified user feedback
          </li>
        </ul>
      </section>

      {/* Transparency Commitment */}
      <section className="mb-12 bg-muted/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Our Transparency Commitment</h2>
        <p className="mb-4">
          DexRank will never accept payment to influence rankings. Our methodology is
          public, our data sources are verifiable, and our code is open for inspection.
        </p>
        <p className="text-sm text-muted-foreground">
          Found an issue with our methodology? Have suggestions?{' '}
          <a href="mailto:feedback@dexrank.com" className="text-primary hover:underline">
            Contact us
          </a>
        </p>
      </section>

      {/* CTA */}
      <section className="text-center py-8 border-t">
        <h2 className="text-xl font-semibold mb-4">Ready to Explore?</h2>
        <div className="flex justify-center gap-4">
          <Link
            href="/"
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            View Rankings
          </Link>
          <Link
            href="/guides"
            className="border px-6 py-2 rounded-md hover:bg-muted transition-colors"
          >
            Read Guides
          </Link>
        </div>
      </section>
    </main>
  );
}
