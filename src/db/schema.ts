import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  real,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Reusable timestamps
const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdateFn(() => new Date()),
};

// Supported blockchain networks
export const chains = pgTable('chains', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  chainId: integer('chain_id'),
  logo: text('logo'),
  ...timestamps,
});

// DEX protocols
export const protocols = pgTable('protocols', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  defillamaId: varchar('defillama_id', { length: 100 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  symbol: varchar('symbol', { length: 50 }),
  category: varchar('category', { length: 100 }),
  logo: text('logo'),
  url: text('url'),
  description: text('description'),
  ...timestamps,
}, (table) => [
  index('protocols_category_idx').on(table.category),
]);

// Protocol chain associations (many-to-many)
export const protocolChains = pgTable('protocol_chains', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  protocolId: integer('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  chainId: integer('chain_id').notNull().references(() => chains.id, { onDelete: 'cascade' }),
  ...timestamps,
}, (table) => [
  uniqueIndex('protocol_chain_unique').on(table.protocolId, table.chainId),
]);

// TVL and volume metrics (time-series)
export const protocolMetrics = pgTable('protocol_metrics', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  protocolId: integer('protocol_id').notNull().references(() => protocols.id, { onDelete: 'cascade' }),
  tvl: real('tvl'),
  tvlChange1h: real('tvl_change_1h'),
  tvlChange1d: real('tvl_change_1d'),
  tvlChange7d: real('tvl_change_7d'),
  volume24h: real('volume_24h'),
  volume7d: real('volume_7d'),
  volume30d: real('volume_30d'),
  volumeChange1d: real('volume_change_1d'),
  volumeChange7d: real('volume_change_7d'),
  chainTvls: jsonb('chain_tvls').$type<Record<string, number>>(),
  fetchedAt: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  ...timestamps,
}, (table) => [
  index('protocol_metrics_protocol_idx').on(table.protocolId),
  index('protocol_metrics_fetched_idx').on(table.fetchedAt),
]);

// Sync status tracking
export const syncStatus = pgTable('sync_status', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  syncType: varchar('sync_type', { length: 50 }).notNull().unique(), // 'protocols', 'volumes', 'full'
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  lastSuccessAt: timestamp('last_success_at', { withTimezone: true }),
  lastError: text('last_error'),
  recordsProcessed: integer('records_processed'),
  ...timestamps,
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }).defaultNow(),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
}, (table) => [
  index('newsletter_email_idx').on(table.email),
]);
