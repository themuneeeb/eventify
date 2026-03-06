import Link from "next/link";
import { Button } from "../components/ui/button";
import { Home, Search } from "lucide-react";

// Global 404 page — HCI: Help users recover from errors
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-brand-orange text-7xl font-bold">404</h1>
      <h2 className="text-brand-charcoal mt-4 text-2xl font-semibold">Page Not Found</h2>
      <p className="text-brand-soft-black mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">
            <Home className="h-4 w-4" /> Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/events">
            <Search className="h-4 w-4" /> Browse Events
          </Link>
        </Button>
      </div>
    </div>
  );
}
