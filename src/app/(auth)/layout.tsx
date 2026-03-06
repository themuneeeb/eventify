import Link from "next/link";
import { Ticket } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-cream/30 flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Centered brand logo — HCI: Recognition */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-brand-charcoal inline-flex items-center gap-2 font-bold"
          >
            <Ticket className="text-brand-orange h-8 w-8" />
            <span className="text-2xl">Eventify</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
