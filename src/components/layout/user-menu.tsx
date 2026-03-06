"use client";

import Link from "next/link";
import type { Route } from "next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "../../components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../../components/ui/avatar";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import { getDashboardRedirectByRole } from "../../config/dashboard";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}
import { Badge } from "@/components/ui/badge";
import { signOutAction } from "@/actions/auth.actions";
export function UserMenu({ user }: UserMenuProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const dashboardHref = getDashboardRedirectByRole(user.role || "ATTENDEE");

  const roleLabelMap: Record<string, string> = {
    ADMIN: "Admin",
    ORGANIZER: "Organizer",
    ATTENDEE: "Attendee",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="focus:ring-brand-orange flex items-center gap-2 rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="User menu"
        >
          <Avatar className="h-8 w-8">
            {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="text-brand-charcoal text-sm font-medium">{user.name}</span>
            <span className="text-brand-sage text-xs">{user.email}</span>
            <Badge variant="secondary" className="mt-1 w-fit">
              {roleLabelMap[user.role || "ATTENDEE"]}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={dashboardHref as Route} className="cursor-pointer">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/dashboard/settings" as Route} className="cursor-pointer">
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOutAction();
          }}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
