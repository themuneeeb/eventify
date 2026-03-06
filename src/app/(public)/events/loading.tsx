import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <div className="container-main py-12">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-2 h-5 w-72" />

      {/* Search skeleton */}
      <Skeleton className="mt-8 h-10 w-full max-w-md rounded-lg" />

      {/* Filter chips skeleton */}
      <div className="mt-6 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Event cards skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="border-brand-sage/20 overflow-hidden rounded-xl border bg-white"
          >
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-4">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="mt-2 h-4 w-full" />
              <Skeleton className="mt-1 h-4 w-2/3" />
              <Skeleton className="mt-3 h-3.5 w-1/2" />
              <Skeleton className="mt-1.5 h-3.5 w-1/3" />
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
