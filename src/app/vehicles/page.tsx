"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatNumber } from "@/lib/utils";
import VehicleModal from "./VehicleModal";

// Mock Data
const MOCK_VEHICLES = [
  { id: "1", registrationNumber: "TRK-092", nameModel: "Volvo FH16", type: "TRUCK", maxLoadCapacityKg: 24000, odometerKm: 145000, region: "North Zone", status: "AVAILABLE" },
  { id: "2", registrationNumber: "VAN-014", nameModel: "Mercedes Sprinter", type: "VAN", maxLoadCapacityKg: 3500, odometerKm: 85000, region: "South Zone", status: "ON_TRIP" },
  { id: "3", registrationNumber: "TRK-105", nameModel: "Scania R500", type: "TRUCK", maxLoadCapacityKg: 22000, odometerKm: 210000, region: "East Zone", status: "IN_SHOP" },
  { id: "4", registrationNumber: "CAR-042", nameModel: "Toyota Corolla", type: "CAR", maxLoadCapacityKg: 450, odometerKm: 42000, region: "West Zone", status: "AVAILABLE" },
  { id: "5", registrationNumber: "BUS-008", nameModel: "Volvo 9700", type: "BUS", maxLoadCapacityKg: 5000, odometerKm: 320000, region: "North Zone", status: "RETIRED" },
  { id: "6", registrationNumber: "TRK-118", nameModel: "MAN TGX", type: "TRUCK", maxLoadCapacityKg: 26000, odometerKm: 95000, region: "South Zone", status: "AVAILABLE" },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);

  const filteredVehicles = vehicles.filter(v => 
    v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.nameModel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
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
            className="p-1.5 text-text-primary-primary-primary-secondary hover:text-primary-light hover:bg-white/5 rounded-md transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </Link>
          <button 
            onClick={() => handleEdit(v)}
            className="p-1.5 text-text-primary-primary-primary-secondary hover:text-warning hover:bg-white/5 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 size={16} />
          </button>
          <button 
            className="p-1.5 text-text-primary-primary-primary-secondary hover:text-danger hover:bg-white/5 rounded-md transition-colors"
            title="Retire / Delete"
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
          <p className="text-text-primary-primary-primary-secondary text-sm">Manage your fleet assets and monitor their real-time status.</p>
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
