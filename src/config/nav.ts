export type NavIconKey =
  | "layoutDashboard"
  | "calendar"
  | "ticket"
  | "barChart3"
  | "users"
  | "settings"
  | "tag"
  | "mapPin"
  | "bell";

export interface NavItem {
  label: string;
  href: `/${string}`;
  icon: NavIconKey;
}

export interface PublicNavItem {
  label: string;
  href: `/${string}`;
}

export const publicNavItems: PublicNavItem[] = [
  { label: "Events", href: "/events" },
  { label: "Categories", href: "/categories" },
];

export const organizerSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/organizer", icon: "layoutDashboard" },
  { label: "My Events", href: "/dashboard/organizer/events", icon: "calendar" },
  { label: "Analytics", href: "/dashboard/organizer/analytics", icon: "barChart3" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "bell" },
  { label: "Settings", href: "/dashboard/organizer/settings", icon: "settings" },
];

export const attendeeSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/attendee", icon: "layoutDashboard" },
  { label: "My Tickets", href: "/dashboard/attendee/tickets", icon: "ticket" },
  { label: "My Orders", href: "/dashboard/attendee/orders", icon: "calendar" },
  { label: "Notifications", href: "/dashboard/notifications", icon: "bell" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const adminSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: "layoutDashboard" },
  { label: "Users", href: "/dashboard/admin/users", icon: "users" },
  { label: "Events", href: "/dashboard/admin/events", icon: "calendar" },
  { label: "Organizers", href: "/dashboard/admin/organizers", icon: "users" },
  { label: "Categories", href: "/dashboard/admin/categories", icon: "tag" },
  { label: "Locations", href: "/dashboard/admin/locations", icon: "mapPin" },
  { label: "Settings", href: "/dashboard/admin/settings", icon: "settings" },
];
