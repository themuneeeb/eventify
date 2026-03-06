import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Ticket } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    startDate: Date;
    endDate: Date;
    category: { name: string; slug: string };
    location: { name: string; city: string; country: string };
    ticketTypes: {
      price: { toString(): string };
      kind: string;
      quantity: number;
      sold: number;
    }[];
  };
}

// RSC — no "use client", zero JS shipped for this component
export function EventCard({ event }: EventCardProps) {
  const lowestPrice = Math.min(
    ...event.ticketTypes.map((tt) => parseFloat(tt.price.toString()))
  );
  const hasFreeTickets = event.ticketTypes.some((tt) => tt.kind === "FREE");
  const totalAvailable = event.ticketTypes.reduce(
    (sum, tt) => sum + (tt.quantity - tt.sold),
    0
  );
  const isSoldOut = totalAvailable <= 0;

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
        {/* Image — HCI: Affordance, visual hierarchy */}
        <div className="bg-brand-cream relative aspect-[16/10] w-full overflow-hidden">
          {event.coverImage ? (
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Ticket className="text-brand-sage/40 h-12 w-12" />
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge className="text-brand-charcoal bg-white/90 backdrop-blur-sm">
              {event.category.name}
            </Badge>
          </div>

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive" className="text-sm">
                Sold Out
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* Title */}
          <h3 className="text-brand-charcoal group-hover:text-brand-orange line-clamp-1 text-lg font-semibold transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-brand-soft-black mt-1 line-clamp-2 text-sm">
            {event.description}
          </p>

          {/* Meta info — HCI: Recognition, scannable layout */}
          <div className="text-brand-soft-black mt-3 flex flex-col gap-1.5 text-sm">
            <span className="flex items-center gap-1.5">
              <Calendar className="text-brand-sage h-3.5 w-3.5" />
              {formatDate(event.startDate)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="text-brand-sage h-3.5 w-3.5" />
              {event.location.city}, {event.location.country}
            </span>
          </div>

          {/* Price + CTA — HCI: Clear affordance */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              {hasFreeTickets ? (
                <span className="text-success text-lg font-bold">Free</span>
              ) : (
                <span className="text-brand-orange text-lg font-bold">
                  {formatCurrency(lowestPrice)}
                  <span className="text-brand-sage text-xs font-normal"> +</span>
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant={isSoldOut ? "secondary" : "default"}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold Out" : "Get Tickets"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
