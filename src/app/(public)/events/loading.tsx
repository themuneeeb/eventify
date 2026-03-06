import { Skeleton } from "../../../components/ui/skeleton";

// Events page loading skeleton — HCI: Feedback during data fetch
export default function EventsLoading() {
  return (
    <div className="container-main py-12">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-2 h-5 w-72" />

      {/* Filter bar skeleton */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Skeleton className="h-10 w-48 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Event cards skeleton */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-brand-sage/20 rounded-xl border bg-white p-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
