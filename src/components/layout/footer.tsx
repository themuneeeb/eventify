import Link from "next/link";
import type { Route } from "next";
import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-brand-sage/20 bg-brand-charcoal text-brand-cream border-t">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link
              href={"/" as Route}
              className="flex items-center gap-2 font-bold text-white"
            >
              <Ticket className="text-brand-orange h-5 w-5" />
              <span className="text-lg">Eventify</span>
            </Link>
            <p className="text-brand-sage mt-3 text-sm">
              Discover and create amazing events. Purchase tickets securely.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={"/events" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Browse Events
                </Link>
              </li>
              <li>
                <Link
                  href={"/categories" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizers */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">For Organizers</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={"/register" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Create Events
                </Link>
              </li>
              <li>
                <Link
                  href={"/dashboard/organizer" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={"/privacy" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={"/terms" as Route}
                  className="hover:text-brand-orange transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-brand-sage/20 text-brand-sage mt-8 border-t pt-6 text-center text-xs">
          © {new Date().getFullYear()} Eventify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
