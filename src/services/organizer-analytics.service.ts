import { db } from "@/lib/db";

export async function getOrganizerAnalytics(organizerId: string) {
  const events = await db.event.findMany({
    where: { organizerId },
    include: {
      ticketTypes: {
        select: { price: true, sold: true, quantity: true, kind: true },
      },
      orders: {
        where: { status: "COMPLETED" },
        select: { totalAmount: true, createdAt: true },
      },
    },
  });

  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length;

  let totalRevenue = 0;
  let totalTicketsSold = 0;
  let totalTickets = 0;

  events.forEach((e) => {
    e.ticketTypes.forEach((tt) => {
      totalTicketsSold += tt.sold;
      totalTickets += tt.quantity;
    });
    e.orders.forEach((o) => {
      totalRevenue += parseFloat(o.totalAmount.toString());
    });
  });

  // Revenue over time (last 30 days)
  const revenueByDay: Record<string, number> = {};
  const ticketsByDay: Record<string, number> = {};

  events.forEach((e) => {
    e.orders.forEach((o) => {
      const day = o.createdAt.toISOString().split("T")[0];
      revenueByDay[day] = (revenueByDay[day] || 0) + parseFloat(o.totalAmount.toString());
    });
  });

  const chartData: { date: string; revenue: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    chartData.push({ date: key, revenue: revenueByDay[key] || 0 });
  }

  // Per-event breakdown
  const eventBreakdown = events.map((e) => {
    const sold = e.ticketTypes.reduce((s, tt) => s + tt.sold, 0);
    const total = e.ticketTypes.reduce((s, tt) => s + tt.quantity, 0);
    const revenue = e.orders.reduce(
      (s, o) => s + parseFloat(o.totalAmount.toString()),
      0
    );
    return {
      id: e.id,
      title: e.title,
      status: e.status,
      sold,
      total,
      revenue,
    };
  });

  return {
    totalEvents,
    publishedEvents,
    totalRevenue,
    totalTicketsSold,
    totalTickets,
    chartData,
    eventBreakdown,
  };
}

export async function getEventAttendees(eventId: string) {
  return db.ticket.findMany({
    where: { order: { eventId } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      ticketType: { select: { name: true, kind: true, price: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
