import { NextRequest } from 'next/server';
import { getProtocols, getProtocolCount } from '@/lib/data/protocols';
import type { ProtocolSortField, SortOrder } from '@/lib/data/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const filters = {
    chain: searchParams.get('chain') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    search: searchParams.get('search') ?? undefined,
    limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 100,
    offset: searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0,
  };

  const sortBy = (searchParams.get('sortBy') ?? 'tvl') as ProtocolSortField;
  const sortOrder = (searchParams.get('sortOrder') ?? 'desc') as SortOrder;

  try {
    const [protocols, total] = await Promise.all([
      getProtocols(filters, sortBy, sortOrder),
      getProtocolCount(filters),
    ]);

    return Response.json({
      data: protocols,
      pagination: {
        total,
        limit: filters.limit,
        offset: filters.offset,
        hasMore: filters.offset + protocols.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching protocols:', error);
    return Response.json(
      { error: 'Failed to fetch protocols' },
      { status: 500 }
    );
  }
}
