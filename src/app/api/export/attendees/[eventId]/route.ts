import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getEventAttendees } from "@/services/organizer-analytics.service";
import { isEventOwner } from "@/services/event.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = await isEventOwner(eventId, session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const attendees = await getEventAttendees(eventId);

  // Build CSV
  const headers = [
    "Name",
    "Email",
    "Ticket Type",
    "Price",
    "QR Code",
    "Status",
    "Checked In",
  ];
  const rows = attendees.map((a) => [
    a.user.name || "N/A",
    a.user.email || "N/A",
    a.ticketType.name,
    parseFloat(a.ticketType.price.toString()).toFixed(2),
    a.qrCode,
    a.status,
    a.checkedInAt ? a.checkedInAt.toISOString() : "No",
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="attendees-${eventId}.csv"`,
    },
  });
}
