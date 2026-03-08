import { db } from "@/lib/db";

// ─── USERS ───────────────────────────────────

export async function getAllUsers(
  filters: {
    search?: string;
    role?: string;
    page?: number;
    pageSize?: number;
  } = {}
) {
  const { search, role, page = 1, pageSize = 20 } = filters;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (role) where.role = role;

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isApproved: true,
        isBlocked: true,
        createdAt: true,
        _count: { select: { organizedEvents: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    db.user.count({ where }),
  ]);

  return { users, total, totalPages: Math.ceil(total / pageSize), page };
}

export async function getPendingOrganizers() {
  return db.user.findMany({
    where: { role: "ORGANIZER", isApproved: false, isBlocked: false },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });
}

// ─── PLATFORM STATS ──────────────────────────

export async function getPlatformStats() {
  const [
    totalUsers,
    totalEvents,
    totalOrders,
    totalTicketsSold,
    revenueResult,
    activeOrganizers,
    pendingOrganizers,
  ] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.order.count({ where: { status: "COMPLETED" } }),
    db.ticket.count(),
    db.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { totalAmount: true },
    }),
    db.user.count({ where: { role: "ORGANIZER", isApproved: true } }),
    db.user.count({ where: { role: "ORGANIZER", isApproved: false, isBlocked: false } }),
  ]);

  return {
    totalUsers,
    totalEvents,
    totalOrders,
    totalTicketsSold,
    totalRevenue: revenueResult._sum.totalAmount
      ? parseFloat(revenueResult._sum.totalAmount.toString())
      : 0,
    activeOrganizers,
    pendingOrganizers,
  };
}

// ─── REVENUE OVER TIME (for charts) ──────────

export async function getRevenueOverTime(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await db.order.findMany({
    where: {
      status: "COMPLETED",
      createdAt: { gte: startDate },
    },
    select: { createdAt: true, totalAmount: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by day
  const grouped: Record<string, number> = {};
  orders.forEach((order) => {
    const day = order.createdAt.toISOString().split("T")[0];
    grouped[day] = (grouped[day] || 0) + parseFloat(order.totalAmount.toString());
  });

  // Fill in missing days with 0
  const result: { date: string; revenue: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, revenue: grouped[key] || 0 });
  }

  return result;
}

// ─── TICKETS SOLD OVER TIME (for charts) ─────

export async function getTicketsSoldOverTime(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const tickets = await db.ticket.findMany({
    where: { createdAt: { gte: startDate } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const grouped: Record<string, number> = {};
  tickets.forEach((ticket) => {
    const day = ticket.createdAt.toISOString().split("T")[0];
    grouped[day] = (grouped[day] || 0) + 1;
  });

  const result: { date: string; tickets: number }[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    result.push({ date: key, tickets: grouped[key] || 0 });
  }

  return result;
}

// ─── CATEGORIES / LOCATIONS ──────────────────

export async function getAllCategoriesAdmin() {
  return db.category.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { name: "asc" },
  });
}

export async function getAllLocationsAdmin() {
  return db.location.findMany({
    include: { _count: { select: { events: true } } },
    orderBy: { name: "asc" },
  });
}
