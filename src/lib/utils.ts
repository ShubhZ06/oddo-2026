// ===================================================
// TransitOps — Utility Functions
// ===================================================

/**
 * Format a date string to a readable format
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a date string to include time
 */
export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format currency values
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format numbers with comma separation
 */
export function formatNumber(num: number, decimals = 0): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
  }).format(num);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Check if a date has expired (is in the past)
 */
export function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date();
}

/**
 * Check if a date is expiring within N days
 */
export function isExpiringSoon(dateStr: string, days = 30): boolean {
  const expiry = new Date(dateStr);
  const now = new Date();
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= days;
}

/**
 * Convert data array to CSV string
 */
export function toCSV<T extends Record<string, unknown>>(
  data: T[],
  headers?: string[]
): string {
  if (data.length === 0) return "";

  const keys = headers || Object.keys(data[0]);
  const csvRows: string[] = [];

  // Header row
  csvRows.push(keys.join(","));

  // Data rows
  for (const row of data) {
    const values = keys.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return "";
      const str = String(val);
      // Escape commas and quotes
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

/**
 * Download CSV string as a file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Slugify a string (used for generating URL-safe strings)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Get status badge color class
 */
export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    AVAILABLE: "success",
    ON_TRIP: "info",
    IN_SHOP: "warning",
    RETIRED: "danger",
    OFF_DUTY: "muted",
    SUSPENDED: "danger",
    DRAFT: "muted",
    DISPATCHED: "info",
    COMPLETED: "success",
    CANCELLED: "danger",
    OPEN: "warning",
    CLOSED: "success",
  };
  return map[status] || "muted";
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
