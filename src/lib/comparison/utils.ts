/**
 * Generate canonical comparison slug (alphabetized)
 * Ensures /compare/b-vs-a redirects to /compare/a-vs-b
 */
export function getCanonicalComparisonSlug(slug1: string, slug2: string): string {
  const sorted = [slug1, slug2].sort();
  return `${sorted[0]}-vs-${sorted[1]}`;
}

/**
 * Parse comparison URL slug into two DEX slugs
 * Returns null if invalid format
 */
export function parseComparisonSlug(slugs: string): { dex1: string; dex2: string } | null {
  // Match pattern: slug1-vs-slug2
  // Handles slugs with hyphens (e.g., "trader-joe-vs-sushiswap")
  const match = slugs.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;

  const dex1 = match[1];
  const dex2 = match[2];

  // Validate we got two different slugs
  if (!dex1 || !dex2 || dex1 === dex2) return null;

  return { dex1, dex2 };
}

/**
 * Determine winner for a metric comparison
 * Returns 1 (dex1 wins), 2 (dex2 wins), or 0 (tie/no winner)
 */
export function getMetricWinner(
  value1: number | null | undefined,
  value2: number | null | undefined,
  higherIsBetter: boolean = true
): 0 | 1 | 2 {
  if (value1 == null && value2 == null) return 0;
  if (value1 == null) return 2;
  if (value2 == null) return 1;

  if (value1 === value2) return 0;

  if (higherIsBetter) {
    return value1 > value2 ? 1 : 2;
  } else {
    return value1 < value2 ? 1 : 2;
  }
}
