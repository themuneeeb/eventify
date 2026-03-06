import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import {
  getEventById,
  isEventOwner,
  getAllCategories,
  getAllLocations,
} from "@/services/event.service";
import { EventEditForm } from "@/components/events/event-edit-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { Metadata, Route } from "next";

export const metadata: Metadata = {
  title: "Edit Event",
};

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const event = await getEventById(eventId);
  if (!event) notFound();

  const isOwner = await isEventOwner(eventId, session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") redirect("/dashboard");

  const [categories, locations] = await Promise.all([
    getAllCategories(),
    getAllLocations(),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "My Events", href: "/dashboard/organizer/events" },
          {
            label: event.title,
            href: `/dashboard/organizer/events/${eventId}` as Route,
          },
          { label: "Edit" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-brand-charcoal text-2xl font-bold">Edit: {event.title}</h1>
        <p className="text-brand-soft-black mt-1">
          Update the details of your event below.
        </p>
      </div>

      <EventEditForm
        event={{
          id: event.id,
          title: event.title,
          description: event.description,
          categoryId: event.categoryId,
          locationId: event.locationId,
          startDate: event.startDate,
          endDate: event.endDate,
          coverImage: event.coverImage,
          status: event.status,
        }}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}
