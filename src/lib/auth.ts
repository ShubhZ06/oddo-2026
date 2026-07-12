// ===================================================
// TransitOps — Auth Configuration (Placeholder)
// ===================================================
// Full NextAuth.js setup will be implemented in Page 1 (Auth & RBAC).
// This file provides shared auth utility functions.

import type { Role } from "@/types";

/**
 * Role hierarchy for permission checks.
 * Higher index = more permissions.
 */
const ROLE_HIERARCHY: Record<Role, number> = {
  DRIVER: 1,
  SAFETY_OFFICER: 2,
  FINANCIAL_ANALYST: 2,
  FLEET_MANAGER: 3,
};

/**
 * Check if a given role has sufficient permission level
 */
export function hasPermission(
  userRole: Role,
  requiredRoles: Role[]
): boolean {
  return requiredRoles.includes(userRole);
}

/**
 * Get display name for a role
 */
export function getRoleDisplayName(role: Role): string {
  const map: Record<Role, string> = {
    FLEET_MANAGER: "Fleet Manager",
    DRIVER: "Driver",
    SAFETY_OFFICER: "Safety Officer",
    FINANCIAL_ANALYST: "Financial Analyst",
  };
  return map[role] || role;
}

/**
 * Navigation items filtered by role
 */
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: Role[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"],
  },
  {
    label: "Vehicles",
    href: "/vehicles",
    icon: "Truck",
    roles: ["FLEET_MANAGER", "DRIVER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"],
  },
  {
    label: "Drivers",
    href: "/drivers",
    icon: "Users",
    roles: ["FLEET_MANAGER", "SAFETY_OFFICER"],
  },
  {
    label: "Trips",
    href: "/trips",
    icon: "Route",
    roles: ["FLEET_MANAGER", "DRIVER"],
  },
  {
    label: "Maintenance",
    href: "/maintenance",
    icon: "Wrench",
    roles: ["FLEET_MANAGER"],
  },
  {
    label: "Fuel & Expenses",
    href: "/expenses",
    icon: "Fuel",
    roles: ["FLEET_MANAGER", "DRIVER", "FINANCIAL_ANALYST"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "BarChart3",
    roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["FLEET_MANAGER"],
  },
];

/**
 * Get filtered nav items for a given role
 */
export function getNavItemsForRole(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
