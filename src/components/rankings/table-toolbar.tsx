'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProtocolFilters } from '@/hooks/use-protocol-filters';

interface TableToolbarProps {
  categories: string[];
  chains: string[];
}

export function TableToolbar({ categories, chains }: TableToolbarProps) {
  const { filters, setSearch, setChain, setCategory, resetFilters } = useProtocolFilters();
  const [searchInput, setSearchInput] = React.useState(filters.search);

  // Debounce search input
  const deferredSearch = React.useDeferredValue(searchInput);

  React.useEffect(() => {
    if (deferredSearch !== filters.search) {
      setSearch(deferredSearch);
    }
  }, [deferredSearch, filters.search, setSearch]);

  const hasFilters = filters.search || filters.chain || filters.category;

  return (
    <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search DEXs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          value={filters.chain ?? 'all'}
          onValueChange={(value) => setChain(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Chains" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Chains</SelectItem>
            {chains.map((chain) => (
              <SelectItem key={chain} value={chain.toLowerCase()}>
                {chain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category ?? 'all'}
          onValueChange={(value) => setCategory(value === 'all' ? null : value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="ghost" onClick={resetFilters} className="h-10 px-3">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
