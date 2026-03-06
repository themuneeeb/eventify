import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getEventById } from "@/services/event.service";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { Metadata } from "next";
import type { Route } from "next";

export const metadata: Metadata = {
  title: "Checkout",
};

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { eventId } = await params;
  const sp = await searchParams;

  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const event = await getEventById(eventId);
  if (!event || event.status !== "PUBLISHED") notFound();

  return (
    <div className="container-main py-12">
      <Breadcrumbs
        items={[
          { label: "Events", href: "/events" },
          { label: event.title, href: `/events/${event.slug}` as Route },
          { label: "Checkout" },
        ]}
      />

      {sp.cancelled === "true" && (
        <div className="bg-brand-orange/10 text-brand-orange mb-6 rounded-lg p-3 text-sm">
          Payment was cancelled. You can try again below.
        </div>
      )}

      <CheckoutForm
        event={{
          id: event.id,
          title: event.title,
          slug: event.slug,
          startDate: event.startDate,
          endDate: event.endDate,
          coverImage: event.coverImage,
          location: event.location,
          ticketTypes: event.ticketTypes.map((tt) => ({
            id: tt.id,
            name: tt.name,
            kind: tt.kind,
            price: parseFloat(tt.price.toString()),
            quantity: tt.quantity,
            sold: tt.sold,
            description: tt.description,
          })),
        }}
      />
    </div>
  );
}
