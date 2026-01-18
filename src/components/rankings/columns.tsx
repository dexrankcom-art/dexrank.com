'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RankBadge } from './rank-badge';
import type { RankedProtocol } from '@/lib/data/types';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Format large numbers (TVL, volume)
function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return '-';
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

// Format percentage change
function formatChange(value: number | null): string {
  if (value === null || value === undefined) return '-';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

// Extend ColumnMeta for responsive behavior
declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    hideOnMobile?: boolean;
  }
}

export const columns: ColumnDef<RankedProtocol>[] = [
  {
    accessorKey: 'scoreBreakdown.rank',
    header: '#',
    cell: ({ row }) => (
      <span className="font-medium text-muted-foreground w-8 inline-block">
        {row.original.scoreBreakdown.rank}
      </span>
    ),
    size: 50,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/reviews/${row.original.slug}`}
        className="flex items-center gap-2 hover:underline"
      >
        {row.original.logo && (
          <img
            src={row.original.logo}
            alt=""
            className="h-6 w-6 rounded-full"
            loading="lazy"
          />
        )}
        <span className="font-medium">{row.original.name}</span>
      </Link>
    ),
  },
  {
    accessorKey: 'dexRankScore',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        DexRank
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <RankBadge score={row.original.dexRankScore} />,
  },
  {
    accessorKey: 'tvl',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        TVL
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{formatCurrency(row.original.tvl)}</div>
        {row.original.tvlChange24h !== null && (
          <div
            className={cn(
              'text-xs',
              row.original.tvlChange24h >= 0 ? 'text-green-600' : 'text-red-600'
            )}
          >
            {formatChange(row.original.tvlChange24h)}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'volume24h',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="-ml-4"
      >
        24h Volume
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{formatCurrency(row.original.volume24h)}</div>
    ),
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'category',
    header: 'Type',
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.category || '-'}
      </span>
    ),
    meta: { hideOnMobile: true },
  },
  {
    accessorKey: 'chains',
    header: 'Chains',
    cell: ({ row }) => {
      const chains = row.original.chains;
      if (chains.length === 0) return '-';
      if (chains.length <= 2) return chains.join(', ');
      return `${chains.slice(0, 2).join(', ')} +${chains.length - 2}`;
    },
    meta: { hideOnMobile: true },
  },
];
