import { db } from "@/lib/db";
import { ITEMS_PER_PAGE } from "@/lib/constants";

// ─── TYPES ───────────────────────────────────

export interface EventFilters {
  search?: string;
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  page?: number;
}

// ─── BROWSE EVENTS (paginated + filtered) ───

export async function getPublishedEvents(filters: EventFilters = {}) {
  const {
    search,
    category,
    location,
    dateFrom,
    dateTo,
    sortBy = "startDate",
    order = "asc",
    page = 1,
  } = filters;

  const skip = (page - 1) * ITEMS_PER_PAGE;

  // Build where clause
  const where: any = {
    status: "PUBLISHED",
    endDate: { gte: new Date() }, // only upcoming / ongoing
  };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (location) {
    where.location = {
      OR: [
        { city: { contains: location, mode: "insensitive" } },
        { country: { contains: location, mode: "insensitive" } },
        { name: { contains: location, mode: "insensitive" } },
      ],
    };
  }

  if (dateFrom) {
    where.startDate = { ...(where.startDate || {}), gte: new Date(dateFrom) };
  }

  if (dateTo) {
    where.endDate = { ...(where.endDate || {}), lte: new Date(dateTo) };
  }

  // Build orderBy
  const orderByMap: Record<string, any> = {
    startDate: { startDate: order },
    title: { title: order },
    createdAt: { createdAt: order },
  };
  const orderBy = orderByMap[sortBy] || { startDate: "asc" };

  const [events, totalCount] = await Promise.all([
    db.event.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        location: {
          select: { id: true, name: true, city: true, country: true },
        },
        ticketTypes: {
          select: { id: true, price: true, kind: true, quantity: true, sold: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy,
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.event.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return {
    events,
    pagination: {
      page,
      pageSize: ITEMS_PER_PAGE,
      totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

// ─── FEATURED / LATEST EVENTS ────────────────

export async function getFeaturedEvents(limit: number = 6) {
  return db.event.findMany({
    where: {
      status: "PUBLISHED",
      endDate: { gte: new Date() },
    },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      location: {
        select: { id: true, name: true, city: true, country: true },
      },
      ticketTypes: {
        select: { id: true, price: true, kind: true, quantity: true, sold: true },
        orderBy: { price: "asc" },
      },
    },
    orderBy: { startDate: "asc" },
    take: limit,
  });
}

// ─── EVENTS BY CATEGORY ─────────────────────

export async function getEventsByCategory(categorySlug: string, page: number = 1) {
  const skip = (page - 1) * ITEMS_PER_PAGE;

  const where = {
    status: "PUBLISHED" as const,
    endDate: { gte: new Date() },
    category: { slug: categorySlug },
  };

  const [events, totalCount, category] = await Promise.all([
    db.event.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        location: {
          select: { id: true, name: true, city: true, country: true },
        },
        ticketTypes: {
          select: { id: true, price: true, kind: true, quantity: true, sold: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { startDate: "asc" },
      skip,
      take: ITEMS_PER_PAGE,
    }),
    db.event.count({ where }),
    db.category.findUnique({ where: { slug: categorySlug } }),
  ]);

  return {
    events,
    category,
    pagination: {
      page,
      pageSize: ITEMS_PER_PAGE,
      totalCount,
      totalPages: Math.ceil(totalCount / ITEMS_PER_PAGE),
      hasNext: page < Math.ceil(totalCount / ITEMS_PER_PAGE),
      hasPrev: page > 1,
    },
  };
}

// ─── ALL CATEGORIES WITH COUNT ───────────────

export async function getCategoriesWithCount() {
  const categories = await db.category.findMany({
    include: {
      _count: {
        select: {
          events: {
            where: {
              status: "PUBLISHED",
              endDate: { gte: new Date() },
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    eventCount: cat._count.events,
  }));
}
