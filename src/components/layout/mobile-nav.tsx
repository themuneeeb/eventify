"use client";

import { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { publicNavItems } from "../../config/nav";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Hamburger trigger — HCI: Affordance */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-charcoal hover:bg-brand-cream flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel — HCI: Consistency with desktop nav */}
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

              <Link href={"/login" as Route} onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
              </Link>

              <Link href={"/register" as Route} onClick={() => setIsOpen(false)}>
                <Button className="w-full">Get Started</Button>
              </Link>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
