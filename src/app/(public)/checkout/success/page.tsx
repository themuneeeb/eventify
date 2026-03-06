import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrderByStripeSession } from "@/services/order.service";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Ticket,
  Download,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Purchase Confirmed",
};

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; order_id?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  let order;

  if (sp.session_id) {
    order = await getOrderByStripeSession(sp.session_id);
  } else if (sp.order_id) {
    order = await db.order.findUnique({
      where: { id: sp.order_id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            slug: true,
            coverImage: true,
            startDate: true,
            endDate: true,
            location: {
              select: { name: true, city: true, country: true },
            },
          },
        },
        tickets: {
          include: {
            ticketType: {
              select: { id: true, name: true, kind: true, price: true },
            },
          },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  // If order doesn't exist yet (webhook hasn't fired), show a pending state
  if (!order) {
    return (
      <div className="container-main flex flex-col items-center justify-center py-24 text-center">
        <div className="border-brand-sage/20 border-t-brand-orange h-12 w-12 animate-spin rounded-full border-4" />
        <h1 className="text-brand-charcoal mt-6 text-2xl font-bold">
          Processing Your Order...
        </h1>
        <p className="text-brand-soft-black mt-2">
          Your payment is being processed. This page will update automatically.
        </p>
        <p className="text-brand-sage mt-4 text-sm">
          If this takes more than a minute, check your email for confirmation.
        </p>
        <meta httpEquiv="refresh" content="5" />
      </div>
    );
  }

  // Verify ownership
  if (order.userId !== session.user.id) {
    redirect("/dashboard");
  }

  const totalAmount = parseFloat(order.totalAmount.toString());

  return (
    <div className="container-main py-12">
      <div className="mx-auto max-w-2xl">
        {/* Success header — HCI: Clear feedback */}
        <div className="mb-8 text-center">
          <div className="bg-success/10 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
            <CheckCircle className="text-success h-10 w-10" />
          </div>
          <h1 className="text-brand-charcoal mt-4 text-3xl font-bold">
            Purchase Confirmed!
          </h1>
          <p className="text-brand-soft-black mt-2">
            Your tickets have been booked successfully.
          </p>
        </div>

        {/* Order details */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order Details</CardTitle>
              <Badge variant="success">Confirmed</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event info */}
            <div className="bg-brand-off-white rounded-lg p-4">
              <h3 className="text-brand-charcoal text-lg font-semibold">
                {order.event.title}
              </h3>
              <div className="text-brand-soft-black mt-2 space-y-1.5 text-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="text-brand-sage h-4 w-4" />
                  {formatDateTime(order.event.startDate)}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="text-brand-sage h-4 w-4" />
                  {order.event.location.name}, {order.event.location.city},{" "}
                  {order.event.location.country}
                </span>
              </div>
            </div>

            {/* Tickets */}
            <div>
              <h4 className="text-brand-charcoal mb-3 flex items-center gap-2 text-sm font-semibold">
                <Ticket className="text-brand-orange h-4 w-4" />
                Your Tickets ({order.tickets.length})
              </h4>
              <div className="space-y-2">
                {order.tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-brand-sage/20 flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="text-brand-charcoal text-sm font-medium">
                        {ticket.ticketType.name}
                      </p>
                      <p className="text-brand-sage text-xs">Code: {ticket.qrCode}</p>
                    </div>
                    <Badge variant="outline">{ticket.status}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-brand-sage/20 flex items-center justify-between border-t pt-4">
              <span className="text-brand-charcoal font-semibold">Total Paid</span>
              <span className="text-brand-orange text-xl font-bold">
                {totalAmount === 0 ? "Free" : formatCurrency(totalAmount)}
              </span>
            </div>

            {/* Order reference */}
            <div className="bg-brand-cream/50 text-brand-sage rounded-lg p-3 text-center text-xs">
              Order Reference: {order.orderNumber}
            </div>
          </CardContent>
        </Card>

        {/* Next actions — HCI: Clear next steps */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button asChild>
            <Link href="/dashboard/attendee/tickets">
              <Ticket className="h-4 w-4" /> View My Tickets
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">
              <ArrowRight className="h-4 w-4" /> Browse More Events
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
