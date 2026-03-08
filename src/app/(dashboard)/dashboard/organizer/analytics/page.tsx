import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrganizerAnalytics } from "@/services/organizer-analytics.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { EventBreakdownChart } from "@/components/charts/event-breakdown-chart";
import { formatCurrency } from "@/lib/utils";
import { Calendar, DollarSign, Ticket, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Organizer Analytics" };
export const dynamic = "force-dynamic";

export default async function OrganizerAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const analytics = await getOrganizerAnalytics(session.user.id);

  const stats = [
    { label: "Total Events", value: analytics.totalEvents.toString(), icon: Calendar },
    { label: "Published", value: analytics.publishedEvents.toString(), icon: TrendingUp },
    {
      label: "Total Revenue",
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
    },
    {
      label: "Tickets Sold",
      value: `${analytics.totalTicketsSold}/${analytics.totalTickets}`,
      icon: Ticket,
    },
  ];

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "Analytics" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">Analytics</h1>
      <p className="text-brand-soft-black mt-1">Track your event performance.</p>

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

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={analytics.chartData} title="Your Revenue (Last 30 Days)" />
        <EventBreakdownChart data={analytics.eventBreakdown} />
      </div>

      {/* Event table breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-brand-sage/20 border-b">
                  <th className="text-brand-sage pb-3 font-medium">Event</th>
                  <th className="text-brand-sage pb-3 font-medium">Status</th>
                  <th className="text-brand-sage pb-3 font-medium">Sold / Total</th>
                  <th className="text-brand-sage pb-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.eventBreakdown.map((ev) => (
                  <tr key={ev.id} className="border-brand-sage/10 border-b last:border-0">
                    <td className="text-brand-charcoal py-3 font-medium">{ev.title}</td>
                    <td className="text-brand-soft-black py-3">{ev.status}</td>
                    <td className="text-brand-soft-black py-3">
                      {ev.sold} / {ev.total}
                    </td>
                    <td className="text-brand-orange py-3 font-medium">
                      {formatCurrency(ev.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
