'use client';

import { parseAsString, parseAsStringEnum, parseAsInteger, useQueryStates } from 'nuqs';

export const sortFields = ['dexRankScore', 'tvl', 'volume24h', 'name'] as const;
export type SortField = typeof sortFields[number];

export const sortOrders = ['asc', 'desc'] as const;
export type SortOrder = typeof sortOrders[number];

export function useProtocolFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString.withDefault(''),
      chain: parseAsString,
      category: parseAsString,
      sort: parseAsStringEnum([...sortFields]).withDefault('dexRankScore'),
      order: parseAsStringEnum([...sortOrders]).withDefault('desc'),
      page: parseAsInteger.withDefault(1),
    },
    {
      shallow: false, // Trigger server re-render for SSR
    }
  );

  return {
    filters,
    setSearch: (search: string) => setFilters({ search: search || null, page: 1 }),
    setChain: (chain: string | null) => setFilters({ chain, page: 1 }),
    setCategory: (category: string | null) => setFilters({ category, page: 1 }),
    setSort: (sort: SortField) => setFilters({ sort }),
    setOrder: (order: SortOrder) => setFilters({ order }),
    toggleSort: (field: SortField) => {
      if (filters.sort === field) {
        setFilters({ order: filters.order === 'desc' ? 'asc' : 'desc' });
      } else {
        setFilters({ sort: field, order: 'desc' });
      }
    },
    setPage: (page: number) => setFilters({ page }),
    resetFilters: () => setFilters({ search: null, chain: null, category: null, page: 1 }),
  };
}
