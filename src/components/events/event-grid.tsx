import { EventCard } from "@/components/events/event-card";
import { EmptyState } from "@/components/shared/empty-state";
import { CalendarOff } from "lucide-react";

interface EventGridProps {
  events: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    startDate: Date;
    endDate: Date;
    category: { name: string; slug: string };
    location: { name: string; city: string; country: string };
    ticketTypes: {
      price: { toString(): string };
      kind: string;
      quantity: number;
      sold: number;
    }[];
  }[];
  emptyMessage?: string;
}

// RSC — renders on the server
export function EventGrid({
  events,
  emptyMessage = "No events found matching your criteria.",
}: EventGridProps) {
  if (events.length === 0) {
    return (
      <EmptyState icon={CalendarOff} title="No events found" description={emptyMessage} />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
