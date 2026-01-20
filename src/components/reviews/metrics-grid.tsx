'use client';

import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProtocolMetric } from '@/lib/data/types';
import { CountUp, formatCompactNumber } from '@/components/animated/count-up';

interface MetricsGridProps {
  metrics: ProtocolMetric | null;
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '-';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

function formatChange(value: number | null): { text: string; isPositive: boolean } | null {
  if (value === null || value === undefined) return null;
  const isPositive = value >= 0;
  const sign = isPositive ? '+' : '';
  return { text: `${sign}${value.toFixed(2)}%`, isPositive };
}

interface MetricCardProps {
  label: string;
  /** Raw numeric value for animation, or null for no data */
  rawValue: number | null;
  change?: { text: string; isPositive: boolean } | null;
  icon: React.ReactNode;
}

function MetricCard({ label, rawValue, change, icon }: MetricCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 hover-lift">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        {icon}
        {label}
      </div>
      <div className="text-2xl font-bold">
        {rawValue !== null && rawValue !== undefined ? (
          <CountUp
            end={rawValue}
            prefix="$"
            formatter={formatCompactNumber}
            duration={800}
          />
        ) : (
          '-'
        )}
      </div>
      {change && (
        <div
          className={cn(
            'text-sm mt-1 flex items-center gap-1',
            change.isPositive ? 'text-green-600' : 'text-red-600'
          )}
        >
          {change.isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {change.text} (24h)
        </div>
      )}
    </div>
  );
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (!metrics) {
    return (
      <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
        No metrics available
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        label="Total Value Locked"
        rawValue={metrics.tvl}
        change={formatChange(metrics.tvlChange1d)}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <MetricCard
        label="24h Volume"
        rawValue={metrics.volume24h}
        change={formatChange(metrics.volumeChange1d)}
        icon={<Activity className="h-4 w-4" />}
      />
      <MetricCard
        label="7d Volume"
        rawValue={metrics.volume7d}
        change={formatChange(metrics.volumeChange7d)}
        icon={<Activity className="h-4 w-4" />}
      />
      <MetricCard
        label="30d Volume"
        rawValue={metrics.volume30d}
        icon={<Activity className="h-4 w-4" />}
      />
    </div>
  );
}
