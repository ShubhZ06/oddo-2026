"use client";

import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

let toastListener: ((toast: ToastData) => void) | null = null;

export function showToast(type: ToastType, message: string, duration = 4000) {
  const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  if (toastListener) {
    toastListener({ id, type, message, duration });
  }
}

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const TYPE_STYLES = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-danger/30 bg-danger/10 text-danger",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    toastListener = (toast) => {
      setToasts((prev) => [...prev, toast]);
      if (toast.duration && toast.duration > 0) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration);
        timersRef.current.set(toast.id, timer);
      }
    };
    return () => {
      toastListener = null;
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  };

  return (
    <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3 w-[380px] max-w-[90vw]" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg animate-fade-in-down ${TYPE_STYLES[toast.type]}`}
          >
            <Icon size={18} className="shrink-0" />
            <span className="flex-1 text-sm font-medium">{toast.message}</span>
            <button
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
