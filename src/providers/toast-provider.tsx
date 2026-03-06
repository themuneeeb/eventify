"use client";

import { ToastProvider as ToastContextProvider } from "@/components/ui/toast";
import { AuthProvider } from "@/providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastContextProvider>{children}</ToastContextProvider>
    </AuthProvider>
  );
}
