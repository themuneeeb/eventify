import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/components/events/event-card";
import {
  getFeaturedEvents,
  getCategoriesWithCount,
} from "@/services/public-event.service";
import { ArrowRight, Calendar, Ticket, Shield, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// ISR — revalidate landing page every 120 seconds
export const revalidate = 120;

export default async function HomePage() {
  const [featuredEvents, categories] = await Promise.all([
    getFeaturedEvents(6),
    getCategoriesWithCount(),
  ]);

  const features = [
    {
      icon: Calendar,
      title: "Easy Event Creation",
      desc: "Create and manage events in minutes with our intuitive dashboard.",
    },
    {
      icon: Ticket,
      title: "Secure Ticketing",
      desc: "PCI-compliant payments via Stripe. QR codes for instant check-in.",
    },
    {
      icon: Shield,
      title: "Trusted Platform",
      desc: "Built for reliability and scale. Your events are in safe hands.",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="container-main py-20 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-brand-charcoal text-4xl font-bold tracking-tight sm:text-6xl">
            Discover Events. <span className="text-brand-orange">Buy Tickets.</span>{" "}
            Create Memories.
          </h1>
          <p className="text-brand-soft-black mt-6 text-lg leading-8">
            Eventify makes it easy to find, create, and manage events. Whether you&apos;re
            an attendee or organizer, we&apos;ve got you covered.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/events">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Create an Event</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="border-brand-sage/20 border-t bg-white py-16">
          <div className="container-main">
            <div className="flex items-center justify-between">
              <h2 className="text-brand-charcoal text-2xl font-bold">Upcoming Events</h2>
              <Button variant="link" asChild>
                <Link href="/events">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16">
        <div className="container-main">
          <h2 className="text-brand-charcoal text-center text-2xl font-bold">
            Browse by Category
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="group">
                <Card className="transition-all group-hover:-translate-y-0.5 group-hover:shadow-md">
                  <CardContent className="flex items-center gap-3 p-4">
                    <Tag className="text-brand-orange h-4 w-4" />
                    <div>
                      <p className="text-brand-charcoal group-hover:text-brand-orange text-sm font-medium transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-brand-sage text-xs">
                        {cat.eventCount} event{cat.eventCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-brand-sage/20 border-t bg-white py-16">
        <div className="container-main">
          <h2 className="text-brand-charcoal mb-12 text-center text-2xl font-bold">
            Why Choose Eventify?
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="bg-brand-orange/10 mx-auto flex h-14 w-14 items-center justify-center rounded-xl">
                  <feature.icon className="text-brand-orange h-7 w-7" />
                </div>
                <h3 className="text-brand-charcoal mt-4 text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="text-brand-soft-black mt-2 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-charcoal py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
          <p className="text-brand-sage mt-4">
            Join thousands of organizers and attendees on Eventify.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/register">
              Create Your First Event <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
