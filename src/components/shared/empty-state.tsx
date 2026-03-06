import { cn } from "../../lib/utils";
import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-brand-sage/30 flex flex-col items-center justify-center rounded-xl border border-dashed bg-white px-6 py-16 text-center",
        className
      )}
    >
      <div className="bg-brand-cream flex h-14 w-14 items-center justify-center rounded-full">
        <Icon className="text-brand-sage h-7 w-7" />
      </div>
      <h3 className="text-brand-charcoal mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-brand-soft-black mt-1 max-w-sm text-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
