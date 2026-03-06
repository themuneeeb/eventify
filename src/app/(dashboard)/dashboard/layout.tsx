import { Sidebar } from "../../../components/layout/sidebar";
import { Topbar } from "../../../components/layout/topbar";
import { getSidebarItemsByRole } from "../../../config/dashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const sidebarItems = getSidebarItemsByRole(session.user.role);

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <Topbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
