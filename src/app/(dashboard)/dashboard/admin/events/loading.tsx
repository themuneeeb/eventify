import { Skeleton } from "@/components/ui/skeleton";

export default function AdminEventsLoading() {
  return (
    <div>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-36" />
      <Skeleton className="mt-1 h-4 w-48" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
