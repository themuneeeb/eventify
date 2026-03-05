import type { Order, Ticket, TicketType, Event } from "@prisma/client";

export type OrderWithDetails = Order & {
  event: Pick<Event, "id" | "title" | "slug" | "coverImage" | "startDate">;
  tickets: (Ticket & {
    ticketType: Pick<TicketType, "id" | "name" | "kind" | "price">;
  })[];
};
