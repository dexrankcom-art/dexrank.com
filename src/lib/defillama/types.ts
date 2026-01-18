import { z } from 'zod';

// Protocol from /protocols endpoint (TVL data)
export const ProtocolSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  symbol: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  chains: z.array(z.string()),
  tvl: z.number().nullable(),
  chainTvls: z.record(z.string(), z.number()).optional(),
  change_1h: z.number().nullable().optional(),
  change_1d: z.number().nullable().optional(),
  change_7d: z.number().nullable().optional(),
  logo: z.string().optional().nullable(),
  url: z.string().optional().nullable(),
});

export const ProtocolsResponseSchema = z.array(ProtocolSchema);
export type Protocol = z.infer<typeof ProtocolSchema>;

// DEX from /overview/dexs endpoint (volume data)
export const DexProtocolSchema = z.object({
  name: z.string(),
  displayName: z.string().optional().nullable(),
  module: z.string(),
  category: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  chains: z.array(z.string()),
  total24h: z.number().optional().nullable(),
  total7d: z.number().optional().nullable(),
  total30d: z.number().optional().nullable(),
  change_1d: z.number().optional().nullable(),
  change_7d: z.number().optional().nullable(),
  change_1m: z.number().optional().nullable(),
});

export const DexVolumeResponseSchema = z.object({
  totalVolume24h: z.number().optional().nullable(),
  protocols: z.array(DexProtocolSchema),
});

export type DexProtocol = z.infer<typeof DexProtocolSchema>;
export type DexVolumeResponse = z.infer<typeof DexVolumeResponseSchema>;
