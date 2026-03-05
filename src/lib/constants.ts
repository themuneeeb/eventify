export const APP_NAME = "Eventify";
export const APP_DESCRIPTION =
  "Discover, create, and manage events. Purchase tickets securely.";

export const ROLES = {
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  ATTENDEE: "ATTENDEE",
} as const;

export const TICKET_TYPES = {
  FREE: "FREE",
  STANDARD: "STANDARD",
  VIP: "VIP",
  EARLY_BIRD: "EARLY_BIRD",
} as const;

export const EVENT_STATUSES = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export const ITEMS_PER_PAGE = 12;
