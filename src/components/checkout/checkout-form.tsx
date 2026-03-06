"use client";

import { useState, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSessionAction } from "@/actions/checkout.actions";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Minus,
  Plus,
  Ticket,
  CreditCard,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

interface CheckoutFormProps {
  event: {
    id: string;
    title: string;
    slug: string;
    startDate: Date;
    endDate: Date;
    coverImage: string | null;
    location: { name: string; city: string; country: string };
    ticketTypes: {
      id: string;
      name: string;
      kind: string;
      price: number;
      quantity: number;
      sold: number;
      description: string | null;
    }[];
  };
}

export function CheckoutForm({ event }: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(
    createCheckoutSessionAction,
    undefined
  );

  const [quantities, setQuantities] = useState<Record<string, number>>({});

  function updateQuantity(ticketTypeId: string, delta: number) {
    setQuantities((prev) => {
      const current = prev[ticketTypeId] || 0;
      const tt = event.ticketTypes.find((t) => t.id === ticketTypeId);
      if (!tt) return prev;

      const available = tt.quantity - tt.sold;
      const next = Math.max(0, Math.min(current + delta, available, 10));
      return { ...prev, [ticketTypeId]: next };
    });
  }

  const selectedItems = Object.entries(quantities)
    .filter(([_, qty]) => qty > 0)
    .map(([ticketTypeId, quantity]) => {
      const tt = event.ticketTypes.find((t) => t.id === ticketTypeId)!;
      return { ticketTypeId, quantity, ticketType: tt };
    });

  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + item.ticketType.price * item.quantity,
    0
  );

  const totalTickets = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  function handleSubmit(formData: FormData) {
    formData.set("eventId", event.id);
    formData.set(
      "items",
      JSON.stringify(
        selectedItems.map((item) => ({
          ticketTypeId: item.ticketTypeId,
          quantity: item.quantity,
        }))
      )
    );
    return formAction(formData);
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* ─── Ticket selection (2/3) ─── */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="text-brand-orange h-5 w-5" />
              Select Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.ticketTypes.map((tt) => {
              const available = tt.quantity - tt.sold;
              const soldOut = available <= 0;
              const qty = quantities[tt.id] || 0;

              return (
                <div
                  key={tt.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition-colors ${
                    qty > 0
                      ? "border-brand-orange/30 bg-brand-orange/5"
                      : "border-brand-sage/20"
                  } ${soldOut ? "opacity-50" : ""}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-brand-charcoal font-medium">{tt.name}</p>
                      <Badge variant="outline" className="text-xs">
                        {tt.kind}
                      </Badge>
                    </div>
                    {tt.description && (
                      <p className="text-brand-sage mt-1 text-xs">{tt.description}</p>
                    )}
                    <p className="text-brand-sage mt-1 text-xs">
                      {soldOut ? "Sold out" : `${available} remaining`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-brand-orange text-lg font-bold">
                      {tt.kind === "FREE" || tt.price === 0
                        ? "Free"
                        : formatCurrency(tt.price)}
                    </p>

                    {/* Quantity selector — HCI: Clear affordance */}
                    {!soldOut && (
                      <div className="border-brand-sage/30 flex items-center gap-2 rounded-lg border px-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(tt.id, -1)}
                          disabled={qty <= 0}
                          className="text-brand-soft-black hover:bg-brand-cream flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="text-brand-charcoal w-6 text-center text-sm font-medium">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(tt.id, 1)}
                          disabled={qty >= Math.min(available, 10)}
                          className="text-brand-soft-black hover:bg-brand-cream flex h-8 w-8 items-center justify-center rounded transition-colors disabled:opacity-30"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* ─── Order summary sidebar (1/3) ─── */}
      <div className="lg:col-span-1">
        <div className="sticky top-20">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Event info */}
              <div className="bg-brand-off-white mb-4 rounded-lg p-3">
                <p className="text-brand-charcoal font-medium">{event.title}</p>
                <div className="text-brand-soft-black mt-2 space-y-1 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="text-brand-sage h-3 w-3" />
                    {formatDateTime(event.startDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="text-brand-sage h-3 w-3" />
                    {event.location.city}, {event.location.country}
                  </span>
                </div>
              </div>

              {/* Selected items */}
              {selectedItems.length > 0 ? (
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.ticketTypeId}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-brand-soft-black">
                        {item.ticketType.name} × {item.quantity}
                      </span>
                      <span className="text-brand-charcoal font-medium">
                        {item.ticketType.price === 0
                          ? "Free"
                          : formatCurrency(item.ticketType.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="bg-brand-sage/20 my-3 h-px" />

                  <div className="flex items-center justify-between">
                    <span className="text-brand-charcoal font-semibold">Total</span>
                    <span className="text-brand-orange text-xl font-bold">
                      {totalAmount === 0 ? "Free" : formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-brand-sage text-center text-sm">
                  Select tickets above
                </p>
              )}

              {/* Error */}
              {state?.error && (
                <div
                  className="bg-destructive/10 text-destructive mt-4 flex items-center gap-2 rounded-lg p-3 text-xs"
                  role="alert"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {state.error}
                </div>
              )}

              {/* Submit */}
              <form action={handleSubmit} className="mt-4">
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={totalTickets === 0 || isPending}
                  isLoading={isPending}
                >
                  <CreditCard className="h-4 w-4" />
                  {totalAmount === 0
                    ? `Get ${totalTickets} Free Ticket${totalTickets !== 1 ? "s" : ""}`
                    : `Pay ${formatCurrency(totalAmount)}`}
                </Button>
              </form>

              {/* Trust badge — HCI: Build confidence */}
              <div className="text-brand-sage mt-4 flex items-center justify-center gap-1.5 text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
                Secured by Stripe. PCI-DSS compliant.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
