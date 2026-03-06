import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizer Analytics",
};

export default function OrganizerAnalyticsPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard/organizer" },
          { label: "Analytics" },
        ]}
      />
      <h1 className="text-brand-charcoal text-2xl font-bold">Analytics</h1>
      <div className="mt-6">
        <EmptyState
          icon={BarChart3}
          title="Analytics coming soon"
          description="Global analytics with charts and revenue breakdowns will be available in Phase 6."
        />
      </div>
    </div>
  );
}
