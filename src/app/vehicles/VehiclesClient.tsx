"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber } from "@/lib/utils";
import VehicleModal from "./VehicleModal";
import { showToast } from "@/components/ui/Toast";
import { retireVehicle } from "@/actions/vehicle";

export default function VehiclesClient({ initialVehicles }: { initialVehicles: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const filteredVehicles = initialVehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.nameModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            href={`/vehicles/${v.id}`}
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

      <DataTable 
        data={filteredVehicles}
        columns={columns}
        searchPlaceholder="Search by reg no. or model..."
        onSearch={setSearchQuery}
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
