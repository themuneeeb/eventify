import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Ticket, Calendar, Clock } from "lucide-react";

// Placeholder — real data in Phase 6
export default function AttendeeDashboardPage() {
  const stats = [
    { label: "My Tickets", value: "—", icon: Ticket },
    { label: "Upcoming Events", value: "—", icon: Calendar },
    { label: "Past Events", value: "—", icon: Clock },
  ];

  return (
    <div>
      <h1 className="text-brand-charcoal text-2xl font-bold">My Dashboard</h1>
      <p className="text-brand-soft-black mt-2">View your tickets and upcoming events.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
