import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getEventById, isEventOwner } from "@/services/event.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Users } from "lucide-react";
import type { Metadata, Route } from "next";

export const metadata: Metadata = {
  title: "Attendees",
};

export const dynamic = "force-dynamic";

export default async function AttendeesPage({
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

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "My Events", href: "/dashboard/organizer/events" },
          {
            label: event.title,
            href: `/dashboard/organizer/events/${eventId}` as Route,
          },
          { label: "Attendees" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">
        Attendees — {event.title}
      </h1>

      <div className="mt-6">
        <EmptyState
          icon={Users}
          title="No attendees yet"
          description="Attendees will appear here once tickets are purchased. Full attendee management with CSV export will be available in Phase 6."
        />
      </div>
    </div>
  );
}
