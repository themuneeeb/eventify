import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getEventBySlug } from "@/services/event.service";
import { getFeaturedEvents } from "@/services/public-event.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/events/event-card";
import { formatDateTime, formatDate, formatCurrency, isValidImageUrl } from "@/lib/utils";
import { Calendar, MapPin, Clock, User, Ticket, Share2, ArrowLeft } from "lucide-react";
import type { Metadata, Route } from "next";

// ISR — revalidate every 120 seconds, also on-demand via revalidatePath
export const revalidate = 120;

// ─── DYNAMIC METADATA (SEO) ─────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Event Not Found" };
  }

  const lowestPrice = Math.min(
    ...event.ticketTypes.map((tt) => parseFloat(tt.price.toString()))
  );
  const hasFree = event.ticketTypes.some((tt) => tt.kind === "FREE");
  const priceText = hasFree ? "Free" : `From ${formatCurrency(lowestPrice)}`;

  return {
    title: event.title,
    description: `${event.description.slice(0, 155)}...`,
    openGraph: {
      title: event.title,
      description: `${event.description.slice(0, 155)}...`,
      type: "website",
      url: `/events/${event.slug}`,
      images: event.coverImage
        ? [
            {
              url: event.coverImage,
              width: 1200,
              height: 630,
              alt: event.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: `${priceText} · ${formatDate(event.startDate)} · ${event.location.city}`,
      images: event.coverImage ? [event.coverImage] : [],
    },
  };
}

// ─── PAGE ────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const totalAvailable = event.ticketTypes.reduce(
    (sum, tt) => sum + (tt.quantity - tt.sold),
    0
  );
  const isSoldOut = totalAvailable <= 0;

  // Fetch related events (same category, exclude current)
  const relatedEvents = await getFeaturedEvents(4);
  const filtered = relatedEvents.filter((e) => e.id !== event.id).slice(0, 3);

  return (
    <div className="container-main py-8">
      {/* Back link — HCI: Easy navigation */}
      <Link
        href="/events"
        className="text-brand-soft-black hover:text-brand-orange mb-6 inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Events
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ─── Main content (2/3) ─── */}
        <div className="lg:col-span-2">
          {/* Cover image */}
          <div className="bg-brand-cream relative aspect-[16/9] w-full overflow-hidden rounded-xl">
            {isValidImageUrl(event.coverImage) ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
                priority // LCP image
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Ticket className="text-brand-sage/30 h-20 w-20" />
              </div>
            )}
          </div>

          {/* Event header */}
          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{event.category.name}</Badge>
              {isSoldOut && <Badge variant="destructive">Sold Out</Badge>}
            </div>

            <h1 className="text-brand-charcoal mt-3 text-3xl font-bold sm:text-4xl">
              {event.title}
            </h1>

            {/* Organizer */}
            <div className="mt-3 flex items-center gap-2">
              <User className="text-brand-sage h-4 w-4" />
              <span className="text-brand-soft-black text-sm">
                Organized by{" "}
                <span className="text-brand-charcoal font-medium">
                  {event.organizer.name}
                </span>
              </span>
            </div>
          </div>

          {/* Meta grid — HCI: Scannable, consistent iconography */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="border-brand-sage/20 flex items-start gap-3 rounded-lg border bg-white p-4">
              <Calendar className="text-brand-orange mt-0.5 h-5 w-5" />
              <div>
                <p className="text-brand-charcoal text-sm font-medium">Date</p>
                <p className="text-brand-soft-black text-sm">
                  {formatDateTime(event.startDate)}
                </p>
                <p className="text-brand-sage text-xs">
                  to {formatDateTime(event.endDate)}
                </p>
              </div>
            </div>

            <div className="border-brand-sage/20 flex items-start gap-3 rounded-lg border bg-white p-4">
              <MapPin className="text-brand-orange mt-0.5 h-5 w-5" />
              <div>
                <p className="text-brand-charcoal text-sm font-medium">Location</p>
                <p className="text-brand-soft-black text-sm">{event.location.name}</p>
                <p className="text-brand-sage text-xs">
                  {event.location.address}, {event.location.city},{" "}
                  {event.location.country}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-brand-charcoal text-xl font-semibold">
              About This Event
            </h2>
            <div className="text-brand-soft-black mt-3 text-sm leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
        </div>

        {/* ─── Sidebar (1/3): Ticket selection ─── */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="text-brand-orange h-5 w-5" />
                  Tickets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {event.ticketTypes.map((tt) => {
                  const available = tt.quantity - tt.sold;
                  const ticketSoldOut = available <= 0;

                  return (
                    <div
                      key={tt.id}
                      className="border-brand-sage/20 flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-brand-charcoal text-sm font-medium">
                          {tt.name}
                        </p>
                        {tt.description && (
                          <p className="text-brand-sage text-xs">{tt.description}</p>
                        )}
                        <p className="text-brand-sage mt-1 text-xs">
                          {ticketSoldOut ? "Sold out" : `${available} remaining`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-orange text-lg font-bold">
                          {tt.kind === "FREE"
                            ? "Free"
                            : formatCurrency(parseFloat(tt.price.toString()))}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* CTA Button — HCI: Primary action, highly visible */}
                <Button
                  className="mt-4 w-full"
                  size="lg"
                  disabled={isSoldOut}
                  asChild={!isSoldOut}
                >
                  {isSoldOut ? (
                    <span>Sold Out</span>
                  ) : (
                    <Link href={`/checkout/${event.id}` as Route}>Get Tickets</Link>
                  )}
                </Button>

                {/* Countdown / info */}
                <div className="text-brand-sage mt-3 flex items-center justify-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>Event starts {formatDate(event.startDate)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Related events */}
      {filtered.length > 0 && (
        <div className="mt-16">
          <h2 className="text-brand-charcoal mb-6 text-2xl font-bold">
            More Events You Might Like
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
