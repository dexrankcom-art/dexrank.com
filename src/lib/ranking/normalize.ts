/**
 * Percentile Rank Normalization
 *
 * Why percentile instead of min-max:
 * 1. TVL ranges from $0 to $10B+ - extreme variance
 * 2. Top protocol (Uniswap) has 100x more TVL than median
 * 3. Percentile preserves meaningful ranking differences
 * 4. Result is intuitive: "better than X% of peers"
 *
 * Source: COINr Normalisation Guide, OpenSearch rank normalization
 */

/**
 * Batch calculate percentile ranks for efficiency
 * Pre-sorts once, then calculates all ranks
 *
 * @param items - Array of {id, value} where value can be null
 * @returns Map of id -> percentile rank (0-100)
 */
export function batchPercentileRanks(
  items: { id: number; value: number | null }[]
): Map<number, number> {
  // Filter to items with values and sort ascending
  const validItems = items
    .filter((item): item is { id: number; value: number } => item.value !== null && item.value > 0)
    .sort((a, b) => a.value - b.value);

  const ranks = new Map<number, number>();
  const totalValid = validItems.length;

  if (totalValid === 0) {
    // All null/zero - everyone gets 0
    items.forEach((item) => ranks.set(item.id, 0));
    return ranks;
  }

  // Assign percentile based on position
  // Position 0 (lowest) = 0 percentile
  // Position N-1 (highest) = 100 percentile
  validItems.forEach((item, index) => {
    const percentile = totalValid === 1 ? 100 : (index / (totalValid - 1)) * 100;
    ranks.set(item.id, percentile);
  });

  // Null/zero values get 0 percentile
  items
    .filter((item) => item.value === null || item.value === 0)
    .forEach((item) => ranks.set(item.id, 0));

  return ranks;
}
