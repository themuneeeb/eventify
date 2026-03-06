"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { useState } from "react";
import { type NavItem } from "../../config/nav";

interface SidebarProps {
  items: NavItem[];
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "border-brand-sage/20 sticky top-0 flex h-screen flex-col border-r bg-white transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
      aria-label="Dashboard navigation"
    >
      {/* Sidebar header — HCI: Recognition */}
      <div className="border-brand-sage/20 flex h-16 items-center gap-2 border-b px-4">
        <Ticket className="text-brand-orange h-6 w-6 shrink-0" />
        {!collapsed && (
          <span className="text-brand-charcoal text-lg font-bold">Eventify</span>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href as Route}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-brand-soft-black hover:bg-brand-cream hover:text-brand-charcoal"
              )}
              title={collapsed ? item.label : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — HCI: Flexibility & control */}
      <div className="border-brand-sage/20 border-t p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-brand-sage hover:bg-brand-cream hover:text-brand-charcoal flex w-full items-center justify-center rounded-lg p-2 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
}
