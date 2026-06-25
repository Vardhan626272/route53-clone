"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, message, type }]);
      window.setTimeout(() => dismissToast(id), 4500);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({ toasts, showToast, dismissToast }),
    [toasts, showToast, dismissToast],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

const toastStyles: Record<ToastType, string> = {
  success: "border-l-4 border-l-emerald-500 bg-white",
  error: "border-l-4 border-l-red-500 bg-white",
  info: "border-l-4 border-l-aws-orange bg-white",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded border border-aws-border shadow-lg ${toastStyles[toast.type]}`}
          role="status"
        >
          <div className="flex items-start justify-between gap-3 px-4 py-3">
            <p className="text-sm text-aws-text">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-aws-muted hover:text-aws-text"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
