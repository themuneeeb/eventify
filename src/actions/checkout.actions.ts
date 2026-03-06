"use server";

import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { checkoutSchema } from "@/validations/checkout.schema";
import { absoluteUrl } from "@/lib/utils";

type ActionState =
  | {
      error?: string;
    }
  | undefined;

export async function createCheckoutSessionAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to purchase tickets" };
  }

  const eventId = formData.get("eventId") as string;
  const itemsRaw = formData.get("items") as string;

  let items: { ticketTypeId: string; quantity: number }[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "Invalid checkout data" };
  }

  const validated = checkoutSchema.safeParse({ eventId, items });
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  // Fetch event and ticket types
  const event = await db.event.findUnique({
    where: { id: eventId, status: "PUBLISHED" },
    include: { ticketTypes: true },
  });

  if (!event) {
    return { error: "Event not found or not available" };
  }

  // Validate availability
  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; description?: string };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  let totalAmount = 0;
  const validatedItems: { ticketTypeId: string; quantity: number }[] = [];

  for (const item of validated.data.items) {
    const ticketType = event.ticketTypes.find((tt) => tt.id === item.ticketTypeId);
    if (!ticketType) {
      return { error: `Ticket type not found` };
    }

    const available = ticketType.quantity - ticketType.sold;
    if (item.quantity > available) {
      return {
        error: `Only ${available} "${ticketType.name}" tickets remaining`,
      };
    }

    const unitPrice = parseFloat(ticketType.price.toString());
    const isFree = ticketType.kind === "FREE" || unitPrice === 0;

    if (!isFree) {
      lineItems.push({
        price_data: {
          currency: ticketType.currency || "usd",
          product_data: {
            name: `${event.title} — ${ticketType.name}`,
            description: ticketType.description || undefined,
          },
          unit_amount: Math.round(unitPrice * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      });
      totalAmount += unitPrice * item.quantity;
    }

    validatedItems.push({
      ticketTypeId: item.ticketTypeId,
      quantity: item.quantity,
    });
  }

  // Handle free tickets — no Stripe needed
  if (lineItems.length === 0) {
    // Create order directly for free tickets
    const { createOrderFromCheckout } = await import("@/services/order.service");

    const order = await createOrderFromCheckout({
      userId: session.user.id,
      eventId,
      stripeSessionId: `free_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      totalAmount: 0,
      currency: "usd",
      items: validatedItems,
    });

    redirect(`/checkout/success?order_id=${order.id}`);
  }

  // Create Stripe checkout session
  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: {
        userId: session.user.id,
        eventId,
        items: JSON.stringify(validatedItems),
      },
      customer_email: session.user.email || undefined,
      success_url: absoluteUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`),
      cancel_url: absoluteUrl(`/checkout/${eventId}?cancelled=true`),
    });

    if (!checkoutSession.url) {
      return { error: "Failed to create checkout session" };
    }

    // External Stripe URL — bypass Next.js typed route check
    redirect(checkoutSession.url as never);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    console.error("Stripe checkout error:", err);
    return { error: "Payment processing failed. Please try again." };
  }
}
