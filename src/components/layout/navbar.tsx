import Link from "next/link";
import type { Route } from "next";
import { Ticket } from "lucide-react";
import { Button } from "../../components/ui/button";
import { MobileNav } from "../../components/layout/mobile-nav";
import { publicNavItems } from "../../config/nav";

export function Navbar() {
  return (
    <header className="border-brand-sage/20 sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
      <nav
        className="container-main flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={"/" as Route}
          className="text-brand-charcoal flex items-center gap-2 font-bold"
        >
          <Ticket className="text-brand-orange h-6 w-6" />
          <span className="text-xl">Eventify</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 md:flex">
          {publicNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as Route}
              className="text-brand-soft-black hover:text-brand-orange text-sm font-medium transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          <div className="hidden gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href={"/login" as Route}>Sign In</Link>
            </Button>

            <Button asChild>
              <Link href={"/register" as Route}>Get Started</Link>
            </Button>
          </div>

          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
