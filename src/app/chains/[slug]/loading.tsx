import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading skeleton for chain landing pages.
 * Matches the layout of ChainHeader and ChainDexList components.
 */
export default function ChainLoading() {
  return (
    <main className="container mx-auto py-8 px-4">
      {/* Chain header - matches ChainHeader */}
      <div className="flex items-center gap-4 mb-8">
        {/* Chain icon */}
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          {/* Chain name */}
          <Skeleton className="h-8 w-40" />
          {/* Subtitle */}
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* DEX list header */}
      <Skeleton className="h-6 w-48 mb-4" />

      {/* DEX list table - matches ChainDexList */}
      <div className="border rounded-lg">
        {/* Table header */}
        <div className="flex gap-4 p-4 border-b">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20 ml-auto" />
          <Skeleton className="h-4 w-20" />
        </div>
        {/* Table rows */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b last:border-0">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16 ml-auto" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </main>
  );
}
