import type { ProtocolWithMetrics, ScoreBreakdown } from '@/lib/data/types';
import { getMetricWinner } from '@/lib/comparison/utils';
import { WinnerBadge } from './winner-badge';
import { cn } from '@/lib/utils';

interface MetricsComparisonProps {
  dex1: ProtocolWithMetrics & { scoreBreakdown: ScoreBreakdown };
  dex2: ProtocolWithMetrics & { scoreBreakdown: ScoreBreakdown };
}

function formatValue(value: number | null | undefined, type: 'currency' | 'percent' | 'number'): string {
  if (value == null) return 'N/A';

  if (type === 'currency') {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  }

  if (type === 'percent') {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  return value.toFixed(2);
}

export function MetricsComparison({ dex1, dex2 }: MetricsComparisonProps) {
  const metrics = [
    {
      label: 'DexRank Score',
      value1: dex1.scoreBreakdown.overall,
      value2: dex2.scoreBreakdown.overall,
      type: 'number' as const,
      higherIsBetter: true,
    },
    {
      label: 'Total Value Locked',
      value1: dex1.latestMetrics?.tvl,
      value2: dex2.latestMetrics?.tvl,
      type: 'currency' as const,
      higherIsBetter: true,
    },
    {
      label: '24h Volume',
      value1: dex1.latestMetrics?.volume24h,
      value2: dex2.latestMetrics?.volume24h,
      type: 'currency' as const,
      higherIsBetter: true,
    },
    {
      label: '7d Volume',
      value1: dex1.latestMetrics?.volume7d,
      value2: dex2.latestMetrics?.volume7d,
      type: 'currency' as const,
      higherIsBetter: true,
    },
    {
      label: 'TVL Change (24h)',
      value1: dex1.latestMetrics?.tvlChange1d,
      value2: dex2.latestMetrics?.tvlChange1d,
      type: 'percent' as const,
      higherIsBetter: true,
    },
    {
      label: 'Supported Chains',
      value1: dex1.chains.length,
      value2: dex2.chains.length,
      type: 'number' as const,
      higherIsBetter: true,
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Metrics Comparison</h2>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Metric</th>
              <th className="text-right p-3 font-medium">{dex1.name}</th>
              <th className="text-right p-3 font-medium">{dex2.name}</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, i) => {
              const winner = getMetricWinner(metric.value1, metric.value2, metric.higherIsBetter);

              return (
                <tr key={metric.label} className={cn(i % 2 === 0 ? 'bg-background' : 'bg-muted/30')}>
                  <td className="p-3 text-muted-foreground">{metric.label}</td>
                  <td className={cn(
                    'p-3 text-right font-medium',
                    winner === 1 && 'text-green-600 dark:text-green-400'
                  )}>
                    {formatValue(metric.value1, metric.type)}
                    <WinnerBadge winner={winner} position={1} />
                  </td>
                  <td className={cn(
                    'p-3 text-right font-medium',
                    winner === 2 && 'text-green-600 dark:text-green-400'
                  )}>
                    {formatValue(metric.value2, metric.type)}
                    <WinnerBadge winner={winner} position={2} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
