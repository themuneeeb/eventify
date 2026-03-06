import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTicketsByUser } from "@/services/order.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Calendar, MapPin, Ticket, QrCode } from "lucide-react";
import type { Metadata } from "next";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "My Tickets",
};

export const dynamic = "force-dynamic";

const statusStyles: Record<string, "default" | "success" | "destructive" | "outline"> = {
  VALID: "success",
  USED: "outline",
  CANCELLED: "destructive",
  EXPIRED: "secondary" as any,
};

export default async function AttendeeTicketsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tickets = await getTicketsByUser(session.user.id);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/attendee" },
          { label: "My Tickets" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">My Tickets</h1>
      <p className="text-brand-soft-black mt-1">All your event tickets in one place.</p>

      <div className="mt-6">
        {tickets.length === 0 ? (
          <EmptyState
            icon={Ticket}
            title="No tickets yet"
            description="Your purchased tickets will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link
                        href={`/events/${ticket.order.event.slug}` as Route}
                        className="text-brand-charcoal hover:text-brand-orange font-semibold transition-colors"
                      >
                        {ticket.order.event.title}
                      </Link>
                      <p className="text-brand-orange mt-1 text-sm font-medium">
                        {ticket.ticketType.name}
                      </p>
                    </div>
                    <Badge variant={statusStyles[ticket.status] || "outline"}>
                      {ticket.status}
                    </Badge>
                  </div>

                  <div className="text-brand-soft-black mt-3 space-y-1 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="text-brand-sage h-3 w-3" />
                      {formatDateTime(ticket.order.event.startDate)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="text-brand-sage h-3 w-3" />
                      {ticket.order.event.location.name},{" "}
                      {ticket.order.event.location.city}
                    </span>
                  </div>

                  <div className="border-brand-sage/10 mt-3 flex items-center justify-between border-t pt-3">
                    <span className="text-brand-sage flex items-center gap-1 text-xs">
                      <QrCode className="h-3 w-3" />
                      {ticket.qrCode}
                    </span>
                    <span className="text-brand-charcoal text-sm font-medium">
                      {parseFloat(ticket.ticketType.price.toString()) === 0
                        ? "Free"
                        : formatCurrency(parseFloat(ticket.ticketType.price.toString()))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
