"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    return { showToast: () => {} };
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...(prev ?? []), { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => (prev ?? []).filter((t) => t?.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => (prev ?? []).filter((t) => t?.id !== id));
  };

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts?.map?.((toast) => {
            const Icon = icons[toast?.type ?? 'info'] ?? Info;
            return (
              <motion.div
                key={toast?.id ?? ''}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-white shadow-lg min-w-[300px]",
                  colors[toast?.type ?? 'info'] ?? colors.info
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1 text-sm">{toast?.message ?? ''}</span>
                <button
                  onClick={() => removeToast(toast?.id ?? '')}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          }) ?? []}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
