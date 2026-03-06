import { notFound } from "next/navigation";
import Link from "next/link";
import { getEventsByCategory } from "@/services/public-event.service";
import { EventGrid } from "@/components/events/event-grid";
import { Pagination } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getEventsByCategory(slug, 1);

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.name} Events`,
    description: `Browse upcoming ${category.name.toLowerCase()} events on Eventify.`,
  };
}

export default async function CategoryEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);

  const { events, category, pagination } = await getEventsByCategory(slug, page);

  if (!category) notFound();

  return (
    <div className="container-main py-12">
      <Link
        href="/categories"
        className="text-brand-soft-black hover:text-brand-orange mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> All Categories
      </Link>

      <h1 className="text-brand-charcoal text-3xl font-bold">{category.name} Events</h1>
      <p className="text-brand-soft-black mt-2">
        {pagination.totalCount} upcoming event
        {pagination.totalCount !== 1 ? "s" : ""} in {category.name.toLowerCase()}.
      </p>

      <div className="mt-8">
        <EventGrid
          events={events}
          emptyMessage={`No upcoming ${category.name.toLowerCase()} events right now. Check back later!`}
        />
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            basePath={`/categories/${slug}`}
          />
        </div>
      )}
    </div>
  );
}
