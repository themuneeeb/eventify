import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Calendar, Ticket, DollarSign, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizerDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const organizerId = session.user.id;

  // Fetch all stats in parallel
  const [events, ticketAggregates, orderAggregates] = await Promise.all([
    db.event.count({ where: { organizerId } }),
    db.ticketType.aggregate({
      where: { event: { organizerId } },
      _sum: { sold: true },
    }),
    db.order.aggregate({
      where: { event: { organizerId }, status: "COMPLETED" },
      _sum: { totalAmount: true },
      _count: { _all: true },
    }),
  ]);

  // Get unique attendees count
  const uniqueAttendees = await db.order.findMany({
    where: { event: { organizerId }, status: "COMPLETED" },
    select: { userId: true },
    distinct: ["userId"],
  });

  const totalEvents = events;
  const ticketsSold = ticketAggregates._sum.sold ?? 0;
  const revenue = Number(orderAggregates._sum.totalAmount ?? 0);
  const attendees = uniqueAttendees.length;

  const stats = [
    { label: "Total Events", value: totalEvents.toString(), icon: Calendar },
    { label: "Tickets Sold", value: ticketsSold.toString(), icon: Ticket },
    { label: "Revenue", value: formatCurrency(revenue), icon: DollarSign },
    { label: "Attendees", value: attendees.toString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="text-brand-charcoal text-2xl font-bold">Organizer Dashboard</h1>
      <p className="text-brand-soft-black mt-2">
        Manage your events and track performance.
      </p>

      {/* Stats grid — HCI: Visibility of system status */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
