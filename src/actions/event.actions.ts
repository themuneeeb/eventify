"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { createEventSchema, updateEventSchema } from "@/validations/event.schema";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  isEventOwner,
} from "@/services/event.service";

// ─── TYPES ───────────────────────────────────

type ActionState =
  | {
      error?: string;
      success?: string;
      fieldErrors?: Record<string, string[]>;
    }
  | undefined;

// ─── CREATE EVENT ────────────────────────────

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create an event" };
  }
  if (session.user.role !== "ORGANIZER" && session.user.role !== "ADMIN") {
    return { error: "Only organizers can create events" };
  }

  // Parse ticket types from form data
  const ticketTypesRaw = formData.get("ticketTypes");
  let ticketTypes: Array<{
    name: string;
    kind: string;
    price: number;
    quantity: number;
    description?: string;
    saleStart?: string;
    saleEnd?: string;
  }> = [];

  try {
    ticketTypes = ticketTypesRaw ? JSON.parse(ticketTypesRaw as string) : [];
  } catch {
    return { error: "Invalid ticket types data" };
  }

  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("categoryId") as string,
    locationId: formData.get("locationId") as string,
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    coverImage: (formData.get("coverImage") as string) || undefined,
    status: (formData.get("status") as string) || "DRAFT",
    ticketTypes,
  };

  const validated = createEventSchema.safeParse(raw);

  if (!validated.success) {
    const fieldErrors: Record<string, string[]> = {};
    validated.error.issues.forEach((err) => {
      const path = err.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(err.message);
    });
    return { error: "Please fix the errors below", fieldErrors };
  }

  // Validate dates
  const start = new Date(validated.data.startDate);
  const end = new Date(validated.data.endDate);
  if (end <= start) {
    return { error: "End date must be after start date" };
  }
  if (start < new Date()) {
    return { error: "Start date cannot be in the past" };
  }

  try {
    const event = await createEvent({
      ...validated.data,
      organizerId: session.user.id,
    });

    revalidatePath("/events");
    revalidatePath("/dashboard/organizer/events");

    return { success: event.id };
  } catch (err) {
    console.error("Create event error:", err);
    return { error: "Failed to create event. Please try again." };
  }
}

// ─── UPDATE EVENT ────────────────────────────

export async function updateEventAction(
  eventId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isOwner = await isEventOwner(eventId, session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") {
    return { error: "You don't have permission to edit this event" };
  }

  const raw = {
    title: (formData.get("title") as string) || undefined,
    description: (formData.get("description") as string) || undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    locationId: (formData.get("locationId") as string) || undefined,
    startDate: (formData.get("startDate") as string) || undefined,
    endDate: (formData.get("endDate") as string) || undefined,
    coverImage: (formData.get("coverImage") as string) || undefined,
    status: (formData.get("status") as string) || undefined,
  };

  // Remove undefined values
  const cleanData = Object.fromEntries(
    Object.entries(raw).filter(([_, v]) => v !== undefined)
  );

  const validated = updateEventSchema.safeParse(cleanData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message ?? "Invalid input" };
  }

  // Validate dates if both provided
  if (validated.data.startDate && validated.data.endDate) {
    const start = new Date(validated.data.startDate);
    const end = new Date(validated.data.endDate);
    if (end <= start) {
      return { error: "End date must be after start date" };
    }
  }

  try {
    const event = await updateEvent(eventId, validated.data);

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/dashboard/organizer/events");
    revalidatePath(`/dashboard/organizer/events/${eventId}`);

    return { success: "Event updated successfully" };
  } catch (err) {
    console.error("Update event error:", err);
    return { error: "Failed to update event. Please try again." };
  }
}

// ─── DELETE EVENT ────────────────────────────

export async function deleteEventAction(eventId: string): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isOwner = await isEventOwner(eventId, session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") {
    return { error: "You don't have permission to delete this event" };
  }

  try {
    await deleteEvent(eventId);

    revalidatePath("/events");
    revalidatePath("/dashboard/organizer/events");

    return { success: "Event deleted successfully" };
  } catch (err) {
    console.error("Delete event error:", err);
    return { error: "Failed to delete event. Please try again." };
  }
}

// ─── PUBLISH / UNPUBLISH ─────────────────────

export async function toggleEventStatusAction(
  eventId: string,
  newStatus: "DRAFT" | "PUBLISHED" | "CANCELLED"
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in" };
  }

  const isOwner = await isEventOwner(eventId, session.user.id);
  if (!isOwner && session.user.role !== "ADMIN") {
    return { error: "You don't have permission to modify this event" };
  }

  try {
    const event = await updateEvent(eventId, { status: newStatus });

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/dashboard/organizer/events");

    return { success: `Event ${newStatus.toLowerCase()} successfully` };
  } catch (err) {
    console.error("Toggle event status error:", err);
    return { error: "Failed to update event status" };
  }
}
