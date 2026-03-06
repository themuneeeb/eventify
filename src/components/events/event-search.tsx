"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type { Route } from "next";
import { useState, useEffect, useTransition } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function EventSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("search") || "");

  // Debounced search — HCI: Responsive, doesn't block on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
        params.delete("page"); // reset pagination on new search
      } else {
        params.delete("search");
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}` as Route, { scroll: false });
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <Search className="text-brand-sage absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search events..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-brand-sage/50 placeholder:text-brand-sage focus:border-brand-orange focus:ring-brand-orange/20 flex h-10 w-full rounded-lg border bg-white pr-10 pl-10 text-sm transition-colors focus:ring-2 focus:outline-none"
        aria-label="Search events"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="text-brand-sage hover:text-brand-charcoal absolute top-1/2 right-3 -translate-y-1/2"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {isPending && (
        <div className="absolute top-1/2 right-10 -translate-y-1/2">
          <div className="border-brand-sage/30 border-t-brand-orange h-4 w-4 animate-spin rounded-full border-2" />
        </div>
      )}
    </div>
  );
}
