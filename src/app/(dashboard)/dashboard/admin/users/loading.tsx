import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUsersLoading() {
  return (
    <div>
      <Skeleton className="h-5 w-32" />
      <Skeleton className="mt-4 h-8 w-48" />
      <Skeleton className="mt-1 h-4 w-36" />
      <div className="mt-6 flex gap-4">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>
      <Skeleton className="mt-6 h-96 w-full rounded-xl" />
    </div>
  );
}
