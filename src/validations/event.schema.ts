import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(120, "Title must be less than 120 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must be less than 5000 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  locationId: z.string().min(1, "Please select a location"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  coverImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

export const ticketTypeSchema = z.object({
  name: z
    .string()
    .min(1, "Ticket name is required")
    .max(50, "Ticket name must be less than 50 characters"),
  kind: z.enum(["FREE", "STANDARD", "VIP", "EARLY_BIRD"]).default("STANDARD"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  quantity: z.coerce
    .number()
    .int("Quantity must be a whole number")
    .min(1, "At least 1 ticket required"),
  description: z
    .string()
    .max(200, "Description must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  saleStart: z.string().optional().or(z.literal("")),
  saleEnd: z.string().optional().or(z.literal("")),
});

export const createEventSchema = eventSchema.extend({
  ticketTypes: z.array(ticketTypeSchema).min(1, "At least one ticket type is required"),
});

export const updateEventSchema = eventSchema.partial();

export type EventInput = z.infer<typeof eventSchema>;
export type TicketTypeInput = z.infer<typeof ticketTypeSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
