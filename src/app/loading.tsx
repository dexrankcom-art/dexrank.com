import { Skeleton } from '@/components/ui/skeleton';

/**
 * Global loading state shown during route transitions.
 * Uses shimmer animation from Plan 04-01.
 *
 * This loading.tsx applies to all routes. Individual routes can
 * have their own loading.tsx for more specific skeletons.
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in-simple">
      {/* Page title skeleton */}
      <Skeleton className="h-10 w-64 mb-6" />

      {/* Content area skeleton */}
      <div className="space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>

        {/* Table skeleton */}
        <div className="border rounded-lg p-4 space-y-3">
          {/* Table header */}
          <div className="flex gap-4 border-b pb-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20 ml-auto" />
            <Skeleton className="h-4 w-20" />
          </div>
          {/* Table rows */}
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex gap-4 py-2">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-16 ml-auto" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
