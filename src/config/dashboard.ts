import {
  organizerSidebarItems,
  attendeeSidebarItems,
  adminSidebarItems,
  type NavItem,
} from "./nav";

export function getSidebarItemsByRole(role: string): NavItem[] {
  switch (role) {
    case "ADMIN":
      return adminSidebarItems;
    case "ORGANIZER":
      return organizerSidebarItems;
    case "ATTENDEE":
      return attendeeSidebarItems;
    default:
      return attendeeSidebarItems;
  }
}

export function getDashboardRedirectByRole(role: string): string {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "ORGANIZER":
      return "/dashboard/organizer";
    case "ATTENDEE":
      return "/dashboard/attendee";
    default:
      return "/dashboard/attendee";
  }
}
