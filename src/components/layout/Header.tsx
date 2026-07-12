"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {

  return (
    <header className="h-16 bg-surface-primary border-b border-border-default flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center w-96 relative">
        <Search className="absolute left-3 text-text-muted" size={18} />
        <input
          type="text"
          placeholder="Search vehicles, drivers, trips..."
          className="w-full bg-surface-secondary border border-border-default rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text-primary placeholder:text-text-muted"
        />
      </div>

      <div className="flex-1 flex justify-end items-center gap-5">
        <button className="relative text-text-secondary hover:text-text-primary transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-surface-primary"></span>
        </button>
      </div>
    </header>
  );
}
