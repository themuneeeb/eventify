import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDateTime } from "@/lib/utils";
import { User, Mail, Shield, Calendar } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isApproved: true,
      createdAt: true,
      _count: { select: { organizedEvents: true, orders: true, tickets: true } },
    },
  });

  if (!user) redirect("/login");

  const roleLabelMap: Record<string, string> = {
    ADMIN: "Administrator",
    ORGANIZER: "Event Organizer",
    ATTENDEE: "Attendee",
  };

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const dashboardHref =
    user.role === "ADMIN"
      ? "/dashboard/admin"
      : user.role === "ORGANIZER"
        ? "/dashboard/organizer"
        : "/events";

  return (
    <div>
      <Breadcrumbs
        items={[{ label: "Dashboard", href: dashboardHref }, { label: "Settings" }]}
      />

      <h1 className="text-brand-charcoal text-2xl font-bold">Account Settings</h1>
      <p className="text-brand-soft-black mt-1">
        View and manage your profile information.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your account details and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {user.image && <AvatarImage src={user.image} alt={user.name || "User"} />}
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-brand-charcoal text-lg font-semibold">
                  {user.name || "—"}
                </h3>
                <Badge variant="secondary">{roleLabelMap[user.role]}</Badge>
              </div>
            </div>

            <Separator />

            {/* Info rows */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="text-brand-sage h-4 w-4" />
                <div>
                  <p className="text-brand-sage text-xs">Full Name</p>
                  <p className="text-brand-charcoal text-sm font-medium">
                    {user.name || "Not set"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-brand-sage h-4 w-4" />
                <div>
                  <p className="text-brand-sage text-xs">Email</p>
                  <p className="text-brand-charcoal text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="text-brand-sage h-4 w-4" />
                <div>
                  <p className="text-brand-sage text-xs">Role</p>
                  <p className="text-brand-charcoal text-sm font-medium">
                    {roleLabelMap[user.role]}
                    {user.role === "ORGANIZER" && (
                      <Badge
                        variant={user.isApproved ? "success" : "outline"}
                        className="ml-2 text-xs"
                      >
                        {user.isApproved ? "Approved" : "Pending Approval"}
                      </Badge>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-brand-sage h-4 w-4" />
                <div>
                  <p className="text-brand-sage text-xs">Member Since</p>
                  <p className="text-brand-charcoal text-sm font-medium">
                    {formatDateTime(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity summary */}
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.role === "ORGANIZER" || user.role === "ADMIN" ? (
              <div className="bg-brand-off-white rounded-lg p-3">
                <p className="text-brand-charcoal text-2xl font-bold">
                  {user._count.organizedEvents}
                </p>
                <p className="text-brand-sage text-xs">Events Created</p>
              </div>
            ) : null}

            <div className="bg-brand-off-white rounded-lg p-3">
              <p className="text-brand-charcoal text-2xl font-bold">
                {user._count.orders}
              </p>
              <p className="text-brand-sage text-xs">Orders Placed</p>
            </div>

            <div className="bg-brand-off-white rounded-lg p-3">
              <p className="text-brand-charcoal text-2xl font-bold">
                {user._count.tickets}
              </p>
              <p className="text-brand-sage text-xs">Tickets Owned</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
