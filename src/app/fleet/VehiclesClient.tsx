"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, Search } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber } from "@/lib/utils";
import VehicleModal from "./VehicleModal";
import { showToast } from "@/components/ui/Toast";
import { retireVehicle } from "@/actions/vehicle";

export default function VehiclesClient({ initialVehicles }: { initialVehicles: any[] }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "FLEET_MANAGER";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [regNoSearch, setRegNoSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  // Filter out retired/in-shop for non-admins
  const visibleVehicles = initialVehicles.filter(v => {
    if (isAdmin) return true;
    return v.status !== "RETIRED" && v.status !== "IN_SHOP";
  });

  const uniqueTypes = Array.from(new Set(visibleVehicles.map(v => v.type))).filter(Boolean);

  const filteredVehicles = visibleVehicles.filter(v => {
    const cleanSearch = searchQuery.toLowerCase().trim();
    
    // The main search bar works with all keywords
    const matchesGeneric = 
      v.registrationNumber.toLowerCase().includes(cleanSearch) ||
      v.nameModel.toLowerCase().includes(cleanSearch) ||
      (v.status || "").toLowerCase().includes(cleanSearch) ||
      (v.odometerKm?.toString() || "").includes(cleanSearch) ||
      (v.maxLoadCapacityKg?.toString() || "").includes(cleanSearch.replace(/kg/i, "").trim()) ||
      (`${v.maxLoadCapacityKg || 0} kg`).includes(cleanSearch) ||
      (`${v.maxLoadCapacityKg || 0}kg`).includes(cleanSearch) ||
      (v.region || "").toLowerCase().includes(cleanSearch);
      
    // Specific Reg No Search
    const matchesRegNo = v.registrationNumber.toLowerCase().includes(regNoSearch.toLowerCase().trim());
    
    // Dropdown filters
    const matchesType = typeFilter === "All" || v.type === typeFilter;
    const matchesStatus = statusFilter === "All" || (v.status || "").toUpperCase() === statusFilter.toUpperCase();
    
    return matchesGeneric && matchesRegNo && matchesType && matchesStatus;
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
    setTimeout(() => setEditingVehicle(null), 300); // clear after animation
  };

  const columns = [
    { header: "Reg No.", accessorKey: "registrationNumber" as const, 
      cell: (v: any) => <span className="font-medium">{v.registrationNumber}</span> 
    },
    { header: "Model", accessorKey: "nameModel" as const },
    { header: "Type", accessorKey: "type" as const },
    { header: "Capacity", cell: (v: any) => `${formatNumber(v.maxLoadCapacityKg)} kg` },
    { header: "Odometer", cell: (v: any) => `${formatNumber(v.odometerKm)} km` },
    { header: "Region", accessorKey: "region" as const },
    { header: "Status", cell: (v: any) => <StatusBadge status={v.status} /> },
    { 
      header: "Actions", 
      cell: (v: any) => (
        <div className="flex items-center gap-2">
          <Link 
            href={`/fleet/${v.id}`}
            className="p-1.5 text-text-secondary hover:text-primary-light hover:bg-white/5 rounded-md transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
          <button 
            onClick={() => handleEdit(v)}
            className="p-1.5 text-text-secondary hover:text-warning hover:bg-white/5 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleRetire(v.id, v.registrationNumber)}
            disabled={v.status === "RETIRED"}
            className="p-1.5 text-text-secondary hover:text-danger hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed rounded-md transition-colors"
            title="Retire"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Vehicle Registry</h1>
          <p className="text-text-secondary text-sm">Manage your fleet assets and monitor their real-time status.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-2">
        {/* Main Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by any keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-700 outline-none focus:border-black shadow-sm transition-all font-medium"
          />
        </div>

        {/* Custom Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-bold text-gray-400 tracking-wider mr-2 uppercase">Filters:</div>
          
          {/* 1) Type Filter */}
          <div className="relative w-40">
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
            >
              <option value="All">Type: All</option>
              {uniqueTypes.map(t => (
                <option key={t as string} value={t as string}>{t as string}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>

          {/* 2) Status Filter */}
          <div className="relative w-40">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:border-black cursor-pointer shadow-sm"
            >
              <option value="All">Status: All</option>
              <option value="Available">Available</option>
              <option value="On_Trip">On Trip</option>
              <option value="In_Shop">In Shop</option>
              <option value="Retired">Retired</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▼</div>
          </div>
          
          {/* 3) Reg No Search */}
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search reg.no....." 
              value={regNoSearch}
              onChange={(e) => setRegNoSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-black shadow-sm transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <DataTable 
        data={filteredVehicles}
        columns={columns}
        actions={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        }
      />

      <VehicleModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        vehicle={editingVehicle}
      />
    </div>
  );
}
