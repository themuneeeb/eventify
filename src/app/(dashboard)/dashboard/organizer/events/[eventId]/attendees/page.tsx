import { auth } from "@/lib/auth";
import type { Route } from "next";
import { redirect, notFound } from "next/navigation";
import { getEventById, isEventOwner } from "@/services/event.service";
import { getEventAttendees } from "@/services/organizer-analytics.service";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Users, Download, QrCode } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Attendees" };
export const dynamic = "force-dynamic";

export default async function AttendeesPage({
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

  const checkedIn = attendees.filter((a) => a.status === "USED").length;

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
          { label: "Attendees" },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-brand-charcoal text-2xl font-bold">
            Attendees — {event.title}
          </h1>
          <p className="text-brand-soft-black mt-1">
            {attendees.length} total · {checkedIn} checked in
          </p>
        </div>
        {attendees.length > 0 && (
          <Button variant="outline" asChild>
            <a href={`/api/export/attendees/${eventId}`} download>
              <Download className="h-4 w-4" /> Export CSV
            </a>
          </Button>
        )}
      </div>

      <div className="mt-6">
        {attendees.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No attendees yet"
            description="Attendees will appear here once tickets are purchased."
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-brand-sage/20 bg-brand-off-white border-b">
                      <th className="text-brand-sage px-4 py-3 font-medium">Attendee</th>
                      <th className="text-brand-sage px-4 py-3 font-medium">
                        Ticket Type
                      </th>
                      <th className="text-brand-sage px-4 py-3 font-medium">QR Code</th>
                      <th className="text-brand-sage px-4 py-3 font-medium">Status</th>
                      <th className="text-brand-sage px-4 py-3 font-medium">
                        Checked In
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.map((a) => (
                      <tr
                        key={a.id}
                        className="border-brand-sage/10 border-b last:border-0"
                      >
                        <td className="px-4 py-3">
                          <p className="text-brand-charcoal font-medium">
                            {a.user.name || "—"}
                          </p>
                          <p className="text-brand-sage text-xs">{a.user.email}</p>
                        </td>
                        <td className="text-brand-soft-black px-4 py-3">
                          {a.ticketType.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-brand-sage flex items-center gap-1 text-xs">
                            <QrCode className="h-3 w-3" /> {a.qrCode}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              a.status === "VALID"
                                ? "success"
                                : a.status === "USED"
                                  ? "outline"
                                  : "destructive"
                            }
                          >
                            {a.status}
                          </Badge>
                        </td>
                        <td className="text-brand-sage px-4 py-3 text-xs">
                          {a.checkedInAt ? formatDateTime(a.checkedInAt) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
