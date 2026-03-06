import { Sidebar } from "../../../components/layout/sidebar";
import { Topbar } from "../../../components/layout/topbar";
import { getSidebarItemsByRole } from "../../../config/dashboard";

// Auth will be wired in Phase 2.
// For now, use a mock user so the layout renders.
const mockUser = {
  name: "Event Organizer",
  email: "organizer@eventify.com",
  image: null,
  role: "ORGANIZER",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebarItems = getSidebarItemsByRole(mockUser.role);

  return (
    <div className="flex min-h-screen">
      <Sidebar items={sidebarItems} />
      <div className="flex flex-1 flex-col">
        <Topbar user={mockUser} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
