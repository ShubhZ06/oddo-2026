"use client";

import { useState } from "react";
import { Wrench, CheckCircle, Clock, DollarSign, Plus, ShieldAlert, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import Link from "next/link";
import type { MaintenanceType } from "@/types";
import { logMaintenance, closeMaintenance } from "@/actions/maintenance";

const TYPE_STYLES: Record<string, { label: string; cls: string }> = {
  GENERAL:          { label: "General",    cls: "bg-gray-100 text-gray-700 border-gray-200" },
  OIL_CHANGE:       { label: "Oil Change", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  TIRE_REPLACEMENT: { label: "Tires",      cls: "bg-blue-50 text-blue-700 border-blue-200" },
  ENGINE_REPAIR:    { label: "Engine",     cls: "bg-red-50 text-red-700 border-red-200" },
  BRAKE_SERVICE:    { label: "Brakes",     cls: "bg-purple-50 text-purple-700 border-purple-200" },
};

const TABS = ["All", "Open", "Closed"] as const;
type Tab = typeof TABS[number];

export default function MaintenanceClient({
  initialLogs,
  vehicles,
}: {
  initialLogs: any[];
  vehicles: any[];
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const handleCloseMaintenance = async (logId: number) => {
    const log = initialLogs.find((l) => l.id === logId);
    const vehicle = vehicles.find((v) => v.id === log?.vehicleId);
    const res = await closeMaintenance(logId);
    if (res.success && vehicle) {
      const s = vehicle.status === "RETIRED" ? "RETIRED" : "AVAILABLE";
      showToast("success", `Maintenance closed. ${vehicle.registrationNumber} is now ${s.toLowerCase()}.`);
    }
  };

  const openCount = initialLogs.filter((l) => l.status === "OPEN").length;
  const closedCount = initialLogs.filter((l) => l.status === "CLOSED").length;
  const inShopCount = vehicles.filter((v) => v.status === "IN_SHOP").length;
  const totalSpend = initialLogs.reduce((sum, l) => sum + l.cost, 0);
  const avgCost = initialLogs.length > 0 ? totalSpend / initialLogs.length : 0;

  const filtered = initialLogs.filter((log) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicleId);
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      vehicle?.registrationNumber?.toLowerCase().includes(q) ||
      vehicle?.nameModel?.toLowerCase().includes(q) ||
      log.type?.toLowerCase().includes(q) ||
      log.description?.toLowerCase().includes(q);
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Open" && log.status === "OPEN") ||
      (activeTab === "Closed" && log.status === "CLOSED");
    return matchesSearch && matchesTab;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full max-w-[1400px] mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-black tracking-tight">Maintenance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage shop orders, track repairs, and monitor fleet health.</p>
        </div>
        <Link
          href="/maintenance/new"
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus size={16} />
          Log Repair
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "ACTIVE WORK ORDERS", value: openCount,                   border: "border-orange-400", Icon: Wrench },
          { label: "VEHICLES IN SHOP",   value: inShopCount,                 border: "border-red-400",    Icon: ShieldAlert },
          { label: "TOTAL SPEND",        value: formatCurrency(totalSpend),  border: "border-green-400",  Icon: DollarSign },
          { label: "AVG REPAIR COST",    value: formatCurrency(avgCost),     border: "border-blue-400",   Icon: Clock },
        ].map(({ label, value, border, Icon }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between h-[110px]">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${border}`} />
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</div>
              <Icon size={15} className="text-gray-300" />
            </div>
            <div className="text-2xl font-black text-black tracking-tight">{value}</div>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map((tab) => {
              const count = tab === "All" ? initialLogs.length : tab === "Open" ? openCount : closedCount;
              return (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === tab ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab ? "bg-black text-white" : "bg-gray-200 text-gray-500"
                  }`}>{count}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search vehicle, type, description..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-700 outline-none focus:border-black transition-all font-medium"
            />
          </div>
        </div>

        {/* Column Headers */}
        <div
          className="grid px-6 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50"
          style={{ gridTemplateColumns: "2fr 1.1fr 2.5fr 0.9fr 0.8fr 0.9fr 0.9fr 1.2fr" }}
        >
          <div>Vehicle</div><div>Type</div><div>Description</div><div>Cost</div>
          <div>Status</div><div>Logged</div><div>Closed</div><div>Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Wrench size={36} className="mb-3 opacity-20" />
              <p className="font-semibold text-sm">No records found</p>
              <p className="text-xs mt-1">Try adjusting your filters or log a new repair.</p>
            </div>
          ) : (
            paginated.map((log: any) => {
              const vehicle = vehicles.find((v: any) => v.id === log.vehicleId);
              const ts = TYPE_STYLES[log.type] || TYPE_STYLES.GENERAL;
              const isOpen = log.status === "OPEN";
              return (
                <div
                  key={log.id}
                  className="grid items-center px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                  style={{ gridTemplateColumns: "2fr 1.1fr 2.5fr 0.9fr 0.8fr 0.9fr 0.9fr 1.2fr" }}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-black truncate">{vehicle?.registrationNumber || `ID: ${log.vehicleId}`}</span>
                    <span className="text-[11px] text-gray-400 truncate">{vehicle?.nameModel || "Unknown"}</span>
                  </div>
                  <div>
                    <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold border ${ts.cls}`}>{ts.label}</span>
                  </div>
                  <div className="text-xs text-gray-500 truncate pr-4" title={log.description || ""}>
                    {log.description || <span className="italic text-gray-300">No description</span>}
                  </div>
                  <div className="text-sm font-bold text-gray-800 font-mono">{formatCurrency(log.cost)}</div>
                  <div>
                    {isOpen ? (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">Open</span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">Closed</span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(log.createdAt)}</div>
                  <div className="text-xs text-gray-500">{log.closedAt ? formatDate(log.closedAt) : <span className="text-gray-300">—</span>}</div>
                  <div>
                    {isOpen ? (
                      <button
                        onClick={() => handleCloseMaintenance(log.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-700 hover:bg-black hover:text-white hover:border-black rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        <CheckCircle size={13} />
                        Close Case
                      </button>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-gray-300 font-bold">
                        <CheckCircle size={13} />
                        Done
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400 font-medium">
              Showing <span className="text-black font-bold">{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filtered.length)}</span>
              {" to "}
              <span className="text-black font-bold">{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)}</span>
              {" of "}
              <span className="text-black font-bold">{filtered.length}</span> records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-xs font-bold text-gray-700 px-1">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}