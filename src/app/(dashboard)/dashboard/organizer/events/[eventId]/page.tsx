import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getEventById, isEventOwner } from "@/services/event.service";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  Edit,
  Users,
  BarChart3,
  Calendar,
  MapPin,
  Ticket,
  DollarSign,
  ExternalLink,
} from "lucide-react";
import type { Metadata, Route } from "next";

export const metadata: Metadata = {
  title: "Event Details",
};

export const dynamic = "force-dynamic";

export default async function OrganizerEventDetailPage({
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

  const totalTickets = event.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0);
  const totalSold = event.ticketTypes.reduce((sum, tt) => sum + tt.sold, 0);
  const totalRevenue = event.ticketTypes.reduce(
    (sum, tt) => sum + tt.sold * parseFloat(tt.price.toString()),
    0
  );

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "My Events", href: "/dashboard/organizer/events" },
          { label: event.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-brand-charcoal text-2xl font-bold">{event.title}</h1>
            <EventStatusBadge status={event.status} />
          </div>
          <div className="text-brand-soft-black mt-2 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="text-brand-sage h-4 w-4" />
              {formatDateTime(event.startDate)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="text-brand-sage h-4 w-4" />
              {event.location.name}, {event.location.city}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {event.status === "PUBLISHED" && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${event.slug}` as Route} target="_blank">
                <ExternalLink className="h-4 w-4" /> View Public Page
              </Link>
            </Button>
          )}
          <Button size="sm" asChild>
            <Link href={`/dashboard/organizer/events/${eventId}/edit`}>
              <Edit className="h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Tickets Sold
            </CardTitle>
            <Ticket className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {totalSold}
              <span className="text-brand-sage text-sm font-normal">
                {" "}
                / {totalTickets}
              </span>
            </div>
            {totalTickets > 0 && (
              <div className="bg-brand-sage/20 mt-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-brand-orange h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min((totalSold / totalTickets) * 100, 100)}%`,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Revenue
            </CardTitle>
            <DollarSign className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {formatCurrency(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Orders
            </CardTitle>
            <Users className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {event._count.orders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Category
            </CardTitle>
            <BarChart3 className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-lg font-semibold">
              {event.category.name}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-brand-soft-black text-sm leading-relaxed whitespace-pre-wrap">
            {event.description}
          </p>
        </CardContent>
      </Card>

      {/* Ticket types */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Ticket Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-brand-sage/20 border-b">
                  <th className="text-brand-sage pb-3 font-medium">Name</th>
                  <th className="text-brand-sage pb-3 font-medium">Type</th>
                  <th className="text-brand-sage pb-3 font-medium">Price</th>
                  <th className="text-brand-sage pb-3 font-medium">Sold / Total</th>
                  <th className="text-brand-sage pb-3 font-medium">Available</th>
                </tr>
              </thead>
              <tbody>
                {event.ticketTypes.map((tt) => (
                  <tr key={tt.id} className="border-brand-sage/10 border-b last:border-0">
                    <td className="text-brand-charcoal py-3 font-medium">{tt.name}</td>
                    <td className="text-brand-soft-black py-3">{tt.kind}</td>
                    <td className="text-brand-orange py-3 font-medium">
                      {tt.kind === "FREE"
                        ? "Free"
                        : formatCurrency(parseFloat(tt.price.toString()))}
                    </td>
                    <td className="text-brand-soft-black py-3">
                      {tt.sold} / {tt.quantity}
                    </td>
                    <td className="text-brand-soft-black py-3">
                      {tt.quantity - tt.sold}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button variant="outline" className="justify-start" asChild>
          <Link href={`/dashboard/organizer/events/${eventId}/attendees`}>
            <Users className="h-4 w-4" /> View Attendees
          </Link>
        </Button>
        <Button variant="outline" className="justify-start" asChild>
          <Link href={`/dashboard/organizer/events/${eventId}/analytics`}>
            <BarChart3 className="h-4 w-4" /> View Analytics
          </Link>
        </Button>
      </div>
    </div>
  );
}
