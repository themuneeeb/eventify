import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Ticket, Shield } from "lucide-react";

// SSG — fully static landing page (best LCP)
export default function HomePage() {
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
      {/* Hero Section */}
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

      {/* Features — HCI: Recognition over recall (icons + clear labels) */}
      <section className="border-brand-sage/20 border-t bg-white py-20">
        <div className="container-main">
          <h2 className="text-brand-charcoal mb-12 text-center text-3xl font-bold">
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

      {/* CTA Section */}
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
