"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Route,
  Plus,
  Search,
  ArrowRight,
  Filter,
  Calendar,
  DollarSign,
  Truck,
  User,
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RotateCcw,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import type { Trip } from "@/types";

export default function TripListPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    dispatched: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/trips");
      const data = await res.json();
      if (data.success) {
        setTrips(data.data);
        calculateStats(data.data);
      } else {
        showToast("error", data.error || "Failed to load trips");
      }
    } catch (error) {
      console.error(error);
      showToast("error", "An error occurred while fetching trips");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (list: Trip[]) => {
    const s = {
      total: list.length,
      draft: list.filter((t) => t.status === "DRAFT").length,
      dispatched: list.filter((t) => t.status === "DISPATCHED").length,
      completed: list.filter((t) => t.status === "COMPLETED").length,
      cancelled: list.filter((t) => t.status === "CANCELLED").length,
    };
    setStats(s);
  };

  // Filter logic
  const filteredTrips = trips.filter((t) => {
    const matchSearch =
      t.source.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      (t.vehicle?.registrationNumber || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.driver?.name || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DRAFT":
        return Clock;
      case "DISPATCHED":
        return Play;
      case "COMPLETED":
        return CheckCircle2;
      case "CANCELLED":
        return XCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <Route className="text-primary-light" size={24} />
            Trip Management
          </h1>
          <p className="text-text-secondary text-sm">
            Dispatch fleet assets, monitor active routes, and review logs.
          </p>
        </div>

        <Link
          href="/trips/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-primary to-primary-light rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(108,92,231,0.3)] shrink-0 self-start sm:self-auto"
        >
          <Plus size={16} />
          Create Trip
        </Link>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Trips", val: stats.total, color: "text-text", bg: "bg-white/5" },
          { label: "Drafts", val: stats.draft, color: "text-text-secondary", bg: "bg-white/5" },
          { label: "Dispatched", val: stats.dispatched, color: "text-info", bg: "bg-info/10" },
          { label: "Completed", val: stats.completed, color: "text-success", bg: "bg-success/10" },
          { label: "Cancelled", val: stats.cancelled, color: "text-danger", bg: "bg-danger/10" },
        ].map((item, idx) => (
          <div key={idx} className={`p-4 rounded-xl border border-border ${item.bg}`}>
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider block mb-1">
              {item.label}
            </span>
            <span className={`text-2xl font-bold ${item.color}`}>
              {loading ? "..." : item.val}
            </span>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-bg-secondary p-4 rounded-xl border border-border">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 text-text-muted" size={18} />
          <input
            type="text"
            placeholder="Search source, dest, registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-light focus:ring-1 focus:ring-primary-light transition-all text-text placeholder:text-text-muted"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto self-start md:self-auto pb-2 md:pb-0">
          <Filter size={16} className="text-text-muted shrink-0" />
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider shrink-0">
            Filter Status:
          </span>
          <div className="flex gap-2">
            {["ALL", "DRAFT", "DISPATCHED", "COMPLETED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-bg hover:bg-white/5 text-text-secondary hover:text-text border border-border"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List Container */}
      <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-secondary gap-3">
            <Clock className="animate-spin text-primary-light" size={32} />
            <span className="text-sm">Loading trips from operational database...</span>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-text-secondary gap-3">
            <AlertCircle size={32} className="text-text-muted" />
            <span className="text-sm">No trips match your current search/filters.</span>
            {search || statusFilter !== "ALL" ? (
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="text-xs text-primary-light hover:underline font-semibold flex items-center gap-1 mt-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                Clear Filters
              </button>
            ) : (
              <Link
                href="/trips/new"
                className="text-xs text-primary-light hover:underline font-semibold"
              >
                Create your first trip draft
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">ID / Route</th>
                  <th className="px-6 py-4">Vehicle & Driver</th>
                  <th className="px-6 py-4">Cargo & Distance</th>
                  <th className="px-6 py-4">Revenue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-sm">
                {filteredTrips.map((trip) => {
                  const StatusIcon = getStatusIcon(trip.status);
                  return (
                    <tr
                      key={trip.id}
                      className="hover:bg-white/2 transition-colors group"
                    >
                      {/* ID / Route */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-xs text-text-muted mb-1">
                            TRIP #{trip.id}
                          </span>
                          <div className="flex items-center gap-1.5 font-medium text-text">
                            <span>{trip.source}</span>
                            <ArrowRight size={12} className="text-text-muted" />
                            <span>{trip.destination}</span>
                          </div>
                        </div>
                      </td>

                      {/* Vehicle & Driver */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <Truck size={12} className="text-primary-light" />
                            <Link
                              href={`/vehicles/${trip.vehicleId}`}
                              className="hover:text-primary-light font-medium"
                            >
                              {trip.vehicle?.registrationNumber || `Vehicle #${trip.vehicleId}`}
                            </Link>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                            <User size={12} className="text-secondary" />
                            <span className="font-medium">
                              {trip.driver?.name || `Driver #${trip.driverId}`}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Cargo & Distance */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatNumber(trip.cargoWeightKg)} kg
                          </span>
                          <span className="text-xs text-text-muted">
                            {trip.distanceKm} km
                          </span>
                        </div>
                      </td>

                      {/* Revenue */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-success">
                          {formatCurrency(trip.revenue)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-1">
                          <StatusBadge status={trip.status} label={trip.status} />
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs text-text-muted">
                          <span>Created: {formatDate(trip.createdAt)}</span>
                          {trip.dispatchedAt && (
                            <span>Disp: {formatDate(trip.dispatchedAt)}</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/trips/${trip.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-bg hover:bg-white/5 border border-border text-xs font-semibold text-text hover:text-primary-light transition-colors cursor-pointer"
                        >
                          <Eye size={12} />
                          Details
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
