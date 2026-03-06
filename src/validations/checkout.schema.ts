import { z } from "zod";

export const checkoutItemSchema = z.object({
  ticketTypeId: z.string().min(1, "Ticket type is required"),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Minimum 1 ticket")
    .max(10, "Maximum 10 tickets per type"),
});

export const checkoutSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  items: z.array(checkoutItemSchema).min(1, "Select at least one ticket"),
});

export type CheckoutItem = z.infer<typeof checkoutItemSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
