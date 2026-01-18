import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { RankBadge } from '@/components/rankings/rank-badge';
import { Button } from '@/components/ui/button';
import type { ProtocolWithMetrics, ScoreBreakdown } from '@/lib/data/types';

interface ReviewHeaderProps {
  protocol: ProtocolWithMetrics;
  scoreBreakdown: ScoreBreakdown;
  totalProtocols: number;
}

export function ReviewHeader({ protocol, scoreBreakdown, totalProtocols }: ReviewHeaderProps) {
  return (
    <div className="mb-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Rankings
      </Link>

      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Protocol info */}
        <div className="flex items-center gap-4">
          {protocol.logo && (
            <img
              src={protocol.logo}
              alt={protocol.name}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold">{protocol.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              {protocol.category && (
                <span className="text-sm">{protocol.category}</span>
              )}
              {protocol.symbol && (
                <>
                  <span>-</span>
                  <span className="text-sm uppercase">{protocol.symbol}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Score and rank */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">DexRank Score</span>
            <RankBadge score={scoreBreakdown.overall} size="lg" />
          </div>
          <div className="text-sm text-muted-foreground">
            Rank #{scoreBreakdown.rank} of {totalProtocols.toLocaleString()} protocols
            <span className="ml-2">
              (Top {(100 - scoreBreakdown.percentile).toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      {/* External link */}
      {protocol.url && (
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <a href={protocol.url} target="_blank" rel="noopener noreferrer">
              Visit {protocol.name}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
