import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

// ─── QUERIES ─────────────────────────────────

export async function getEventsByOrganizer(organizerId: string) {
  return db.event.findMany({
    where: { organizerId },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      location: {
        select: { id: true, name: true, city: true, country: true },
      },
      ticketTypes: {
        select: {
          id: true,
          name: true,
          kind: true,
          price: true,
          quantity: true,
          sold: true,
        },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getEventById(eventId: string) {
  return db.event.findUnique({
    where: { id: eventId },
    include: {
      category: true,
      location: true,
      organizer: { select: { id: true, name: true, email: true, image: true } },
      ticketTypes: true,
      _count: { select: { orders: true } },
    },
  });
}

export async function getEventBySlug(slug: string) {
  return db.event.findUnique({
    where: { slug },
    include: {
      category: true,
      location: true,
      organizer: { select: { id: true, name: true, image: true } },
      ticketTypes: {
        orderBy: { price: "asc" },
      },
      _count: { select: { orders: true } },
    },
  });
}

// ─── MUTATIONS ───────────────────────────────

export async function createEvent(data: {
  title: string;
  description: string;
  categoryId: string;
  locationId: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  status: string;
  organizerId: string;
  ticketTypes: {
    name: string;
    kind: string;
    price: number;
    quantity: number;
    description?: string;
    saleStart?: string;
    saleEnd?: string;
  }[];
}) {
  // Generate unique slug
  let slug = slugify(data.title);
  const existingSlug = await db.event.findUnique({ where: { slug } });
  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  return db.event.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      categoryId: data.categoryId,
      locationId: data.locationId,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      coverImage: data.coverImage || null,
      status: data.status as "DRAFT" | "PUBLISHED",
      organizerId: data.organizerId,
      ticketTypes: {
        create: data.ticketTypes.map((tt) => ({
          name: tt.name,
          kind: tt.kind as "FREE" | "STANDARD" | "VIP" | "EARLY_BIRD",
          price: tt.kind === "FREE" ? 0 : tt.price,
          quantity: tt.quantity,
          description: tt.description || null,
          saleStart: tt.saleStart ? new Date(tt.saleStart) : null,
          saleEnd: tt.saleEnd ? new Date(tt.saleEnd) : null,
        })),
      },
    },
    include: {
      ticketTypes: true,
      category: true,
      location: true,
    },
  });
}

export async function updateEvent(
  eventId: string,
  data: {
    title?: string;
    description?: string;
    categoryId?: string;
    locationId?: string;
    startDate?: string;
    endDate?: string;
    coverImage?: string;
    status?: string;
  }
) {
  const updateData: Prisma.EventUpdateInput = {};

  if (data.title) {
    updateData.title = data.title;
    // Update slug if title changes
    let slug = slugify(data.title);
    const existing = await db.event.findFirst({
      where: { slug, NOT: { id: eventId } },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;
    updateData.slug = slug;
  }
  if (data.description) updateData.description = data.description;
  if (data.categoryId) updateData.category = { connect: { id: data.categoryId } };
  if (data.locationId) updateData.location = { connect: { id: data.locationId } };
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.endDate) updateData.endDate = new Date(data.endDate);
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  if (data.status)
    updateData.status = data.status as "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

  return db.event.update({
    where: { id: eventId },
    data: updateData,
    include: {
      ticketTypes: true,
      category: true,
      location: true,
    },
  });
}

export async function deleteEvent(eventId: string) {
  return db.event.delete({ where: { id: eventId } });
}

// ─── HELPERS ─────────────────────────────────

export async function getAllCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

export async function getAllLocations() {
  return db.location.findMany({ orderBy: { name: "asc" } });
}

export async function isEventOwner(eventId: string, userId: string) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { organizerId: true },
  });
  return event?.organizerId === userId;
}
