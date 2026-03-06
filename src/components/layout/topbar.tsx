"use client";

import { Bell } from "lucide-react";
import { Button } from "../../components/ui/button";
import { UserMenu } from "../../components/layout/user-menu";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="border-brand-sage/20 sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white/80 px-6 backdrop-blur-md">
      {/* Page title area — filled by each page */}
      <div />

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Notifications bell — HCI: Visibility of system status */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="text-brand-soft-black h-5 w-5" />
        </Button>

        <UserMenu user={user} />
      </div>
    </header>
  );
}
