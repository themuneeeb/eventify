import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Ticket, DollarSign, Users, Plus, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Dashboard",
};

export const dynamic = "force-dynamic";

export default async function OrganizerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // Fetch organizer stats in parallel
  const [eventCount, events] = await Promise.all([
    db.event.count({ where: { organizerId: session.user.id } }),
    db.event.findMany({
      where: { organizerId: session.user.id },
      include: {
        ticketTypes: { select: { sold: true, price: true, quantity: true } },
        _count: { select: { orders: true } },
      },
    }),
  ]);

  const totalTicketsSold = events.reduce(
    (sum, e) => sum + e.ticketTypes.reduce((s, tt) => s + tt.sold, 0),
    0
  );

  const totalRevenue = events.reduce(
    (sum, e) =>
      sum +
      e.ticketTypes.reduce((s, tt) => s + tt.sold * parseFloat(tt.price.toString()), 0),
    0
  );

  const totalOrders = events.reduce((sum, e) => sum + e._count.orders, 0);

  const stats = [
    { label: "Total Events", value: eventCount.toString(), icon: Calendar },
    { label: "Tickets Sold", value: totalTicketsSold.toString(), icon: Ticket },
    { label: "Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { label: "Total Orders", value: totalOrders.toString(), icon: Users },
  ];

  // Recent events for quick access
  const recentEvents = events
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-charcoal text-2xl font-bold">
            Welcome back, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-brand-soft-black mt-1">
            Here&apos;s an overview of your events.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/organizer/events/new">
            <Plus className="h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      {/* Stats grid — HCI: Visibility of system status */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-brand-soft-black text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="text-brand-sage h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-brand-charcoal text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent events */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Events</CardTitle>
          <Button variant="link" size="sm" asChild>
            <Link href="/dashboard/organizer/events">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentEvents.length === 0 ? (
            <p className="text-brand-soft-black text-sm">
              No events yet. Create your first event to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {recentEvents.map((event) => {
                const sold = event.ticketTypes.reduce((s, tt) => s + tt.sold, 0);
                const total = event.ticketTypes.reduce((s, tt) => s + tt.quantity, 0);
                return (
                  <Link
                    key={event.id}
                    href={`/dashboard/organizer/events/${event.id}`}
                    className="border-brand-sage/10 hover:bg-brand-cream/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                  >
                    <div>
                      <p className="text-brand-charcoal font-medium">{event.title}</p>
                      <p className="text-brand-sage text-xs">
                        {event.status} · {sold}/{total} tickets sold
                      </p>
                    </div>
                    <ArrowRight className="text-brand-sage h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
