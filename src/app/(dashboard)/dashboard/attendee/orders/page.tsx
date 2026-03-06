import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getOrdersByUser } from "@/services/order.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Calendar, ShoppingCart, Ticket } from "lucide-react";
import type { Metadata } from "next";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

export const dynamic = "force-dynamic";

const orderStatusStyles: Record<
  string,
  "default" | "success" | "destructive" | "outline"
> = {
  PENDING: "default",
  COMPLETED: "success",
  CANCELLED: "destructive",
  REFUNDED: "outline",
};

export default async function AttendeeOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const orders = await getOrdersByUser(session.user.id);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/attendee" },
          { label: "My Orders" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">My Orders</h1>
      <p className="text-brand-soft-black mt-1">
        Your purchase history and order details.
      </p>

      <div className="mt-6">
        {orders.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="No orders yet"
            description="Your purchase history will appear here."
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/events/${order.event.slug}` as Route}
                          className="text-brand-charcoal hover:text-brand-orange font-semibold transition-colors"
                        >
                          {order.event.title}
                        </Link>
                        <Badge variant={orderStatusStyles[order.status] || "outline"}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-brand-soft-black mt-1 flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="text-brand-sage h-3 w-3" />
                          {formatDate(order.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Ticket className="text-brand-sage h-3 w-3" />
                          {order.tickets.length} ticket
                          {order.tickets.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-brand-orange text-lg font-bold">
                        {parseFloat(order.totalAmount.toString()) === 0
                          ? "Free"
                          : formatCurrency(parseFloat(order.totalAmount.toString()))}
                      </p>
                      <p className="text-brand-sage text-xs">{order.orderNumber}</p>
                    </div>
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
