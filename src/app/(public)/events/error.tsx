"use client";

import { useEffect } from "react";
import { ErrorFallback } from "../../../components/shared/error-fallback";

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Events page error:", error);
  }, [error]);

  return (
    <div className="container-main py-12">
      <ErrorFallback
        title="Failed to load events"
        message="We couldn't fetch the events. Please try again."
        retry={reset}
      />
    </div>
  );
}
