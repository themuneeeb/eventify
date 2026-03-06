import { Skeleton } from "../../../components/ui/skeleton";

// Dashboard loading — HCI: Feedback with layout-matching skeleton
export default function DashboardLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-5 w-72" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border-brand-sage/20 rounded-xl border bg-white p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="mt-4 h-8 w-16" />
          </div>
        ))}
      </div>

      <Skeleton className="mt-8 h-64 rounded-xl" />
    </div>
  );
}
