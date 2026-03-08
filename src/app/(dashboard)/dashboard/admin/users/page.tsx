import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllUsers } from "@/services/admin.service";
import { UserTable } from "@/components/admin/user-table";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Pagination } from "@/components/ui/pagination";
import { EventSearch } from "@/components/events/event-search";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/dashboard");

  const sp = await searchParams;
  const page = parseInt(sp.page || "1", 10);

  const { users, total, totalPages } = await getAllUsers({
    search: sp.search,
    role: sp.role,
    page,
  });

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Admin", href: "/dashboard/admin" }, { label: "Users" }]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">User Management</h1>
      <p className="text-brand-soft-black mt-1">{total} total users</p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div className="max-w-xs flex-1">
          <Suspense fallback={<Skeleton className="h-10 w-full rounded-lg" />}>
            <EventSearch />
          </Suspense>
        </div>
        <div className="flex gap-2">
          {["", "ATTENDEE", "ORGANIZER", "ADMIN"].map((role) => (
            <a
              key={role}
              href={`/dashboard/admin/users?role=${role}${sp.search ? `&search=${sp.search}` : ""}`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                (sp.role || "") === role
                  ? "bg-brand-orange text-white"
                  : "bg-brand-cream text-brand-soft-black hover:bg-brand-sage/20"
              }`}
            >
              {role || "All"}
            </a>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <UserTable users={users} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/dashboard/admin/users"
            searchParams={
              Object.fromEntries(
                Object.entries(sp).filter(([k, v]) => k !== "page" && v)
              ) as Record<string, string>
            }
          />
        </div>
      )}
    </div>
  );
}
