import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="container-main py-8">
      <Skeleton className="h-4 w-28" />
      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-[16/9] w-full rounded-xl" />
          <Skeleton className="mt-6 h-6 w-20 rounded-full" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <Skeleton className="mt-3 h-4 w-48" />
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
          <Skeleton className="mt-8 h-6 w-48" />
          <Skeleton className="mt-3 h-32 w-full" />
        </div>
        <div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
