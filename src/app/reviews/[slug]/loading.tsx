import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for DEX review pages.
 * Matches the layout of ReviewHeader, MetricsGrid, ScoreBreakdown, and ReviewSections components.
 */
export default function ReviewLoading() {
  return (
    <main className="container mx-auto py-8 px-4">
      {/* Header section - matches ReviewHeader */}
      <div className="flex items-center gap-4 mb-8">
        {/* Logo placeholder */}
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          {/* Name */}
          <Skeleton className="h-8 w-48" />
          {/* Category badge */}
          <Skeleton className="h-5 w-24" />
        </div>
        {/* Score badge */}
        <Skeleton className="h-12 w-20 ml-auto rounded-lg" />
      </div>

      {/* Metrics grid - matches MetricsGrid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      {/* Score breakdown section - matches ScoreBreakdown */}
      <div className="border rounded-lg p-6 mb-8 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Content sections - matches ReviewSections */}
      <div className="space-y-6">
        {/* Editor's Take placeholder */}
        <div className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Additional sections */}
        <div className="border rounded-lg p-6 space-y-3">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </main>
  );
}
