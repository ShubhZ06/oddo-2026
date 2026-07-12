"use client";

import { useState } from "react";
import { Wrench, CheckCircle, Clock, DollarSign, Plus, ShieldAlert } from "lucide-react";
import DataTable from "@/components/ui/DataTable";
import StatusBadge from "@/components/ui/StatusBadge";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency, formatDate, titleCase } from "@/lib/utils";
import { showToast } from "@/components/ui/Toast";
import MaintenanceModal from "./MaintenanceModal";
import type { Vehicle, MaintenanceLog, MaintenanceType } from "@/types";

import { useApp } from "@/context/AppContext";

export default function MaintenancePage() {
  const { vehicles, maintenanceLogs: logs, logMaintenance, closeMaintenance } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close an active maintenance work order and release vehicle (BR10)
  const handleCloseMaintenance = (logId: number) => {
    const log = logs.find((l) => l.id === logId);
    const vehicle = vehicles.find((v) => v.id === log?.vehicleId);
    
    closeMaintenance(logId);
    
    if (vehicle) {
      const targetStatus = vehicle.status === "RETIRED" ? "RETIRED" : "AVAILABLE";
      showToast(
        "success",
        `Maintenance closed. Vehicle ${vehicle.registrationNumber} is now ${targetStatus.toLowerCase()}.`
      );
    }
  };

  // Create a new maintenance work order and put vehicle in shop (BR9)
  const handleCreateMaintenance = (data: {
    vehicleId: number;
    type: MaintenanceType;
    cost: number;
    description: string;
  }) => {
    const vehicle = vehicles.find((v) => v.id === data.vehicleId);
    
    logMaintenance(data);
    
    if (vehicle) {
      showToast(
        "success",
        `Maintenance logged. Vehicle ${vehicle.registrationNumber} status set to IN_SHOP & associated maintenance expense auto-created.`
      );
    }
  };

  // Filter logs based on search query
  const filteredLogs = logs.filter((log) => {
    const vehicle = vehicles.find((v) => v.id === log.vehicleId);
    const searchString = searchQuery.toLowerCase();
    
    const regMatch = vehicle?.registrationNumber.toLowerCase().includes(searchString) || false;
    const modelMatch = vehicle?.nameModel.toLowerCase().includes(searchString) || false;
    const typeMatch = log.type.toLowerCase().includes(searchString);
    const descMatch = log.description?.toLowerCase().includes(searchString) || false;

    return regMatch || modelMatch || typeMatch || descMatch;
  });

  // Calculate Metrics
  const openCasesCount = logs.filter((l) => l.status === "OPEN").length;
  const vehiclesInShopCount = vehicles.filter((v) => v.status === "IN_SHOP").length;
  const totalSpend = logs.reduce((sum, l) => sum + l.cost, 0);
  const avgCost = logs.length > 0 ? totalSpend / logs.length : 0;

  const columns = [
    {
      header: "Vehicle",
      cell: (log: MaintenanceLog) => {
        const vehicle = vehicles.find((v) => v.id === log.vehicleId);
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-text-primary">
              {vehicle?.registrationNumber || `ID: ${log.vehicleId}`}
            </span>
            <span className="text-xs text-text-primary-secondary">
              {vehicle?.nameModel || "Unknown Model"}
            </span>
          </div>
        );
      },
    },
    {
      header: "Type",
      cell: (log: MaintenanceLog) => (
        <span className="text-sm font-medium text-text-primary-secondary">
          {titleCase(log.type)}
        </span>
      ),
    },
    {
      header: "Description",
      cell: (log: MaintenanceLog) => (
        <div className="max-w-xs truncate text-text-primary-secondary" title={log.description || ""}>
          {log.description || <span className="italic text-text-muted">No description</span>}
        </div>
      ),
    },
    {
      header: "Cost",
      cell: (log: MaintenanceLog) => (
        <span className="font-mono font-medium text-text-primary">
          {formatCurrency(log.cost)}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (log: MaintenanceLog) => <StatusBadge status={log.status} />,
    },
    {
      header: "Logged Date",
      cell: (log: MaintenanceLog) => (
        <span className="text-text-primary-secondary">{formatDate(log.createdAt)}</span>
      ),
    },
    {
      header: "Closed Date",
      cell: (log: MaintenanceLog) => (
        <span className="text-text-primary-secondary">
          {log.closedAt ? formatDate(log.closedAt) : <span className="text-text-muted">—</span>}
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (log: MaintenanceLog) => {
        if (log.status === "OPEN") {
          return (
            <button
              onClick={() => handleCloseMaintenance(log.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-success/10 hover:bg-success/20 text-success rounded-lg text-xs font-semibold border border-success/20 transition-colors"
            >
              <CheckCircle size={14} />
              Close Case
            </button>
          );
        }
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-text-primary-muted font-medium py-1.5">
            <CheckCircle size={14} className="text-text-primary-muted" />
            Completed
          </span>
        );
      },
    },
  ];

  // Candidates for new maintenance logs (non-retired and not already in shop)
  const eligibleVehicles = vehicles.filter(
    (v) => v.status !== "RETIRED" && v.status !== "IN_SHOP"
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Maintenance Workflows</h1>
          <p className="text-text-primary-secondary text-sm">
            Manage your shop orders, track maintenance expenditures, and monitor repair status.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Active Work Orders"
          value={openCasesCount}
          icon={Wrench}
          iconBg="bg-warning/15"
          iconColor="text-warning"
        />
        <StatCard
          label="Vehicles in Shop"
          value={vehiclesInShopCount}
          icon={ShieldAlert}
          iconBg="bg-danger/15"
          iconColor="text-danger"
        />
        <StatCard
          label="Total Maintenance Spend"
          value={formatCurrency(totalSpend)}
          icon={DollarSign}
          iconBg="bg-success/15"
          iconColor="text-success"
        />
        <StatCard
          label="Avg. Repair Cost"
          value={formatCurrency(avgCost)}
          icon={Clock}
          iconBg="bg-primary/15"
          iconColor="text-primary-light"
        />
      </div>

      {/* Work Orders Table */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-border-default pb-4">
          <h2 className="text-lg font-semibold">Repair & Service Logs</h2>
        </div>

        <DataTable
          data={filteredLogs}
          columns={columns}
          searchPlaceholder="Search by reg no, model, type, description..."
          onSearch={setSearchQuery}
          actions={
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Plus size={18} />
              Log Repair
            </button>
          }
        />
      </div>

      {/* Maintenance Logger Modal */}
      <MaintenanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicles={eligibleVehicles}
        onSubmit={handleCreateMaintenance}
      />
    </div>
  );
}
