import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllCategoriesAdmin, getAllLocationsAdmin } from "@/services/admin.service";
import { CategoryManager } from "@/components/admin/category-manager";
import { LocationManager } from "@/components/admin/location-manager";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories & Locations" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const [categories, locations] = await Promise.all([
    getAllCategoriesAdmin(),
    getAllLocationsAdmin(),
  ]);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Admin", href: "/dashboard/admin" },
          { label: "Categories & Locations" },
        ]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">Categories & Locations</h1>
      <p className="text-brand-soft-black mt-1">
        Manage event categories and venue locations.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryManager categories={categories} />
        <LocationManager locations={locations} />
      </div>
    </div>
  );
}
