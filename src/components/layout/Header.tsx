"use client";

import NotificationPanel from "./NotificationPanel";

export default function Header() {
  return (
    <header className="h-16 bg-surface-primary border-b border-border-default flex items-center justify-end px-8 sticky top-0 z-30">
      <NotificationPanel />
    </header>
  );
}

