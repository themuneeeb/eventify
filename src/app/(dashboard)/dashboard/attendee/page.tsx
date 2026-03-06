import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Ticket, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AttendeeDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [ticketCount, upcomingCount, pastCount] = await Promise.all([
    db.ticket.count({ where: { userId: session.user.id } }),
    db.ticket.count({
      where: {
        userId: session.user.id,
        status: "VALID",
        order: { event: { startDate: { gte: new Date() } } },
      },
    }),
    db.ticket.count({
      where: {
        userId: session.user.id,
        order: { event: { endDate: { lt: new Date() } } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Tickets", value: ticketCount.toString(), icon: Ticket },
    { label: "Upcoming Events", value: upcomingCount.toString(), icon: Calendar },
    { label: "Past Events", value: pastCount.toString(), icon: Clock },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-charcoal text-2xl font-bold">
            Welcome back, {session.user.name?.split(" ")[0]}!
          </h1>
          <p className="text-brand-soft-black mt-1">Here&apos;s your event activity.</p>
        </div>
        <Button asChild>
          <Link href="/events">
            Browse Events <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/dashboard/attendee/tickets">
            <Ticket className="h-4 w-4" /> View My Tickets
          </Link>
        </Button>
        <Button variant="outline" className="justify-start" asChild>
          <Link href="/dashboard/attendee/orders">
            <Calendar className="h-4 w-4" /> View Order History
          </Link>
        </Button>
      </div>
    </div>
  );
}
