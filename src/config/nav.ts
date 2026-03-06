import {
  LayoutDashboard,
  Calendar,
  Ticket,
  BarChart3,
  Users,
  Settings,
  Tag,
  MapPin,
  Bell,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: `/${string}`;
  icon: LucideIcon;
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
  { label: "Overview", href: "/dashboard/organizer", icon: LayoutDashboard },
  { label: "My Events", href: "/dashboard/organizer/events", icon: Calendar },
  { label: "Analytics", href: "/dashboard/organizer/analytics", icon: BarChart3 },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/organizer/settings", icon: Settings },
];

export const attendeeSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/attendee", icon: LayoutDashboard },
  { label: "My Tickets", href: "/dashboard/attendee/tickets", icon: Ticket },
  { label: "My Orders", href: "/dashboard/attendee/orders", icon: Calendar },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const adminSidebarItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Events", href: "/dashboard/admin/events", icon: Calendar },
  { label: "Organizers", href: "/dashboard/admin/organizers", icon: Users },
  { label: "Categories", href: "/dashboard/admin/categories", icon: Tag },
  { label: "Locations", href: "/dashboard/admin/locations", icon: MapPin },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];
