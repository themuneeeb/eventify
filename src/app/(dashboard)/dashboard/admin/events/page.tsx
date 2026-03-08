import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EventStatusBadge } from "@/components/events/event-status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { formatDate, formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Calendar, MapPin, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "All Events — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);
  const pageSize = 15;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (sp.status) where.status = sp.status;

  const [events, total] = await Promise.all([
    db.event.findMany({
      where,
      include: {
        organizer: { select: { name: true, email: true } },
        category: { select: { name: true } },
        location: { select: { city: true, country: true } },
        ticketTypes: { select: { sold: true, quantity: true, price: true } },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.event.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Admin", href: "/dashboard/admin" }, { label: "All Events" }]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">All Events</h1>
      <p className="text-brand-soft-black mt-1">{total} events on the platform.</p>

      {/* Status filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {["", "DRAFT", "PUBLISHED", "CANCELLED", "COMPLETED"].map((s) => (
          <a
            key={s}
            href={`/dashboard/admin/events${s ? `?status=${s}` : ""}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              (sp.status || "") === s
                ? "bg-brand-orange text-white"
                : "bg-brand-cream text-brand-soft-black hover:bg-brand-sage/20"
            }`}
          >
            {s || "All"}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {events.map((event) => {
          const totalSold = event.ticketTypes.reduce((s, tt) => s + tt.sold, 0);
          const totalQty = event.ticketTypes.reduce((s, tt) => s + tt.quantity, 0);
          const revenue = event.ticketTypes.reduce(
            (s, tt) => s + tt.sold * parseFloat(tt.price.toString()),
            0
          );

          return (
            <Card key={event.id}>
              <CardContent className="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/organizer/events/${event.id}`}
                        className="text-brand-charcoal hover:text-brand-orange font-semibold transition-colors"
                      >
                        {event.title}
                      </Link>
                      <EventStatusBadge status={event.status} />
                      <Badge variant="secondary" className="text-xs">
                        {event.category.name}
                      </Badge>
                    </div>
                    <div className="text-brand-soft-black flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <User className="text-brand-sage h-3 w-3" />
                        {event.organizer.name} ({event.organizer.email})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="text-brand-sage h-3 w-3" />
                        {formatDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="text-brand-sage h-3 w-3" />
                        {event.location.city}, {event.location.country}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-brand-orange font-medium">
                      {formatCurrency(revenue)}
                    </p>
                    <p className="text-brand-sage text-xs">
                      {totalSold}/{totalQty} sold · {event._count.orders} orders
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/admin/events"
            searchParams={sp.status ? { status: sp.status } : undefined}
          />
        </div>
      )}
    </div>
  );
}
