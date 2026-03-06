import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  string,
  {
    label: string;
    variant: "default" | "success" | "destructive" | "secondary" | "outline";
  }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  PUBLISHED: { label: "Published", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "destructive" },
  COMPLETED: { label: "Completed", variant: "outline" },
};

export function EventStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.DRAFT;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
