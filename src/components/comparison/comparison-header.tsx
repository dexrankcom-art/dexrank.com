import Image from 'next/image';
import Link from 'next/link';
import type { ProtocolWithMetrics, ScoreBreakdown } from '@/lib/data/types';

interface ComparisonHeaderProps {
  dex1: ProtocolWithMetrics & { scoreBreakdown: ScoreBreakdown };
  dex2: ProtocolWithMetrics & { scoreBreakdown: ScoreBreakdown };
}

export function ComparisonHeader({ dex1, dex2 }: ComparisonHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">
        {dex1.name} vs {dex2.name}
      </h1>

      <div className="grid grid-cols-2 gap-4 md:gap-8">
        {/* DEX 1 */}
        <div className="text-center">
          <Link href={`/reviews/${dex1.slug}`} className="inline-block group">
            {dex1.logo && (
              <Image
                src={dex1.logo}
                alt={dex1.name}
                width={80}
                height={80}
                className="mx-auto rounded-full mb-3 group-hover:ring-2 ring-primary transition-all"
              />
            )}
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {dex1.name}
            </h2>
          </Link>
          <div className="mt-2">
            <span className="text-3xl font-bold">{dex1.scoreBreakdown.overall.toFixed(0)}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Rank #{dex1.scoreBreakdown.rank}
          </p>
        </div>

        {/* DEX 2 */}
        <div className="text-center">
          <Link href={`/reviews/${dex2.slug}`} className="inline-block group">
            {dex2.logo && (
              <Image
                src={dex2.logo}
                alt={dex2.name}
                width={80}
                height={80}
                className="mx-auto rounded-full mb-3 group-hover:ring-2 ring-primary transition-all"
              />
            )}
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {dex2.name}
            </h2>
          </Link>
          <div className="mt-2">
            <span className="text-3xl font-bold">{dex2.scoreBreakdown.overall.toFixed(0)}</span>
            <span className="text-muted-foreground">/100</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Rank #{dex2.scoreBreakdown.rank}
          </p>
        </div>
      </div>
    </div>
  );
}
