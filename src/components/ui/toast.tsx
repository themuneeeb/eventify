"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const styles = {
    success: "border-success/30 bg-success/5",
    error: "border-destructive/30 bg-destructive/5",
    info: "border-brand-orange/30 bg-brand-orange/5",
  };

  const iconStyles = {
    success: "text-success",
    error: "text-destructive",
    info: "text-brand-orange",
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* HCI: Feedback — always-visible toast area */}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={cn(
                "flex max-w-[420px] min-w-[320px] items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
                "animate-slide-in-right",
                styles[toast.type]
              )}
              role="alert"
            >
              <Icon className={cn("h-5 w-5 shrink-0", iconStyles[toast.type])} />
              <div className="flex-1">
                <p className="text-brand-charcoal text-sm font-medium">{toast.title}</p>
                {toast.message && (
                  <p className="text-brand-soft-black mt-1 text-xs">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="text-brand-sage hover:text-brand-charcoal h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
