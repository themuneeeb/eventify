"use client";

import { useEffect } from "react";
import { Button } from "../components/ui/button";
import { AlertCircle } from "lucide-react";

// Root error boundary — catches unhandled errors (HCI: Error recovery)
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error boundary caught:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <AlertCircle className="text-destructive h-12 w-12" />
      <h2 className="text-brand-charcoal mt-4 text-2xl font-semibold">
        Something went wrong!
      </h2>
      <p className="text-brand-soft-black mt-2 max-w-md">
        An unexpected error occurred. Please try again or contact support if the problem
        persists.
      </p>
      <Button onClick={reset} className="mt-6">
        Try Again
      </Button>
    </div>
  );
}
