// ===================================================
// TransitOps — Shared TypeScript Types
// ===================================================

// ---------- User & Auth ----------
export type Role =
  | "FLEET_MANAGER"
  | "DRIVER"
  | "SAFETY_OFFICER"
  | "FINANCIAL_ANALYST";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

// ---------- Vehicle ----------
export type VehicleType = "TRUCK" | "VAN" | "CAR" | "BUS";
export type VehicleStatus = "AVAILABLE" | "ON_TRIP" | "IN_SHOP" | "RETIRED";

export interface Vehicle {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: VehicleType;
  maxLoadCapacityKg: number;
  odometerKm: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleFormData {
  registrationNumber: string;
  nameModel: string;
  type: VehicleType;
  maxLoadCapacityKg: number;
  odometerKm: number;
  acquisitionCost: number;
  status: VehicleStatus;
  region?: string;
}

// ---------- Driver ----------
export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY" | "SUSPENDED";

export interface Driver {
  id: number;
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DriverFormData {
  name: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiry: string;
  contactNumber: string;
  safetyScore: number;
  status: DriverStatus;
}

// ---------- Trip ----------
export type TripStatus = "DRAFT" | "DISPATCHED" | "COMPLETED" | "CANCELLED";

export interface Trip {
  id: number;
  vehicleId: number;
  driverId: number;
  source: string;
  destination: string;
  cargoWeightKg: number;
  distanceKm: number;
  revenue: number;
  status: TripStatus;
  finalOdometer: number | null;
  fuelConsumedLiters: number | null;
  createdAt: string;
  dispatchedAt: string | null;
  completedAt: string | null;
  vehicle?: Vehicle;
  driver?: Driver;
  expenses?: any[];
}

export interface TripFormData {
  vehicleId: number;
  driverId: number;
  source: string;
  destination: string;
  cargoWeightKg: number;
  distanceKm: number;
  revenue: number;
}

export interface TripCompleteData {
  finalOdometer: number;
  fuelConsumedLiters: number;
}

// ---------- Maintenance ----------
export type MaintenanceType =
  | "OIL_CHANGE"
  | "TIRE_REPLACEMENT"
  | "ENGINE_REPAIR"
  | "BRAKE_SERVICE"
  | "GENERAL";

export type MaintenanceStatus = "OPEN" | "CLOSED";

export interface MaintenanceLog {
  id: number;
  vehicleId: number;
  type: MaintenanceType;
  description: string | null;
  cost: number;
  status: MaintenanceStatus;
  createdAt: string;
  closedAt: string | null;
  vehicle?: Vehicle;
}

export interface MaintenanceFormData {
  vehicleId: number;
  type: MaintenanceType;
  description?: string;
  cost: number;
}

// ---------- Fuel Log ----------
export interface FuelLog {
  id: number;
  vehicleId: number;
  tripId: number | null;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  odometerAtFill: number;
  date: string;
  createdAt: string;
  vehicle?: Vehicle;
  trip?: Trip;
}

export interface FuelLogFormData {
  vehicleId: number;
  tripId?: number;
  liters: number;
  costPerLiter: number;
  odometerAtFill: number;
  date: string;
}

// ---------- Expense ----------
export type ExpenseCategory =
  | "TOLL"
  | "MAINTENANCE"
  | "FUEL"
  | "INSURANCE"
  | "MISC";

export interface Expense {
  id: number;
  vehicleId: number;
  tripId: number | null;
  category: ExpenseCategory;
  description: string | null;
  amount: number;
  date: string;
  createdAt: string;
  vehicle?: Vehicle;
  trip?: Trip;
}

export interface ExpenseFormData {
  vehicleId: number;
  tripId?: number;
  category: ExpenseCategory;
  description?: string;
  amount: number;
  date: string;
}

// ---------- Dashboard KPIs ----------
export interface DashboardKPIs {
  activeVehicles: number;
  availableVehicles: number;
  vehiclesInMaintenance: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
}

// ---------- Reports ----------
export interface FuelEfficiencyReport {
  vehicleId: number;
  registrationNumber: string;
  nameModel: string;
  totalDistanceKm: number;
  totalFuelLiters: number;
  kmPerLiter: number;
}

export interface VehicleROI {
  vehicleId: number;
  registrationNumber: string;
  nameModel: string;
  revenue: number;
  maintenanceCost: number;
  fuelCost: number;
  acquisitionCost: number;
  roi: number;
}

// ---------- API Response ----------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
