import Link from "next/link";
import type { Route } from "next";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: Route;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

// RSC — no "use client", lightweight
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", className)}>
      <ol className="flex items-center gap-1.5 text-sm">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              {idx > 0 && <ChevronRight className="text-brand-sage h-3.5 w-3.5" />}
              {isLast || !item.href ? (
                <span
                  className={cn(
                    isLast ? "text-brand-charcoal font-medium" : "text-brand-sage"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-brand-soft-black hover:text-brand-orange transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
