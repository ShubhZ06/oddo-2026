"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Vehicle, MaintenanceLog, MaintenanceType, Expense } from "@/types";

interface AppContextType {
  vehicles: Vehicle[];
  maintenanceLogs: MaintenanceLog[];
  expenses: Expense[];
  addVehicle: (vehicleData: {
    registrationNumber: string;
    nameModel: string;
    type: "TRUCK" | "VAN" | "CAR" | "BUS";
    maxLoadCapacityKg: number;
    odometerKm: number;
    acquisitionCost: number;
    region?: string;
    status: "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";
  }) => void;
  updateVehicle: (id: number, vehicleData: Partial<Vehicle>) => void;
  retireVehicle: (id: number) => void;
  logMaintenance: (data: {
    vehicleId: number;
    type: MaintenanceType;
    cost: number;
    description: string;
  }) => void;
  closeMaintenance: (logId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Vehicles Seed
const INITIAL_VEHICLES: Vehicle[] = [
  { id: 1, registrationNumber: "TRK-092", nameModel: "Volvo FH16", type: "TRUCK", maxLoadCapacityKg: 24000, odometerKm: 145000, acquisitionCost: 8500000, status: "IN_SHOP", region: "North Zone", createdAt: "2026-01-10T10:00:00Z", updatedAt: "2026-01-10T10:00:00Z" },
  { id: 2, registrationNumber: "VAN-014", nameModel: "Mercedes Sprinter", type: "VAN", maxLoadCapacityKg: 3500, odometerKm: 85000, acquisitionCost: 4500000, status: "ON_TRIP", region: "South Zone", createdAt: "2026-02-15T10:00:00Z", updatedAt: "2026-02-15T10:00:00Z" },
  { id: 3, registrationNumber: "TRK-105", nameModel: "Scania R500", type: "TRUCK", maxLoadCapacityKg: 22000, odometerKm: 210000, acquisitionCost: 9000000, status: "IN_SHOP", region: "East Zone", createdAt: "2026-03-20T10:00:00Z", updatedAt: "2026-03-20T10:00:00Z" },
  { id: 4, registrationNumber: "CAR-042", nameModel: "Toyota Corolla", type: "CAR", maxLoadCapacityKg: 450, odometerKm: 42000, acquisitionCost: 1800000, status: "AVAILABLE", region: "West Zone", createdAt: "2026-04-05T10:00:00Z", updatedAt: "2026-04-05T10:00:00Z" },
  { id: 5, registrationNumber: "BUS-008", nameModel: "Volvo 9700", type: "BUS", maxLoadCapacityKg: 5000, odometerKm: 320000, acquisitionCost: 12000000, status: "RETIRED", region: "North Zone", createdAt: "2025-05-12T10:00:00Z", updatedAt: "2025-05-12T10:00:00Z" },
  { id: 6, registrationNumber: "TRK-118", nameModel: "MAN TGX", type: "TRUCK", maxLoadCapacityKg: 26000, odometerKm: 95000, acquisitionCost: 9500000, status: "AVAILABLE", region: "South Zone", createdAt: "2026-06-01T10:00:00Z", updatedAt: "2026-06-01T10:00:00Z" },
];

// Initial Mock Maintenance Logs Seed
const INITIAL_MAINTENANCE_LOGS: MaintenanceLog[] = [
  {
    id: 1,
    vehicleId: 1,
    type: "ENGINE_REPAIR",
    description: "Engine overheating issues, coolant system flush and replacement of radiator hoses.",
    cost: 45000,
    status: "OPEN",
    createdAt: "2026-07-10T08:30:00Z",
    closedAt: null,
  },
  {
    id: 2,
    vehicleId: 3,
    type: "BRAKE_SERVICE",
    description: "Replacement of front and rear brake pads, rotor turning.",
    cost: 28000,
    status: "OPEN",
    createdAt: "2026-07-11T14:15:00Z",
    closedAt: null,
  },
  {
    id: 3,
    vehicleId: 2,
    type: "OIL_CHANGE",
    description: "Routine scheduled maintenance - engine oil and filter replacement, multi-point inspection.",
    cost: 8500,
    status: "CLOSED",
    createdAt: "2026-06-15T09:00:00Z",
    closedAt: "2026-06-15T11:30:00Z",
  },
  {
    id: 4,
    vehicleId: 4,
    type: "TIRE_REPLACEMENT",
    description: "Replaced 4 worn-out tires, wheel balancing and alignment.",
    cost: 32000,
    status: "CLOSED",
    createdAt: "2026-05-20T10:00:00Z",
    closedAt: "2026-05-20T16:00:00Z",
  },
];

// Initial Mock Expenses Seed matching maintenance logs
const INITIAL_EXPENSES: Expense[] = [
  {
    id: 1,
    vehicleId: 1,
    tripId: null,
    category: "MAINTENANCE",
    description: "Engine overheating issues, coolant system flush and replacement of radiator hoses.",
    amount: 45000,
    date: "2026-07-10T08:30:00Z",
    createdAt: "2026-07-10T08:30:00Z",
  },
  {
    id: 2,
    vehicleId: 3,
    tripId: null,
    category: "MAINTENANCE",
    description: "Replacement of front and rear brake pads, rotor turning.",
    amount: 28000,
    date: "2026-07-11T14:15:00Z",
    createdAt: "2026-07-11T14:15:00Z",
  },
  {
    id: 3,
    vehicleId: 2,
    tripId: null,
    category: "MAINTENANCE",
    description: "Routine scheduled maintenance - engine oil and filter replacement, multi-point inspection.",
    amount: 8500,
    date: "2026-06-15T09:00:00Z",
    createdAt: "2026-06-15T09:00:00Z",
  },
  {
    id: 4,
    vehicleId: 4,
    tripId: null,
    category: "MAINTENANCE",
    description: "Replaced 4 worn-out tires, wheel balancing and alignment.",
    amount: 32000,
    date: "2026-05-20T10:00:00Z",
    createdAt: "2026-05-20T10:00:00Z",
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Load from state/seeding
  useEffect(() => {
    setVehicles(INITIAL_VEHICLES);
    setMaintenanceLogs(INITIAL_MAINTENANCE_LOGS);
    setExpenses(INITIAL_EXPENSES);
  }, []);

  // Add Vehicle
  const addVehicle = (vehicleData: any) => {
    const nextId = vehicles.length > 0 ? Math.max(...vehicles.map((v) => v.id)) + 1 : 1;
    const newVehicle: Vehicle = {
      id: nextId,
      registrationNumber: vehicleData.registrationNumber.toUpperCase(),
      nameModel: vehicleData.nameModel,
      type: vehicleData.type,
      maxLoadCapacityKg: Number(vehicleData.maxLoadCapacityKg),
      odometerKm: Number(vehicleData.odometerKm),
      acquisitionCost: Number(vehicleData.acquisitionCost),
      status: vehicleData.status || "AVAILABLE",
      region: vehicleData.region || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setVehicles((prev) => [...prev, newVehicle]);
  };

  // Update Vehicle
  const updateVehicle = (id: number, vehicleData: Partial<Vehicle>) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              ...vehicleData,
              updatedAt: new Date().toISOString(),
            }
          : v
      )
    );
  };

  // Retire Vehicle
  const retireVehicle = (id: number) => {
    updateVehicle(id, { status: "RETIRED" });
  };

  // Log Maintenance (BR9) and Auto-create expense (BR9 / 6.5)
  const logMaintenance = (data: {
    vehicleId: number;
    type: MaintenanceType;
    cost: number;
    description: string;
  }) => {
    const nextLogId =
      maintenanceLogs.length > 0
        ? Math.max(...maintenanceLogs.map((l) => l.id)) + 1
        : 1;

    const newLog: MaintenanceLog = {
      id: nextLogId,
      vehicleId: data.vehicleId,
      type: data.type,
      description: data.description || null,
      cost: data.cost,
      status: "OPEN",
      createdAt: new Date().toISOString(),
      closedAt: null,
    };

    const nextExpenseId =
      expenses.length > 0
        ? Math.max(...expenses.map((e) => e.id)) + 1
        : 1;

    const newExpense: Expense = {
      id: nextExpenseId,
      vehicleId: data.vehicleId,
      tripId: null,
      category: "MAINTENANCE",
      description: data.description || `Auto-created maintenance expense for ${data.type.replace(/_/g, ' ').toLowerCase()}`,
      amount: data.cost,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    setMaintenanceLogs((prev) => [newLog, ...prev]);
    setExpenses((prev) => [newExpense, ...prev]);
    updateVehicle(data.vehicleId, { status: "IN_SHOP" });
  };

  // Close Maintenance (BR10)
  const closeMaintenance = (logId: number) => {
    const log = maintenanceLogs.find((l) => l.id === logId);
    if (!log) return;

    setMaintenanceLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              status: "CLOSED",
              closedAt: new Date().toISOString(),
            }
          : l
      )
    );

    const vehicle = vehicles.find((v) => v.id === log.vehicleId);
    if (vehicle) {
      const targetStatus = vehicle.status === "RETIRED" ? "RETIRED" : "AVAILABLE";
      updateVehicle(log.vehicleId, { status: targetStatus });
    }
  };

  return (
    <AppContext.Provider
      value={{
        vehicles,
        maintenanceLogs,
        expenses,
        addVehicle,
        updateVehicle,
        retireVehicle,
        logMaintenance,
        closeMaintenance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
