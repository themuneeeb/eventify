"use client";

import { Button } from "../components/ui/button";

// Catastrophic root error boundary — wraps entire <html>
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white p-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold" style={{ color: "#FF7F11" }}>
            Oops!
          </h1>
          <h2 className="mt-4 text-xl font-semibold" style={{ color: "#262626" }}>
            Something went seriously wrong
          </h2>
          <p className="mt-2 text-sm" style={{ color: "#3D3D3D" }}>
            The application encountered a critical error.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg px-6 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#FF7F11" }}
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
