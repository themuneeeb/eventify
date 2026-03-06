import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllCategories, getAllLocations } from "@/services/event.service";
import { EventForm } from "@/components/events/event-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Event",
};

export default async function CreateEventPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  if (session.user.role !== "ORGANIZER" && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

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
          { label: "Create Event" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-brand-charcoal text-2xl font-bold">Create New Event</h1>
        <p className="text-brand-soft-black mt-1">
          Fill in the details below to create your event.
        </p>
      </div>

      <EventForm categories={categories} locations={locations} />
    </div>
  );
}
