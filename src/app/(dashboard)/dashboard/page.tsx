import { Badge } from "../../../components/ui/badge";

// Will redirect per role in Phase 2. For now, a static overview.
export default function DashboardPage() {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-brand-charcoal text-2xl font-bold">Dashboard</h1>
        <Badge>Phase 1</Badge>
      </div>
      <p className="text-brand-soft-black mt-2">
        Welcome to your Eventify dashboard. Role-based routing comes in Phase 2.
      </p>
    </div>
  );
}
