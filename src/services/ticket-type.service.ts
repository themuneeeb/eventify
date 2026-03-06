import { db } from "@/lib/db";

export async function addTicketType(
  eventId: string,
  data: {
    name: string;
    kind: string;
    price: number;
    quantity: number;
    description?: string;
    saleStart?: string;
    saleEnd?: string;
  }
) {
  return db.ticketType.create({
    data: {
      name: data.name,
      kind: data.kind as "FREE" | "STANDARD" | "VIP" | "EARLY_BIRD",
      price: data.kind === "FREE" ? 0 : data.price,
      quantity: data.quantity,
      description: data.description || null,
      saleStart: data.saleStart ? new Date(data.saleStart) : null,
      saleEnd: data.saleEnd ? new Date(data.saleEnd) : null,
      eventId,
    },
  });
}

export async function updateTicketType(
  ticketTypeId: string,
  data: {
    name?: string;
    kind?: string;
    price?: number;
    quantity?: number;
    description?: string;
    saleStart?: string;
    saleEnd?: string;
  }
) {
  return db.ticketType.update({
    where: { id: ticketTypeId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.kind && { kind: data.kind as "FREE" | "STANDARD" | "VIP" | "EARLY_BIRD" }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.description !== undefined && { description: data.description || null }),
      ...(data.saleStart !== undefined && {
        saleStart: data.saleStart ? new Date(data.saleStart) : null,
      }),
      ...(data.saleEnd !== undefined && {
        saleEnd: data.saleEnd ? new Date(data.saleEnd) : null,
      }),
    },
  });
}

export async function deleteTicketType(ticketTypeId: string) {
  return db.ticketType.delete({ where: { id: ticketTypeId } });
}
