"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
  Users,
  CheckCircle,
  AlertTriangle,
  Award,
} from "lucide-react";
import DriverFormModal from "@/components/drivers/DriverFormModal";
import DriverDetailModal from "@/components/drivers/DriverDetailModal";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import { showToast } from "@/components/ui/Toast";
import ToastContainer from "@/components/ui/Toast";
import { formatDate, isExpired, isExpiringSoon } from "@/lib/utils";
import type { Driver, DriverStatus } from "@/types";

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (statusFilter) queryParams.append("status", statusFilter);

      const response = await fetch(`/api/drivers?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setDrivers(data.data || []);
      } else {
        showToast("error", data.error || "Failed to load drivers.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "Network error. Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the profile for ${name}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/drivers/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        showToast("success", `${name} deleted successfully.`);
        fetchDrivers();
      } else {
        showToast("error", data.error || "Failed to delete driver.");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "An error occurred while deleting driver.");
    }
  };

  const handleEdit = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsFormOpen(true);
  };

  const handleView = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsDetailOpen(true);
  };

  const handleAdd = () => {
    setSelectedDriver(null);
    setIsFormOpen(true);
  };

  // Metrics calculations
  const totalCount = drivers.length;
  const availableCount = drivers.filter((d) => d.status === "AVAILABLE").length;
  const expiringLicensesCount = drivers.filter((d) =>
    isExpiringSoon(d.licenseExpiry, 30)
  ).length;
  const avgSafetyScore =
    drivers.reduce((acc, d) => acc + d.safetyScore, 0) / (totalCount || 1);

  // Safety score formatting helper
  const getSafetyScoreColor = (score: number) => {
    if (score >= 90) return "text-success bg-success/10 border-success/20";
    if (score >= 70) return "text-warning bg-warning/10 border-warning/20";
    return "text-danger bg-danger/10 border-danger/20";
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <ToastContainer />
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Driver Directory</h1>
          <p className="text-text-primary-primary-secondary text-sm">
            Manage your fleet drivers, monitor credentials, and review safety statistics
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-lg transition-colors cursor-pointer text-sm font-semibold shadow-md shadow-primary/10 select-none"
        >
          <Plus size={16} />
          Register Driver
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Registered Drivers"
          value={totalCount.toString()}
          icon={Users}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
        />
        <StatCard
          label="Available / Active"
          value={availableCount.toString()}
          icon={CheckCircle}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="Expiring Licenses (<30d)"
          value={expiringLicensesCount.toString()}
          icon={AlertTriangle}
          iconBg="bg-warning/15"
          iconColor="text-warning"
          trend={
            expiringLicensesCount > 0
              ? { value: "Requires action", isPositive: false }
              : undefined
          }
        />
        <StatCard
          label="Avg Safety Score"
          value={`${avgSafetyScore.toFixed(1)}/100`}
          icon={Award}
          iconBg="bg-info/15"
          iconColor="text-info"
        />
      </div>

      {/* Filter / Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-end bg-surface-secondary p-4 rounded-xl border border-border-default">
        {/* Filters Group */}
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-secondary border border-border-default rounded-lg px-3 py-2.5 text-sm text-text-primary-primary focus:outline-none focus:border-primary/50"
          >
            <option value="">All Duty Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="OFF_DUTY">Off Duty</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <button
            onClick={fetchDrivers}
            className="p-2.5 bg-surface-secondary border border-border-default hover:bg-white/5 text-text-primary-primary-secondary hover:text-text-primary-primary rounded-lg transition-colors cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Main Drivers List (Grid) */}
      {loading ? (
        // Loading State
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-[210px] rounded-xl border border-border-default bg-surface-secondary/40 animate-pulse"
            ></div>
          ))}
        </div>
      ) : drivers.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center p-16 bg-surface-secondary border border-border-default rounded-xl text-center">
          <div className="w-16 h-16 rounded-full bg-white/3 flex items-center justify-center text-text-primary-primary-muted mb-4 border border-border-default/50">
            <Users size={28} />
          </div>
          <h3 className="text-lg font-bold mb-1">No Drivers Found</h3>
          <p className="text-sm text-text-primary-primary-secondary max-w-sm mb-6">
            We couldn't find any drivers matching your criteria. Try adjusting your search query or filters.
          </p>
          {(searchQuery || statusFilter) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("");
              }}
              className="px-4 py-2 border border-border-default rounded-lg text-text-primary-primary hover:bg-white/5 transition-colors cursor-pointer text-sm font-semibold"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        // Drivers Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => {
            const licenseExpired = isExpired(driver.licenseExpiry);
            const licenseSoon = isExpiringSoon(driver.licenseExpiry, 30);

            return (
              <div
                key={driver.id}
                className="group relative bg-surface-secondary border border-border-default rounded-xl p-5 hover:border-primary/45 hover:bg-surface-hover transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex flex-col gap-4 overflow-hidden"
              >
                {/* Status indicator glow strip */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 transition-colors ${
                    driver.status === "AVAILABLE"
                      ? "bg-success"
                      : driver.status === "ON_TRIP"
                      ? "bg-info"
                      : driver.status === "SUSPENDED"
                      ? "bg-danger"
                      : "bg-text-muted"
                  }`}
                ></div>

                {/* Card Header (Name and Status) */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-0.5">
                    <h3 className="font-bold text-base leading-tight group-hover:text-primary-light transition-colors">
                      {driver.name}
                    </h3>
                    <span className="text-xs text-text-primary-primary-muted font-medium font-mono">
                      {driver.licenseNumber}
                    </span>
                  </div>
                  <StatusBadge status={driver.status} />
                </div>

                {/* Card Content Details */}
                <div className="flex flex-col gap-2.5 text-xs border-t border-border-default/40 pt-4 flex-1">
                  <div className="flex justify-between">
                    <span className="text-text-primary-primary-secondary">Category:</span>
                    <span className="font-semibold text-text-primary-primary">{driver.licenseCategory}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-primary-primary-secondary">License Expiry:</span>
                    <span
                      className={`font-semibold ${
                        licenseExpired
                          ? "text-danger"
                          : licenseSoon
                          ? "text-warning"
                          : "text-text-primary-primary"
                      }`}
                    >
                      {formatDate(driver.licenseExpiry)}
                      {licenseSoon && " (Expiring)"}
                      {licenseExpired && " (Expired)"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-text-primary-primary-secondary">Contact:</span>
                    <span className="font-semibold text-text-primary-primary">{driver.contactNumber}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-text-primary-primary-secondary">Safety Rating:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSafetyScoreColor(
                        driver.safetyScore
                      )}`}
                    >
                      {driver.safetyScore.toFixed(1)} / 100
                    </span>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center gap-2 border-t border-border-default/40 pt-4 shrink-0">
                  <button
                    onClick={() => handleView(driver)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white/3 hover:bg-white/7 border border-border-default hover:border-border-default-hover text-text-primary-primary-secondary hover:text-text-primary-primary py-2 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                  >
                    <Eye size={14} />
                    View Details
                  </button>

                  <button
                    onClick={() => handleEdit(driver)}
                    className="p-2 bg-white/3 hover:bg-white/7 border border-border-default hover:border-border-default-hover text-text-primary-primary-secondary hover:text-text-primary-primary rounded-lg transition-colors cursor-pointer"
                    title="Edit Details"
                  >
                    <Edit2 size={14} />
                  </button>

                  <button
                    onClick={() => handleDelete(driver.id, driver.name)}
                    className="p-2 bg-danger/5 hover:bg-danger/15 border border-danger/10 hover:border-danger/30 text-danger rounded-lg transition-colors cursor-pointer"
                    title="Remove Profile"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <DriverFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={fetchDrivers}
        driver={selectedDriver}
      />

      {/* Detail View Modal */}
      <DriverDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        driver={selectedDriver}
      />
    </div>
  );
}
