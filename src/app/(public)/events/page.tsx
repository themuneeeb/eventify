import { Skeleton } from "@/components/ui/skeleton";

// Placeholder — real implementation in Phase 4 (ISR, revalidate: 60)
export default function EventsPage() {
  return (
    <div className="container-main py-12">
      <h1 className="text-brand-charcoal text-3xl font-bold">Browse Events</h1>
      <p className="text-brand-soft-black mt-2">Discover upcoming events near you.</p>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-brand-sage/20 rounded-xl border bg-white p-4">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <Skeleton className="mt-4 h-8 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
