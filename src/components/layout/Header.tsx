"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { getRoleDisplayName } from "@/lib/auth";
import type { Role } from "@/types";

export default function Header() {
  const [userName, setUserName] = useState("Admin User");
  const [userRole, setUserRole] = useState<Role>("FLEET_MANAGER");

  useEffect(() => {
    const sessionStr = localStorage.getItem("transitops_session");
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session.name) setUserName(session.name);
        if (session.role) setUserRole(session.role as Role);
      } catch (e) {
        console.error("Failed to parse session in Header", e);
      }
    }
  }, []);

  // Check if we should override display name of DRIVER to Dispatcher
  const getDisplayRole = (role: Role) => {
    if (role === "DRIVER") return "Dispatcher";
    return getRoleDisplayName(role);
  };

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
        
        <div className="h-8 w-px bg-border-default"></div>
        
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium leading-none mb-1 group-hover:text-primary-light transition-colors">{userName}</div>
            <div className="text-xs text-text-muted leading-none">{getDisplayRole(userRole)}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary-light border border-primary/30">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
