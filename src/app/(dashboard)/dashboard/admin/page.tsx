import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getPlatformStats,
  getPendingOrganizers,
  getRevenueOverTime,
  getTicketsSoldOverTime,
} from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PendingOrganizers } from "@/components/admin/pending-organizers";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { TicketsChart } from "@/components/charts/tickets-chart";
import { formatCurrency } from "@/lib/utils";
import { Users, Calendar, DollarSign, Ticket, Activity, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const [stats, pendingOrganizers, revenueData, ticketsData] = await Promise.all([
    getPlatformStats(),
    getPendingOrganizers(),
    getRevenueOverTime(30),
    getTicketsSoldOverTime(30),
  ]);

  const statCards = [
    { label: "Total Users", value: stats.totalUsers.toString(), icon: Users },
    { label: "Total Events", value: stats.totalEvents.toString(), icon: Calendar },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
    },
    { label: "Tickets Sold", value: stats.totalTicketsSold.toString(), icon: Ticket },
    {
      label: "Active Organizers",
      value: stats.activeOrganizers.toString(),
      icon: ShieldCheck,
    },
    { label: "Total Orders", value: stats.totalOrders.toString(), icon: Activity },
  ];

  return (
    <div>
      <h1 className="text-brand-charcoal text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-brand-soft-black mt-1">Platform overview and management.</p>

      {/* Pending approvals */}
      {pendingOrganizers.length > 0 && (
        <div className="mt-6">
          <PendingOrganizers organizers={pendingOrganizers} />
        </div>
      )}

      {/* Stats grid */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
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

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueChart data={revenueData} />
        <TicketsChart data={ticketsData} />
      </div>
    </div>
  );
}
