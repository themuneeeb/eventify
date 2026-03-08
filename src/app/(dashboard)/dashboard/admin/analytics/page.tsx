import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getPlatformStats,
  getRevenueOverTime,
  getTicketsSoldOverTime,
} from "@/services/admin.service";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TicketsChart } from "@/components/charts/tickets-chart";
import { formatCurrency } from "@/lib/utils";
import { Users, Calendar, DollarSign, Ticket, TrendingUp, BarChart3 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Platform Analytics" };
export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const [stats, revenueData, ticketsData, topEvents] = await Promise.all([
    getPlatformStats(),
    getRevenueOverTime(30),
    getTicketsSoldOverTime(30),
    db.event.findMany({
      where: { status: "PUBLISHED" },
      include: {
        ticketTypes: { select: { sold: true, price: true, quantity: true } },
        organizer: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalRevenueToday =
    revenueData.length > 0 ? revenueData[revenueData.length - 1].revenue : 0;

  const totalTicketsToday =
    ticketsData.length > 0 ? ticketsData[ticketsData.length - 1].tickets : 0;

  // Top events by revenue
  const topByRevenue = topEvents
    .map((e) => ({
      title: e.title,
      organizer: e.organizer.name,
      revenue: e.ticketTypes.reduce(
        (s, tt) => s + tt.sold * parseFloat(tt.price.toString()),
        0
      ),
      sold: e.ticketTypes.reduce((s, tt) => s + tt.sold, 0),
      total: e.ticketTypes.reduce((s, tt) => s + tt.quantity, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Analytics" }]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">Platform Analytics</h1>
      <p className="text-brand-soft-black mt-1">Global performance metrics and trends.</p>

      {/* Today's highlights */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Revenue Today
            </CardTitle>
            <DollarSign className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {formatCurrency(totalRevenueToday)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Tickets Today
            </CardTitle>
            <Ticket className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {totalTicketsToday}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              All-Time Revenue
            </CardTitle>
            <TrendingUp className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {formatCurrency(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-brand-soft-black text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="text-brand-sage h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-brand-charcoal text-2xl font-bold">
              {stats.totalUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} title="Platform Revenue (30 Days)" />
        <TicketsChart data={ticketsData} title="Platform Tickets Sold (30 Days)" />
      </div>

      {/* Top events table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="text-brand-orange h-5 w-5" />
            Top Events by Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-brand-sage/20 border-b">
                  <th className="text-brand-sage pb-3 font-medium">Event</th>
                  <th className="text-brand-sage pb-3 font-medium">Organizer</th>
                  <th className="text-brand-sage pb-3 font-medium">Sold / Total</th>
                  <th className="text-brand-sage pb-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topByRevenue.map((ev, idx) => (
                  <tr key={idx} className="border-brand-sage/10 border-b last:border-0">
                    <td className="text-brand-charcoal py-3 font-medium">{ev.title}</td>
                    <td className="text-brand-soft-black py-3">{ev.organizer}</td>
                    <td className="text-brand-soft-black py-3">
                      {ev.sold} / {ev.total}
                    </td>
                    <td className="text-brand-orange py-3 font-medium">
                      {formatCurrency(ev.revenue)}
                    </td>
                  </tr>
                ))}
                {topByRevenue.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-brand-sage py-6 text-center">
                      No event data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
