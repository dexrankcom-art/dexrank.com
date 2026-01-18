import { batchPercentileRanks } from './normalize';
import { DEFAULT_WEIGHTS, type RankingWeights } from './weights';
import type { ProtocolListItem, ScoreBreakdown, RankedProtocol } from '@/lib/data/types';

/**
 * Calculate DexRank scores for a batch of protocols
 *
 * Algorithm:
 * 1. Calculate percentile ranks for TVL and volume across all protocols
 * 2. For each protocol, apply weights to normalized scores
 * 3. If volume is null, redistribute weight to TVL (TVL gets 100%)
 * 4. Calculate overall rank and percentile
 *
 * @param protocols - List of protocols with TVL/volume data
 * @param weights - Optional custom weights (default: 60% TVL, 40% volume)
 * @returns Protocols with DexRank scores and breakdowns, sorted by score desc
 */
export function calculateDexRankScores(
  protocols: ProtocolListItem[],
  weights: RankingWeights = DEFAULT_WEIGHTS
): RankedProtocol[] {
  if (protocols.length === 0) return [];

  // Step 1: Calculate percentile ranks for each metric
  const tvlPercentiles = batchPercentileRanks(
    protocols.map((p) => ({ id: p.id, value: p.tvl }))
  );

  const volumePercentiles = batchPercentileRanks(
    protocols.map((p) => ({ id: p.id, value: p.volume24h }))
  );

  // Step 2: Calculate composite scores
  const scoredProtocols = protocols.map((protocol) => {
    const tvlScore = tvlPercentiles.get(protocol.id) ?? 0;
    const volumeScore = volumePercentiles.get(protocol.id);
    const hasVolume = protocol.volume24h !== null && protocol.volume24h > 0;

    // Weight redistribution when volume unavailable
    let appliedTvlWeight: number;
    let appliedVolumeWeight: number;
    let overall: number;

    if (hasVolume && volumeScore !== undefined) {
      // Both metrics available - use configured weights
      appliedTvlWeight = weights.tvl;
      appliedVolumeWeight = weights.volume;
      overall = tvlScore * appliedTvlWeight + volumeScore * appliedVolumeWeight;
    } else {
      // Volume missing - TVL gets 100%
      appliedTvlWeight = 1.0;
      appliedVolumeWeight = 0;
      overall = tvlScore;
    }

    const breakdown: ScoreBreakdown = {
      overall,
      rank: 0, // Will be assigned after sorting
      percentile: 0, // Will be assigned after sorting
      components: {
        tvl: tvlScore,
        volume: hasVolume ? (volumeScore ?? null) : null,
      },
      weights: {
        tvl: appliedTvlWeight,
        volume: appliedVolumeWeight,
      },
    };

    return {
      ...protocol,
      dexRankScore: overall,
      scoreBreakdown: breakdown,
    };
  });

  // Step 3: Sort by score descending and assign ranks
  scoredProtocols.sort((a, b) => b.dexRankScore - a.dexRankScore);

  const totalCount = scoredProtocols.length;
  scoredProtocols.forEach((protocol, index) => {
    protocol.scoreBreakdown.rank = index + 1;
    // Percentile: rank 1 = 100th percentile (top 0%), rank N = 0th percentile
    protocol.scoreBreakdown.percentile =
      totalCount === 1 ? 100 : ((totalCount - index - 1) / (totalCount - 1)) * 100;
  });

  return scoredProtocols;
}
