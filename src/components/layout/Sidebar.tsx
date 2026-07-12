"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getRoleDisplayName } from "@/lib/auth";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Bell,
  LogOut
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

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const userRole = user?.role || "FLEET_MANAGER";

  const navItems = !loading 
    ? NAV_ITEMS.filter((item) => item.roles.includes(userRole))
    : [];

  const handleSignOut = () => {
    localStorage.removeItem("transitops_session");
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[300px] bg-white flex flex-col z-40 p-6 rounded-r-[32px] shadow-sm my-4 ml-4 h-[calc(100vh-32px)] border border-[#e5e7eb]">
      
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-black flex items-center justify-center rounded">
          <div className="text-white font-black text-sm">RM</div>
        </div>
        <span className="font-bold text-xl text-black tracking-tight">RouteMinds</span>
      </div>

      {/* User Profile */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f4f5f5] mb-8 border border-[#e5e7eb]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden relative">
             <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/150?img=11')] bg-cover" />
          </div>
          <div>
            <div className="text-sm font-semibold text-black">{user?.name || "User"}</div>
            <div className="text-xs text-gray-500">{user?.role === "FLEET_MANAGER" ? "Admin" : getRoleDisplayName(userRole)}</div>
          </div>
        </div>
        <Link 
          href="/settings"
          title="Settings"
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#e5e7eb] text-black hover:bg-gray-200 transition-colors cursor-pointer"
        >
          <Settings size={16} />
        </Link>
      </div>

      {/* Nav */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Dashboard button */}
        <Link 
          href="/dashboard"
          className={`flex items-center justify-center gap-3 py-6 rounded-[24px] transition-all font-semibold ${
            pathname === "/dashboard" || pathname === "/dashboard/"
              ? "bg-black text-white" 
              : "bg-white text-black border border-[#e5e7eb] hover:bg-[#f4f5f5]"
          }`}
        >
          <LayoutDashboard size={20} />
          Dashboard
        </Link>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3 mt-2 overflow-y-auto pb-4">
          {navItems.filter(item => item.label !== "Dashboard").map(item => {
            const isActive = pathname.startsWith(item.href);
            const IconComponent = ICON_MAP[item.icon] || Truck;
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-2 py-5 px-2 rounded-[20px] transition-all border text-center ${
                  isActive
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-[#e5e7eb] hover:bg-[#f4f5f5]"
                }`}
              >
                <IconComponent size={22} />
                <span className="text-[11px] font-medium leading-tight">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={handleSignOut}
          className="flex items-center justify-center gap-3 py-4 rounded-[20px] bg-white text-black hover:bg-[#f4f5f5] w-full transition-colors font-medium border border-[#e5e7eb]"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
