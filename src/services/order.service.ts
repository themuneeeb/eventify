import { db } from "@/lib/db";
import { generateTicketCode } from "@/lib/utils";
import { generateQRCode } from "@/lib/qr";

// ─── CREATE ORDER + TICKETS ──────────────────

export async function createOrderFromCheckout(data: {
  userId: string;
  eventId: string;
  stripeSessionId: string;
  stripePaymentId?: string;
  totalAmount: number;
  currency: string;
  items: { ticketTypeId: string; quantity: number }[];
}) {
  return db.$transaction(async (tx) => {
    // 1. Create the order
    const order = await tx.order.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        stripeSessionId: data.stripeSessionId,
        stripePaymentId: data.stripePaymentId || null,
        totalAmount: data.totalAmount,
        currency: data.currency,
        status: "COMPLETED",
      },
    });

    // 2. Create tickets and update sold count for each ticket type
    for (const item of data.items) {
      // Update sold count
      await tx.ticketType.update({
        where: { id: item.ticketTypeId },
        data: { sold: { increment: item.quantity } },
      });

      // Create individual tickets
      for (let i = 0; i < item.quantity; i++) {
        const qrCode = generateTicketCode();
        const qrDataUrl = await generateQRCode(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/tickets/${qrCode}/check-in`
        );

        await tx.ticket.create({
          data: {
            userId: data.userId,
            orderId: order.id,
            ticketTypeId: item.ticketTypeId,
            qrCode,
            status: "VALID",
          },
        });
      }
    }

    return order;
  });
}

// ─── GET ORDER BY STRIPE SESSION ─────────────

const orderWithFullIncludes = {
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
} as const;

export async function getOrderByStripeSession(stripeSessionId: string) {
  return db.order.findUnique({
    where: { stripeSessionId },
    include: orderWithFullIncludes,
  });
}

export async function getOrderById(id: string) {
  return db.order.findUnique({
    where: { id },
    include: orderWithFullIncludes,
  });
}

// ─── GET ORDERS BY USER ──────────────────────

export async function getOrdersByUser(userId: string) {
  return db.order.findMany({
    where: { userId },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          startDate: true,
          location: {
            select: { name: true, city: true, country: true },
          },
        },
      },
      tickets: {
        include: {
          ticketType: {
            select: { name: true, kind: true, price: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

// ─── GET TICKETS BY USER ─────────────────────

export async function getTicketsByUser(userId: string) {
  return db.ticket.findMany({
    where: { userId },
    include: {
      ticketType: true,
      order: {
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
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}
