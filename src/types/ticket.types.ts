import type { Ticket, TicketType, Order, Event } from "@prisma/client";

export type TicketWithDetails = Ticket & {
  ticketType: TicketType;
  order: Order & {
    event: Pick<
      Event,
      "id" | "title" | "slug" | "coverImage" | "startDate" | "endDate"
    > & {
      location: {
        name: string;
        city: string;
        country: string;
      };
    };
  };
};
