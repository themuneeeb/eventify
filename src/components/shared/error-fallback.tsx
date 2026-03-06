"use client";

import { Button } from "../../components/ui/button";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  retry?: () => void;
}

export function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  retry,
}: ErrorFallbackProps) {
  return (
    <div className="border-destructive/20 bg-destructive/5 flex flex-col items-center justify-center rounded-xl border px-6 py-12 text-center">
      <AlertCircle className="text-destructive h-10 w-10" />
      <h3 className="text-brand-charcoal mt-4 text-lg font-semibold">{title}</h3>
      <p className="text-brand-soft-black mt-1 max-w-sm text-sm">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline" className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
