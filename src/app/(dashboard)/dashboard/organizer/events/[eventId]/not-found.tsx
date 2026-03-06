import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarOff, ArrowLeft } from "lucide-react";

export default function EventNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <CalendarOff className="text-brand-sage h-12 w-12" />
      <h2 className="text-brand-charcoal mt-4 text-2xl font-semibold">Event Not Found</h2>
      <p className="text-brand-soft-black mt-2">
        This event doesn&apos;t exist or you don&apos;t have access to it.
      </p>
      <Button asChild className="mt-6">
        <Link href="/dashboard/organizer/events">
          <ArrowLeft className="h-4 w-4" /> Back to My Events
        </Link>
      </Button>
    </div>
  );
}
