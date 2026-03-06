import {
  organizerSidebarItems,
  attendeeSidebarItems,
  adminSidebarItems,
  type NavItem,
} from "@/config/nav";

export function getSidebarItemsByRole(role: string): NavItem[] {
  switch (role) {
    case "ADMIN":
      return adminSidebarItems;
    case "ORGANIZER":
      return organizerSidebarItems;
    default:
      return [];
  }
}

export function getDashboardRedirectByRole(role: string) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin" as const;
    case "ORGANIZER":
      return "/dashboard/organizer" as const;
    case "ATTENDEE":
      return "/events" as const; // ← attendees go to browse events
    default:
      return "/events" as const;
  }
}
