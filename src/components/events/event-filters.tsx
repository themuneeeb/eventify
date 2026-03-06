"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Route } from "next";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";

interface EventFiltersProps {
  categories: { id: string; name: string; slug: string; eventCount: number }[];
}

export function EventFilters({ categories }: EventFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeCategory = searchParams.get("category") || "";
  const activeSort = searchParams.get("sortBy") || "startDate";

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // reset pagination
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
    });
  }

  function clearAllFilters() {
    startTransition(() => {
      router.push(pathname as Route, { scroll: false });
    });
  }

  const hasFilters = searchParams.toString() !== "";

  return (
    <div className="space-y-4">
      {/* Category filter chips — HCI: Recognition, visual feedback */}
      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal className="text-brand-sage h-4 w-4" />

        <button
          onClick={() => updateFilter("category", "")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            !activeCategory
              ? "bg-brand-orange text-white"
              : "bg-brand-cream text-brand-soft-black hover:bg-brand-sage/20"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateFilter("category", cat.slug)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              activeCategory === cat.slug
                ? "bg-brand-orange text-white"
                : "bg-brand-cream text-brand-soft-black hover:bg-brand-sage/20"
            }`}
          >
            {cat.name}
            {cat.eventCount > 0 && (
              <span className="ml-1 opacity-70">({cat.eventCount})</span>
            )}
          </button>
        ))}
      </div>

      {/* Sort + clear row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-brand-sage text-xs">
            Sort by:
          </label>
          <select
            id="sortBy"
            value={activeSort}
            onChange={(e) => updateFilter("sortBy", e.target.value)}
            className="border-brand-sage/30 text-brand-charcoal focus:border-brand-orange rounded-lg border bg-white px-2 py-1 text-xs focus:outline-none"
          >
            <option value="startDate">Date (Soonest)</option>
            <option value="title">Title (A-Z)</option>
            <option value="createdAt">Newest</option>
          </select>
        </div>

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-brand-sage hover:text-destructive text-xs"
          >
            <X className="h-3 w-3" /> Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
