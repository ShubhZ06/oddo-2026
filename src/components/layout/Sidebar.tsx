"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/auth";
import type { Role } from "@/types";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
};

interface SidebarProps {
  userRole?: Role;
}

export default function Sidebar({ userRole = "FLEET_MANAGER" }: SidebarProps) {
  const pathname = usePathname();
  
  const navItems = NAV_ITEMS.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface-secondary border-r border-border-default flex flex-col animate-fade-in z-40">
      <div className="h-16 flex items-center px-6 border-b border-border-default shrink-0">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
            <Truck size={18} color="white" />
          </div>
          <div>
            Transit<span className="text-primary-light">Ops</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        <div className="text-xs font-semibold text-text-primary-muted uppercase tracking-wider mb-2 px-3">
          Menu
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const IconComponent = ICON_MAP[item.icon] || Truck;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary-light"
                  : "text-text-primary-secondary hover:bg-white/5 hover:text-text-primary"
              }`}
            >
              <IconComponent size={18} className="shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border-default shrink-0">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 w-full transition-colors">
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
