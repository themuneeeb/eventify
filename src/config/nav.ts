export type NavIconKey =
  | "layoutDashboard"
  | "calendar"
  | "ticket"
  | "barChart3"
  | "settings"
  | "users"
  | "tag"
  | "shoppingCart"
  | "mapPin";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIconKey;
}

export interface PublicNavItem {
  label: string;
  href: string;
}

export const publicNavItems: PublicNavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Categories", href: "/categories" },
];

export const organizerSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/organizer", icon: "layoutDashboard" },
  { label: "My Events", href: "/dashboard/organizer/events", icon: "calendar" },
  { label: "Analytics", href: "/dashboard/organizer/analytics", icon: "barChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const attendeeSidebarItems: NavItem[] = [
  { label: "My Tickets", href: "/dashboard/attendee/tickets", icon: "ticket" },
  { label: "My Orders", href: "/dashboard/attendee/orders", icon: "shoppingCart" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const adminSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: "layoutDashboard" },
  { label: "Users", href: "/dashboard/admin/users", icon: "users" },
  { label: "All Events", href: "/dashboard/admin/events", icon: "calendar" },
  { label: "Categories", href: "/dashboard/admin/categories", icon: "tag" },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: "barChart3" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];
