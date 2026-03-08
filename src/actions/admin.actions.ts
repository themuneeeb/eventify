"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils";

// ─── AUTH GUARD ──────────────────────────────

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

// ─── USER MANAGEMENT ─────────────────────────

export async function approveOrganizerAction(userId: string) {
  await requireAdmin();

  await db.user.update({
    where: { id: userId },
    data: { isApproved: true },
  });

  revalidatePath("/dashboard/admin/users");
  revalidatePath("/dashboard/admin");
  return { success: "Organizer approved successfully" };
}

export async function blockUserAction(userId: string) {
  await requireAdmin();

  await db.user.update({
    where: { id: userId },
    data: { isBlocked: true },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: "User blocked successfully" };
}

export async function unblockUserAction(userId: string) {
  await requireAdmin();

  await db.user.update({
    where: { id: userId },
    data: { isBlocked: false },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: "User unblocked successfully" };
}

export async function changeUserRoleAction(userId: string, role: string) {
  await requireAdmin();

  if (!["ATTENDEE", "ORGANIZER", "ADMIN"].includes(role)) {
    return { error: "Invalid role" };
  }

  await db.user.update({
    where: { id: userId },
    data: { role: role as "ATTENDEE" | "ORGANIZER" | "ADMIN" },
  });

  revalidatePath("/dashboard/admin/users");
  return { success: `Role changed to ${role}` };
}

// ─── CATEGORY MANAGEMENT ─────────────────────

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

export async function createCategoryAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const validated = categorySchema.safeParse({ name: formData.get("name") });
  if (!validated.success) return { error: validated.error.issues[0].message };

  const slug = slugify(validated.data.name);
  const existing = await db.category.findUnique({ where: { slug } });
  if (existing) return { error: "Category already exists" };

  await db.category.create({ data: { name: validated.data.name, slug } });

  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/events");
  revalidatePath("/categories");
  return { success: "Category created" };
}

export async function deleteCategoryAction(categoryId: string) {
  await requireAdmin();

  const eventsUsing = await db.event.count({ where: { categoryId } });
  if (eventsUsing > 0) {
    return { error: `Cannot delete: ${eventsUsing} events use this category` };
  }

  await db.category.delete({ where: { id: categoryId } });
  revalidatePath("/dashboard/admin/categories");
  revalidatePath("/events");
  revalidatePath("/categories");
  return { success: "Category deleted" };
}

// ─── LOCATION MANAGEMENT ─────────────────────

const locationSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(2).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
});

export async function createLocationAction(
  _prevState: { error?: string; success?: string } | undefined,
  formData: FormData
) {
  await requireAdmin();

  const validated = locationSchema.safeParse({
    name: formData.get("name"),
    address: formData.get("address"),
    city: formData.get("city"),
    country: formData.get("country"),
  });
  if (!validated.success) return { error: validated.error.issues[0].message };

  await db.location.create({ data: validated.data });

  revalidatePath("/dashboard/admin/locations");
  return { success: "Location created" };
}

export async function deleteLocationAction(locationId: string) {
  await requireAdmin();

  const eventsUsing = await db.event.count({ where: { locationId } });
  if (eventsUsing > 0) {
    return { error: `Cannot delete: ${eventsUsing} events use this location` };
  }

  await db.location.delete({ where: { id: locationId } });
  revalidatePath("/dashboard/admin/locations");
  return { success: "Location deleted" };
}
