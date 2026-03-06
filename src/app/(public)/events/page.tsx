import { Suspense } from "react";
import { getPublishedEvents } from "@/services/public-event.service";
import { getCategoriesWithCount } from "@/services/public-event.service";
import { EventGrid } from "@/components/events/event-grid";
import { EventSearch } from "@/components/events/event-search";
import { EventFilters } from "@/components/events/event-filters";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Events",
  description:
    "Discover upcoming events near you. Browse by category, search, and filter.",
};

// ISR — revalidate every 60 seconds
export const revalidate = 60;

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: string;
    order?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const [{ events, pagination }, categories] = await Promise.all([
    getPublishedEvents({
      search: params.search,
      category: params.category,
      location: params.location,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sortBy: params.sortBy,
      order: (params.order as "asc" | "desc") || "asc",
      page,
    }),
    getCategoriesWithCount(),
  ]);

  return (
    <div className="container-main py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-brand-charcoal text-3xl font-bold">Browse Events</h1>
        <p className="text-brand-soft-black mt-2">
          Discover {pagination.totalCount} upcoming event
          {pagination.totalCount !== 1 ? "s" : ""} near you.
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-6 max-w-md">
        <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
          <EventSearch />
        </Suspense>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
          <EventFilters categories={categories} />
        </Suspense>
      </div>

      {/* Results count */}
      {params.search && (
        <p className="text-brand-sage mb-4 text-sm">
          Showing results for &quot;{params.search}&quot;
        </p>
      )}

      {/* Event grid */}
      <EventGrid events={events} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            basePath="/events"
            searchParams={
              Object.fromEntries(
                Object.entries(params).filter(([key, val]) => key !== "page" && val)
              ) as Record<string, string>
            }
          />
        </div>
      )}
    </div>
  );
}
