import { auth } from "@/lib/auth";
import type { Route } from "next";
import { redirect, notFound } from "next/navigation";
import { getEventById, isEventOwner } from "@/services/event.service";
import { getEventAttendees } from "@/services/organizer-analytics.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Ticket, DollarSign, Users, BarChart3, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Event Analytics" };
export const dynamic = "force-dynamic";

export default async function EventAnalyticsPage({
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

  const attendees = await getEventAttendees(eventId);

  const totalSold = event.ticketTypes.reduce((s, tt) => s + tt.sold, 0);
  const totalQty = event.ticketTypes.reduce((s, tt) => s + tt.quantity, 0);
  const totalRevenue = event.ticketTypes.reduce(
    (s, tt) => s + tt.sold * parseFloat(tt.price.toString()),
    0
  );
  const checkedIn = attendees.filter((a) => a.status === "USED").length;
  const sellThroughRate = totalQty > 0 ? ((totalSold / totalQty) * 100).toFixed(1) : "0";
  const checkInRate = totalSold > 0 ? ((checkedIn / totalSold) * 100).toFixed(1) : "0";

  // Group attendees by ticket type for breakdown
  const ticketBreakdown = event.ticketTypes.map((tt) => {
    const ttAttendees = attendees.filter((a) => a.ticketType.name === tt.name);
    const ttCheckedIn = ttAttendees.filter((a) => a.status === "USED").length;
    return {
      name: tt.name,
      kind: tt.kind,
      price: parseFloat(tt.price.toString()),
      sold: tt.sold,
      total: tt.quantity,
      revenue: tt.sold * parseFloat(tt.price.toString()),
      checkedIn: ttCheckedIn,
    };
  });

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
          { label: "Analytics" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">
        Analytics — {event.title}
      </h1>
      <p className="text-brand-soft-black mt-1">
        Detailed performance metrics for this event.
      </p>

      {/* Stats grid */}
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
              <span className="text-brand-sage text-sm font-normal"> / {totalQty}</span>
            </div>
            {totalQty > 0 && (
              <div className="bg-brand-sage/20 mt-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-brand-orange h-full rounded-full transition-all"
                  style={{ width: `${Math.min((totalSold / totalQty) * 100, 100)}%` }}
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
              Sell-Through Rate
            </CardTitle>
            <TrendingUp className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {sellThroughRate}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Check-In Rate
            </CardTitle>
            <Users className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">{checkInRate}%</div>
            <p className="text-brand-sage text-xs">
              {checkedIn} of {totalSold} checked in
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket type breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="text-brand-orange h-5 w-5" />
            Ticket Type Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-brand-sage/20 border-b">
                  <th className="text-brand-sage pb-3 font-medium">Type</th>
                  <th className="text-brand-sage pb-3 font-medium">Kind</th>
                  <th className="text-brand-sage pb-3 font-medium">Price</th>
                  <th className="text-brand-sage pb-3 font-medium">Sold / Total</th>
                  <th className="text-brand-sage pb-3 font-medium">Revenue</th>
                  <th className="text-brand-sage pb-3 font-medium">Checked In</th>
                  <th className="text-brand-sage pb-3 font-medium">Availability</th>
                </tr>
              </thead>
              <tbody>
                {ticketBreakdown.map((tt) => {
                  const available = tt.total - tt.sold;
                  const pct =
                    tt.total > 0 ? ((tt.sold / tt.total) * 100).toFixed(0) : "0";
                  return (
                    <tr
                      key={tt.name}
                      className="border-brand-sage/10 border-b last:border-0"
                    >
                      <td className="text-brand-charcoal py-3 font-medium">{tt.name}</td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs">
                          {tt.kind}
                        </Badge>
                      </td>
                      <td className="text-brand-soft-black py-3">
                        {tt.kind === "FREE" ? "Free" : formatCurrency(tt.price)}
                      </td>
                      <td className="text-brand-soft-black py-3">
                        {tt.sold} / {tt.total}
                      </td>
                      <td className="text-brand-orange py-3 font-medium">
                        {formatCurrency(tt.revenue)}
                      </td>
                      <td className="text-brand-soft-black py-3">{tt.checkedIn}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="bg-brand-sage/20 h-2 w-16 overflow-hidden rounded-full">
                            <div
                              className="bg-brand-orange h-full rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-brand-sage text-xs">
                            {available} left
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
