import type { Event, TicketType, Category, Location, User } from "@prisma/client";

export type EventWithDetails = Event & {
  category: Category;
  location: Location;
  organizer: Pick<User, "id" | "name" | "image">;
  ticketTypes: TicketType[];
  _count?: {
    orders: number;
  };
};

export type EventListItem = Pick<
  Event,
  | "id"
  | "title"
  | "slug"
  | "description"
  | "coverImage"
  | "startDate"
  | "endDate"
  | "status"
> & {
  category: Pick<Category, "id" | "name" | "slug">;
  location: Pick<Location, "id" | "name" | "city" | "country">;
  ticketTypes: Pick<TicketType, "id" | "price" | "kind">[];
};
