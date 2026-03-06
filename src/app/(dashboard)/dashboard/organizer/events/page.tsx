import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getEventsByOrganizer } from "@/services/event.service";
import { OrganizerEventList } from "@/components/events/organizer-event-list";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events",
};

// SSR — always fresh data for dashboard
export const dynamic = "force-dynamic";

export default async function OrganizerEventsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rawEvents = await getEventsByOrganizer(session.user.id);

  // Serialize Decimal objects to plain numbers for Client Components
  const events = rawEvents.map((event) => ({
    ...event,
    ticketTypes: event.ticketTypes.map((tt) => ({
      ...tt,
      price: Number(tt.price),
    })),
  }));

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "My Events" },
        ]}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-charcoal text-2xl font-bold">My Events</h1>
          <p className="text-brand-soft-black mt-1">Manage and track all your events.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizer/events/new">
            <Plus className="h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      <div className="mt-6">
        <OrganizerEventList events={events} />
      </div>
    </div>
  );
}
