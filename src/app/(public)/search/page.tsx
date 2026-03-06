import { getPublishedEvents } from "@/services/public-event.service";
import { EventGrid } from "@/components/events/event-grid";
import { Pagination } from "@/components/ui/pagination";
import { EventSearch } from "@/components/events/event-search";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Events",
  description: "Search for events on Eventify.",
};

// SSR — search results are always fresh
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const query = sp.search || "";
  const page = parseInt(sp.page || "1", 10);

  const { events, pagination } = await getPublishedEvents({
    search: query,
    page,
  });

  return (
    <div className="container-main py-12">
      <Link
        href="/events"
        className="text-brand-soft-black hover:text-brand-orange mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Events
      </Link>

      <h1 className="text-brand-charcoal text-3xl font-bold">Search Events</h1>

      <div className="mt-6 max-w-md">
        <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
          <EventSearch />
        </Suspense>
      </div>

      {query && (
        <p className="text-brand-sage mt-6 text-sm">
          {pagination.totalCount} result{pagination.totalCount !== 1 ? "s" : ""} for
          &quot;{query}&quot;
        </p>
      )}

      <div className="mt-6">
        <EventGrid
          events={events}
          emptyMessage={
            query
              ? `No events found for "${query}". Try a different search term.`
              : "Enter a search term to find events."
          }
        />
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            basePath="/search"
            searchParams={{ search: query }}
          />
        </div>
      )}
    </div>
  );
}
