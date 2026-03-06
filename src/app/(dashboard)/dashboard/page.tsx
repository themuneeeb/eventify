import { redirect } from "next/navigation";
import type { Route } from "next";
import { auth } from "@/lib/auth";
import { getDashboardRedirectByRole } from "@/config/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Attendees go to /events, organizers/admins go to their dashboard
  const targetPath = getDashboardRedirectByRole(session.user.role);
  redirect(targetPath as Route);
}
