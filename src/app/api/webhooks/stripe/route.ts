import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrderFromCheckout } from "@/services/order.service";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // ─── Handle events ───────────────────────

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Skip if already processed (idempotency)
      const { db } = await import("@/lib/db");
      const existing = await db.order.findUnique({
        where: { stripeSessionId: session.id },
      });
      if (existing) {
        console.log(`Order already exists for session ${session.id}`);
        break;
      }

      // Extract metadata
      const userId = session.metadata?.userId;
      const eventId = session.metadata?.eventId;
      const itemsRaw = session.metadata?.items;

      if (!userId || !eventId || !itemsRaw) {
        console.error("Missing metadata in checkout session:", session.id);
        break;
      }

      let items: { ticketTypeId: string; quantity: number }[];
      try {
        items = JSON.parse(itemsRaw);
      } catch {
        console.error("Failed to parse items metadata:", itemsRaw);
        break;
      }

      try {
        await createOrderFromCheckout({
          userId,
          eventId,
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          totalAmount: (session.amount_total || 0) / 100,
          currency: session.currency || "usd",
          items,
        });

        console.log(`Order created for session ${session.id}`);

        // Revalidate relevant pages
        revalidatePath("/events");
        revalidatePath("/dashboard/organizer/events");
        revalidatePath("/dashboard/attendee/tickets");
        revalidatePath("/dashboard/attendee/orders");
      } catch (err) {
        console.error("Failed to create order:", err);
      }
      break;
    }

    case "checkout.session.expired": {
      console.log("Checkout session expired:", event.data.object.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
