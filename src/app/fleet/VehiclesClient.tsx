"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber, formatCurrency } from "@/lib/utils";
import VehicleModal from "./VehicleModal";
import { showToast } from "@/components/ui/Toast";
import { retireVehicle } from "@/actions/vehicle";

export default function VehiclesClient({ initialVehicles }: { initialVehicles: any[] }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "FLEET_MANAGER";

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const visibleVehicles = initialVehicles.filter(v => {
    if (isAdmin) return true;
    return v.status !== "RETIRED" && v.status !== "IN_SHOP";
  });

  const uniqueTypes = Array.from(new Set(visibleVehicles.map(v => v.type))).filter(Boolean);

  const filteredVehicles = visibleVehicles.filter(v => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.registrationNumber.toLowerCase().includes(q) ||
      v.nameModel.toLowerCase().includes(q) ||
      (v.status || "").toLowerCase().includes(q) ||
      (v.region || "").toLowerCase().includes(q) ||
      (`${v.maxLoadCapacityKg || 0} kg`).includes(q) ||
      (v.odometerKm?.toString() || "").includes(q);

    const matchesType = typeFilter === "All" || v.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (v.status || "").toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const handleRetire = async (id: number, regNum: string) => {
    if (window.confirm(`Are you sure you want to retire vehicle ${regNum}?`)) {
      const res = await retireVehicle(id);
      if (res.success) {
        showToast("success", `Vehicle ${regNum} has been retired.`);
      } else {
        showToast("error", `Failed to retire vehicle: ${res.error}`);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingVehicle(null), 300);
  };

  const columns = [
    {
      header: "Reg No.",
      accessorKey: "registrationNumber" as const,
      cell: (v: any) => <span className="font-bold text-black">{v.registrationNumber}</span>,
    },
    { header: "Model", accessorKey: "nameModel" as const },
    { header: "Type", accessorKey: "type" as const },
    { header: "Capacity", cell: (v: any) => `${formatNumber(v.maxLoadCapacityKg)} kg` },
    { header: "Odometer", cell: (v: any) => `${formatNumber(v.odometerKm)} km` },
    { header: "Acquisition Cost", cell: (v: any) => formatCurrency(v.acquisitionCost) },
    { header: "Status", cell: (v: any) => <StatusBadge status={v.status} /> },
    {
      header: "Actions",
      cell: (v: any) => (
        <div className="flex items-center gap-1">
          <Link
            href={`/fleet/${v.id}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
            title="View Details"
          >
            <Eye size={15} />
          </Link>
          {isAdmin && (
            <>
              <button
                onClick={() => handleEdit(v)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit"
              >
                <Edit2 size={15} />
              </button>
              <button
                onClick={() => handleRetire(v.id, v.registrationNumber)}
                disabled={v.status === "RETIRED"}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 disabled:text-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-colors"
                title="Retire Vehicle"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in w-full max-w-[1400px] mx-auto">

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[26px] font-bold text-black tracking-tight">Vehicle Registry</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your fleet assets and monitor real-time status.</p>
        </div>
        {isAdmin && (
          <Link
            href="/fleet/new"
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-[14px] text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} />
            Add Vehicle
          </Link>
        )}
      </div>

      {/* Search + Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search reg no, model, region, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-4 py-2 text-sm text-gray-700 outline-none focus:border-black shadow-sm transition-all font-medium"
          />
        </div>

        <div className="text-xs font-bold text-gray-400 tracking-wider uppercase">Filters:</div>

        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2 pl-4 pr-8 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="All">Type: All</option>
            {uniqueTypes.map(t => (
              <option key={t as string} value={t as string}>{t as string}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2 pl-4 pr-8 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
          >
            <option value="All">Status: All</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
        </div>

        <span className="text-xs text-gray-400 ml-auto font-medium">
          {filteredVehicles.length} of {visibleVehicles.length} vehicles
        </span>
      </div>

      {/* Table */}
      <DataTable
        data={filteredVehicles}
        columns={columns}
      />

      <VehicleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicle={editingVehicle}
      />
    </div>
  );
}