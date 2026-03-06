import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Settings } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Settings",
};

export default function OrganizerSettingsPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "Settings" },
        ]}
      />
      <h1 className="text-brand-charcoal text-2xl font-bold">Settings</h1>
      <div className="mt-6">
        <EmptyState
          icon={Settings}
          title="Settings coming soon"
          description="Profile and organizer settings will be available in Phase 6."
        />
      </div>
    </div>
  );
}
