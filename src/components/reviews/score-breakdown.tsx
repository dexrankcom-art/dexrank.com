import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ScoreBreakdown } from '@/lib/data/types';

interface ScoreBreakdownProps {
  breakdown: ScoreBreakdown;
}

interface ScoreBarProps {
  label: string;
  score: number | null;
  weight: number;
  maxScore?: number;
}

function ScoreBar({ label, score, weight, maxScore = 100 }: ScoreBarProps) {
  const displayScore = score ?? 0;
  const percentage = (displayScore / maxScore) * 100;
  const weightPercentage = weight * 100;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {score !== null ? score.toFixed(1) : 'N/A'}
          <span className="text-muted-foreground ml-2">
            ({weightPercentage.toFixed(0)}% weight)
          </span>
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            score === null ? 'bg-muted-foreground/30' : 'bg-primary'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  return (
    <div className="rounded-lg border bg-card p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">Score Breakdown</h2>

      <div className="space-y-4">
        <ScoreBar
          label="TVL Score"
          score={breakdown.components.tvl}
          weight={breakdown.weights.tvl}
        />
        <ScoreBar
          label="Volume Score"
          score={breakdown.components.volume}
          weight={breakdown.weights.volume}
        />
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Overall DexRank Score</span>
          <span className="text-2xl font-bold">{breakdown.overall.toFixed(1)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {breakdown.weights.volume === 0
            ? 'Score based on TVL only (volume data unavailable)'
            : `Score calculated using ${(breakdown.weights.tvl * 100).toFixed(0)}% TVL + ${(breakdown.weights.volume * 100).toFixed(0)}% volume`}
        </p>
        <p className="text-sm mt-4">
          <Link href="/how-we-rank" className="text-primary hover:underline">
            How we calculate scores
          </Link>
        </p>
      </div>
    </div>
  );
}
