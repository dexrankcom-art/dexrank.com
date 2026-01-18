---
phase: 02-core-pages-rankings
plan: 01
subsystem: ranking
tags: [algorithm, scoring, normalization, percentile]
dependency-graph:
  requires: [01-02, 01-03]
  provides: [DexRank scoring algorithm, getProtocolsWithRanking function]
  affects: [02-02, 02-03, 02-04]
tech-stack:
  added: []
  patterns: [percentile normalization, weighted composite scoring, weight redistribution]
key-files:
  created:
    - src/lib/ranking/weights.ts
    - src/lib/ranking/normalize.ts
    - src/lib/ranking/calculate-score.ts
    - src/lib/ranking/index.ts
  modified:
    - src/lib/data/types.ts
    - src/lib/data/protocols.ts
decisions:
  - id: RANK-001
    choice: Percentile normalization over min-max
    reason: TVL has extreme variance (10B+ vs 0), percentile preserves meaningful ranking
  - id: RANK-002
    choice: Weight redistribution when volume unavailable
    reason: 97% of protocols lack volume data - TVL gets 100% weight for fair scoring
metrics:
  duration: ~5 minutes
  completed: 2026-01-18
---

# Phase 02 Plan 01: DexRank Scoring Algorithm Summary

**One-liner:** Percentile-normalized composite scoring (TVL 60%, Volume 40%) with automatic weight redistribution for protocols missing volume data.

## What Was Built

### Ranking Module (`src/lib/ranking/`)

1. **weights.ts** - Configurable ranking weights
   - `RankingWeights` type for TVL and volume weights
   - `DEFAULT_WEIGHTS`: TVL 60%, Volume 40%
   - `validateWeights()` function to ensure weights sum to 1.0
   - Documented rationale in code comments

2. **normalize.ts** - Percentile rank normalization
   - `batchPercentileRanks()` for efficient batch calculation
   - Pre-sorts once, then assigns all percentiles
   - Handles null/zero values by assigning 0 percentile
   - Single valid item gets 100 percentile

3. **calculate-score.ts** - Core scoring algorithm
   - `calculateDexRankScores()` calculates composite scores
   - Two-phase calculation: percentiles then weighted sum
   - Weight redistribution: TVL gets 100% when volume missing
   - Assigns rank (1-N) and percentile (0-100) after sorting

4. **index.ts** - Barrel export for clean imports

### Data Layer Updates

5. **types.ts** - New ranking types
   - `ScoreBreakdown` with overall, rank, percentile, components, weights
   - `RankedProtocol` combining ProtocolListItem with ranking data
   - Added `dexRankScore` to `ProtocolSortField`

6. **protocols.ts** - New ranking-aware function
   - `getProtocolsWithRanking()` fetches all protocols and calculates scores
   - Supports sorting by dexRankScore (default), tvl, volume, name
   - Applies pagination after ranking for correct rank positions

## Algorithm Details

### Percentile Normalization

Why percentile over min-max:
- TVL ranges from $0 to $10B+ (extreme variance)
- Top protocol has 100x more TVL than median
- Percentile produces intuitive "better than X% of peers" scores
- Preserves meaningful ranking differences

### Weight Redistribution

When a protocol has no volume data:
- Default: TVL 60% + Volume 40%
- Without volume: TVL gets 100% weight
- Ensures fair comparison across protocols with different data availability

### Score Calculation Flow

```
1. Fetch all protocols with TVL/volume
2. Calculate TVL percentiles (0-100) for all protocols
3. Calculate Volume percentiles (0-100) for protocols with volume
4. For each protocol:
   - If volume exists: score = TVL% * 0.6 + Volume% * 0.4
   - If no volume: score = TVL% * 1.0
5. Sort by score descending
6. Assign rank (1, 2, 3...) and percentile (100, 99.9...)
```

## Deviations from Plan

None - plan executed exactly as written.

## Task Commits

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create ranking weights and types | e5f6c5e | weights.ts, types.ts |
| 2 | Implement percentile normalization | afca396 | normalize.ts |
| 3 | Implement score calculation and data integration | 6d527fe | calculate-score.ts, index.ts, protocols.ts |

## Verification Results

- [x] `src/lib/ranking/weights.ts` exports `DEFAULT_WEIGHTS` with documented rationale
- [x] `src/lib/ranking/normalize.ts` exports `batchPercentileRanks` function
- [x] `src/lib/ranking/calculate-score.ts` exports `calculateDexRankScores` function
- [x] `src/lib/data/types.ts` has `ScoreBreakdown` and `RankedProtocol` types
- [x] `src/lib/data/protocols.ts` exports `getProtocolsWithRanking` function
- [x] TypeScript compiles without errors
- [x] Import chain works: ranking/index.ts -> data/protocols.ts

## Success Criteria Met

1. **Every protocol gets a DexRank score between 0-100** - Yes, percentile normalization guarantees 0-100 range
2. **Scores calculated using percentile normalization** - Yes, batchPercentileRanks handles this
3. **Weight redistribution works when volume is null** - Yes, TVL gets 100% weight
4. **Score breakdown shows TVL/volume components and applied weights** - Yes, ScoreBreakdown type captures all
5. **getProtocolsWithRanking returns protocols sorted by score by default** - Yes, default sortBy='dexRankScore'

## Next Phase Readiness

Ready for Plan 02-02 (Rankings Page API & UI):
- `getProtocolsWithRanking()` provides data layer for rankings page
- `RankedProtocol` type ready for React components
- Score breakdown available for transparency UI
