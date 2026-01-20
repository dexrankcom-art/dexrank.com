import { Suspense } from 'react';
import Link from 'next/link';
import { getProtocolsWithRanking, getCategories, getChainNames, getProtocolCount } from '@/lib/data/protocols';
import { DataTable } from '@/components/rankings/data-table';
import { TableToolbar } from '@/components/rankings/table-toolbar';
import { columns } from '@/components/rankings/columns';
import { Skeleton } from '@/components/ui/skeleton';
import type { SortOrder, ProtocolSortField } from '@/lib/data/types';

// Revalidate every 5 minutes for fresh data
export const revalidate = 300;

interface HomePageProps {
  searchParams: Promise<{
    search?: string;
    chain?: string;
    category?: string;
    sort?: string;
    order?: string;
    page?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // Parse and validate search params
  const search = params.search || undefined;
  const chain = params.chain || undefined;
  const category = params.category || undefined;
  const sortBy = (['dexRankScore', 'tvl', 'volume24h', 'name'].includes(params.sort ?? '')
    ? params.sort
    : 'dexRankScore') as ProtocolSortField;
  const sortOrder = (params.order === 'asc' ? 'asc' : 'desc') as SortOrder;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));
  const pageSize = 50;

  // Fetch data in parallel
  const [protocols, categories, chains, totalCount] = await Promise.all([
    getProtocolsWithRanking(
      {
        search,
        chain,
        category,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
      sortBy,
      sortOrder
    ),
    getCategories(),
    getChainNames(),
    getProtocolCount({ search, chain, category }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">DEX Rankings</h1>
        <p className="text-muted-foreground mt-2">
          Compare decentralized exchanges by DexRank score, TVL, and trading volume.{' '}
          <Link href="/how-we-rank" className="text-primary hover:underline">
            Learn how we rank
          </Link>
        </p>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <TableToolbar categories={categories} chains={chains} />
        <DataTable columns={columns} data={protocols} />

        {/* Pagination info */}
        <div className="flex items-center justify-between py-4 text-sm text-muted-foreground">
          <div>
            Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} of {totalCount.toLocaleString()} protocols
          </div>
          {totalPages > 1 && (
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`?${new URLSearchParams({
                    ...(search && { search }),
                    ...(chain && { chain }),
                    ...(category && { category }),
                    ...(sortBy !== 'dexRankScore' && { sort: sortBy }),
                    ...(sortOrder !== 'desc' && { order: sortOrder }),
                    page: String(page - 1),
                  }).toString()}`}
                  className="underline hover:no-underline"
                >
                  Previous
                </a>
              )}
              <span>Page {page} of {totalPages}</span>
              {page < totalPages && (
                <a
                  href={`?${new URLSearchParams({
                    ...(search && { search }),
                    ...(chain && { chain }),
                    ...(category && { category }),
                    ...(sortBy !== 'dexRankScore' && { sort: sortBy }),
                    ...(sortOrder !== 'desc' && { order: sortOrder }),
                    page: String(page + 1),
                  }).toString()}`}
                  className="underline hover:no-underline"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </div>
      </Suspense>
    </main>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="rounded-md border">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
