"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { deleteEventAction, toggleEventStatusAction } from "@/actions/event.actions";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Users,
  Ticket,
  Plus,
} from "lucide-react";

interface OrganizerEvent {
  id: string;
  title: string;
  slug: string;
  status: string;
  startDate: Date;
  endDate: Date;
  coverImage: string | null;
  category: { id: string; name: string; slug: string };
  location: { id: string; name: string; city: string; country: string };
  ticketTypes: {
    id: string;
    name: string;
    kind: string;
    price: { toString(): string };
    quantity: number;
    sold: number;
  }[];
  _count: { orders: number };
}

interface OrganizerEventListProps {
  events: OrganizerEvent[];
}

export function OrganizerEventList({ events }: OrganizerEventListProps) {
  const { addToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function handleDelete(eventId: string) {
    startTransition(async () => {
      const result = await deleteEventAction(eventId);
      setDeleteTarget(null);
      if (result?.error) {
        addToast({ type: "error", title: "Error", message: result.error });
      } else {
        addToast({ type: "success", title: "Event deleted" });
      }
    });
  }

  function handleToggleStatus(eventId: string, current: string) {
    const newStatus = current === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    startTransition(async () => {
      const result = await toggleEventStatusAction(
        eventId,
        newStatus as "DRAFT" | "PUBLISHED"
      );
      if (result?.error) {
        addToast({ type: "error", title: "Error", message: result.error });
      } else {
        addToast({
          type: "success",
          title: result?.success || "Status updated",
        });
      }
    });
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title="No events yet"
        description="Create your first event to start selling tickets."
        action={
          <Button asChild>
            <Link href="/dashboard/organizer/events/new">
              <Plus className="h-4 w-4" /> Create Event
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {events.map((event) => {
          const totalTickets = event.ticketTypes.reduce(
            (sum, tt) => sum + tt.quantity,
            0
          );
          const totalSold = event.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);

          return (
            <Card key={event.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  {/* Event info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/organizer/events/${event.id}`}
                        className="text-brand-charcoal hover:text-brand-orange text-lg font-semibold transition-colors"
                      >
                        {event.title}
                      </Link>
                      <EventStatusBadge status={event.status} />
                    </div>

                    <div className="text-brand-soft-black flex flex-wrap items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="text-brand-sage h-3.5 w-3.5" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="text-brand-sage h-3.5 w-3.5" />
                        {event.location.city}, {event.location.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Ticket className="text-brand-sage h-3.5 w-3.5" />
                        {totalSold}/{totalTickets} sold
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="text-brand-sage h-3.5 w-3.5" />
                        {event._count.orders} orders
                      </span>
                    </div>
                  </div>

                  {/* Actions — HCI: Consistency, clear iconography */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(event.id, event.status)}
                      disabled={isPending}
                      title={event.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    >
                      {event.status === "PUBLISHED" ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/organizer/events/${event.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(event.id)}
                      className="text-destructive hover:text-destructive"
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete confirmation — HCI: Error prevention */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone. All associated tickets and orders will also be removed."
        confirmLabel="Delete Event"
        variant="destructive"
        isLoading={isPending}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
      />
    </>
  );
}
