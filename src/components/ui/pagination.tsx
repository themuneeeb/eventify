"use client";

import { cn } from "../../lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { UrlObject } from "url";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number): UrlObject {
    return {
      pathname: basePath,
      query: {
        ...searchParams,
        page: String(page),
      },
    };
  }

  // Generate page numbers to show
  const pages: (number | "ellipsis")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis");
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="text-brand-soft-black hover:bg-brand-cream flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="text-brand-sage/50 flex h-9 w-9 items-center justify-center rounded-lg">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-brand-sage flex h-9 w-9 items-center justify-center text-sm"
          >
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-brand-orange text-white"
                : "text-brand-soft-black hover:bg-brand-cream"
            )}
            aria-current={page === currentPage ? "page" : undefined}
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="text-brand-soft-black hover:bg-brand-cream flex h-9 w-9 items-center justify-center rounded-lg transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="text-brand-sage/50 flex h-9 w-9 items-center justify-center rounded-lg">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
