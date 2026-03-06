import { Skeleton } from "../components/ui/skeleton";

// Root loading — triggers Suspense during navigation (HCI: Feedback)
export default function Loading() {
  return (
    <div className="container-main py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
