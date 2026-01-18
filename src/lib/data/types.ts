import type { InferSelectModel } from 'drizzle-orm';
import type {
  protocols,
  chains,
  protocolChains,
  protocolMetrics,
  syncStatus,
} from '@/db/schema';

// Base types inferred from schema
export type Protocol = InferSelectModel<typeof protocols>;
export type Chain = InferSelectModel<typeof chains>;
export type ProtocolChain = InferSelectModel<typeof protocolChains>;
export type ProtocolMetric = InferSelectModel<typeof protocolMetrics>;
export type SyncStatus = InferSelectModel<typeof syncStatus>;

// Enriched protocol with related data
export type ProtocolWithMetrics = Protocol & {
  chains: Chain[];
  latestMetrics: ProtocolMetric | null;
};

// List item for protocol listings
export type ProtocolListItem = {
  id: number;
  slug: string;
  name: string;
  logo: string | null;
  category: string | null;
  chains: string[];
  tvl: number | null;
  tvlChange24h: number | null;
  volume24h: number | null;
  volumeChange24h: number | null;
};

// Filter options
export type ProtocolFilters = {
  chain?: string;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
};

// Sort options
export type ProtocolSortField = 'name' | 'tvl' | 'volume24h' | 'tvlChange24h';
export type SortOrder = 'asc' | 'desc';
