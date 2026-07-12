"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, X, Check } from "lucide-react";

interface AppNotification {
  id: string;
  type: "warning" | "info" | "danger" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ICON_MAP = {
  warning: { Icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 border-amber-200" },
  danger:  { Icon: XCircle,       color: "text-red-500",   bg: "bg-red-50 border-red-200" },
  info:    { Icon: Info,          color: "text-blue-500",  bg: "bg-blue-50 border-blue-200" },
  success: { Icon: CheckCircle,   color: "text-green-500", bg: "bg-green-50 border-green-200" },
};

export default function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const visible = notifications.filter((n) => !dismissed.has(n.id));
  const unreadCount = visible.filter((n) => !n.read).length;

  const dismissAll = () => setDismissed(new Set(notifications.map((n) => n.id)));
  const dismiss = (id: string) => setDismissed((prev) => new Set([...prev, id]));

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in-fast">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <p className="text-xs text-gray-400 mt-0.5">{unreadCount} unread alerts</p>
            </div>
            <div className="flex items-center gap-2">
              {visible.length > 0 && (
                <button
                  onClick={dismissAll}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100"
                >
                  <Check size={12} />
                  Clear all
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto divide-y divide-gray-50">
            {loading && visible.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <Bell size={32} className="mb-3 opacity-30" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-1">No new notifications.</p>
              </div>
            ) : (
              visible.map((n) => {
                const { Icon, color, bg } = ICON_MAP[n.type];
                return (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${bg}`}>
                      <Icon size={15} className={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-semibold text-gray-800 leading-snug">{n.title}</p>
                        <span className="text-[10px] text-gray-400 shrink-0 mt-0.5">{timeAgo(n.time)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.message}</p>
                    </div>
                    <button
                      onClick={() => dismiss(n.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-gray-600 hover:bg-gray-200 shrink-0 mt-0.5"
                      aria-label="Dismiss"
                    >
                      <X size={11} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {visible.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <button
                onClick={fetchNotifications}
                className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                Refresh notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}