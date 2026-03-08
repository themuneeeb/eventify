import { Skeleton } from "@/components/ui/skeleton";

export default function AdminCategoriesLoading() {
  return (
    <div>
      <Skeleton className="h-5 w-48" />
      <Skeleton className="mt-4 h-8 w-64" />
      <Skeleton className="mt-1 h-4 w-56" />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Skeleton className="h-80 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  );
}
