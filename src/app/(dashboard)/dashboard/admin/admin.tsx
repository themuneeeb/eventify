import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Users, Calendar, DollarSign, Activity } from "lucide-react";

// Placeholder — real data in Phase 6
export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "—", icon: Users },
    { label: "Total Events", value: "—", icon: Calendar },
    { label: "Total Revenue", value: "—", icon: DollarSign },
    { label: "Active Users", value: "—", icon: Activity },
  ];

  return (
    <div>
      <h1 className="text-brand-charcoal text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-brand-soft-black mt-2">Platform overview and management.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-brand-soft-black text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className="text-brand-sage h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-brand-charcoal text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
