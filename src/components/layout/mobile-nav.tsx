"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicNavItems } from "@/config/nav";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getDashboardRedirectByRole } from "@/config/dashboard";
import { signOutAction } from "@/actions/auth.actions";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAttendee } = useCurrentUser();

  const dashboardHref = getDashboardRedirectByRole(user?.role || "ATTENDEE");

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-charcoal hover:bg-brand-cream flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <nav
            className="border-brand-sage/20 fixed inset-x-0 top-16 z-50 border-b bg-white p-4 shadow-lg"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2">
              {publicNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  onClick={() => setIsOpen(false)}
                  className="text-brand-soft-black hover:bg-brand-cream hover:text-brand-charcoal rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <div className="bg-brand-sage/20 my-2 h-px" />

              {isAuthenticated && user ? (
                <>
                  {isAttendee ? (
                    <>
                      <Link
                        href="/dashboard/attendee/tickets"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start">
                          My Tickets
                        </Button>
                      </Link>
                      <Link
                        href="/dashboard/attendee/orders"
                        onClick={() => setIsOpen(false)}
                      >
                        <Button variant="ghost" className="w-full justify-start">
                          My Orders
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <Link href={dashboardHref as Route} onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive w-full justify-start"
                    onClick={async () => {
                      setIsOpen(false);
                      await signOutAction();
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
