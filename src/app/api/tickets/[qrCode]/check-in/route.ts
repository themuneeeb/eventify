import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ qrCode: string }> }
) {
  const { qrCode } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ticket = await db.ticket.findUnique({
    where: { qrCode },
    include: {
      order: {
        include: {
          event: { select: { organizerId: true, title: true } },
        },
      },
      ticketType: { select: { name: true } },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  // Only organizer or admin can check in tickets
  const isOrganizer = ticket.order.event.organizerId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOrganizer && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (ticket.status === "USED") {
    return NextResponse.json(
      {
        error: "Ticket already used",
        checkedInAt: ticket.checkedInAt,
      },
      { status: 409 }
    );
  }

  if (ticket.status === "CANCELLED" || ticket.status === "EXPIRED") {
    return NextResponse.json(
      { error: `Ticket is ${ticket.status.toLowerCase()}` },
      { status: 400 }
    );
  }

  // Mark as used
  const updated = await db.ticket.update({
    where: { id: ticket.id },
    data: {
      status: "USED",
      checkedInAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    ticket: {
      id: updated.id,
      qrCode: updated.qrCode,
      status: updated.status,
      checkedInAt: updated.checkedInAt,
      eventTitle: ticket.order.event.title,
      ticketTypeName: ticket.ticketType.name,
    },
  });
}
