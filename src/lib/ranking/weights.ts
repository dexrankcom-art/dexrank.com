/**
 * DexRank Scoring Weights
 *
 * Phase 1: TVL (60%) + Volume (40%)
 * When volume is unavailable, TVL gets 100% weight
 *
 * Rationale:
 * - TVL: Most reliable metric, 100% coverage, indicates protocol trust/adoption
 * - Volume: Trading activity signal, only ~3% coverage
 *
 * Future phases may add: growth, security, liquidity metrics
 */
export type RankingWeights = {
  tvl: number;
  volume: number;
};

export const DEFAULT_WEIGHTS: RankingWeights = {
  tvl: 0.60,
  volume: 0.40,
};

// Validate weights sum to 1.0
export function validateWeights(weights: RankingWeights): boolean {
  const sum = weights.tvl + weights.volume;
  return Math.abs(sum - 1.0) < 0.001;
}
