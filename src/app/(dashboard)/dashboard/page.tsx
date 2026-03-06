import { auth } from "@/lib/auth";
import type { Route } from "next";
import { redirect } from "next/navigation";
import { getDashboardRedirectByRole } from "../../../config/dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const targetPath = getDashboardRedirectByRole(session.user.role);
  redirect(targetPath as Route);
}
