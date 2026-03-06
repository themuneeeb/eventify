import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarOff, Search, ArrowLeft } from "lucide-react";

export default function EventNotFound() {
  return (
    <div className="container-main flex flex-col items-center justify-center py-24 text-center">
      <CalendarOff className="text-brand-sage h-16 w-16" />
      <h1 className="text-brand-charcoal mt-6 text-3xl font-bold">Event Not Found</h1>
      <p className="text-brand-soft-black mt-2 max-w-md">
        The event you&apos;re looking for doesn&apos;t exist, has been removed, or the
        link is incorrect.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/events">
            <Search className="h-4 w-4" /> Browse Events
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" /> Go Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
