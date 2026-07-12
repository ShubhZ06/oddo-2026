import fs from "fs";
import path from "path";
import type {
  Driver,
  DriverFormData,
  Vehicle,
  VehicleFormData,
  Trip,
  TripFormData,
  TripCompleteData,
} from "@/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/drivers-data.json");
const VEHICLES_FILE_PATH = path.join(process.cwd(), "src/lib/vehicles-data.json");
const TRIPS_FILE_PATH = path.join(process.cwd(), "src/lib/trips-data.json");
const MAINTENANCE_FILE_PATH = path.join(process.cwd(), "src/lib/maintenance-data.json");
const FUEL_LOGS_FILE_PATH = path.join(process.cwd(), "src/lib/fuel-logs-data.json");
const EXPENSES_FILE_PATH = path.join(process.cwd(), "src/lib/expenses-data.json");

// Initial mock data to seed the file if it doesn't exist
const INITIAL_DRIVERS: Driver[] = [
  {
    id: 1,
    name: "John Doe",
    licenseNumber: "DL-109283-A",
    licenseCategory: "Class A CDL",
    licenseExpiry: "2027-02-15T00:00:00.000Z",
    contactNumber: "+1 (555) 019-2834",
    safetyScore: 98.5,
    status: "AVAILABLE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Jane Smith",
    licenseNumber: "DL-908123-B",
    licenseCategory: "Class B CDL",
    licenseExpiry: "2027-10-10T00:00:00.000Z",
    contactNumber: "+1 (555) 012-9988",
    safetyScore: 94.0,
    status: "ON_TRIP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Bob Johnson",
    licenseNumber: "DL-773489-A",
    licenseCategory: "Class A CDL",
    licenseExpiry: "2026-07-28T00:00:00.000Z", // Expiring soon!
    contactNumber: "+1 (555) 014-4411",
    safetyScore: 68.0, // Low safety score
    status: "OFF_DUTY",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Alice Williams",
    licenseNumber: "DL-223948-C",
    licenseCategory: "Class C",
    licenseExpiry: "2028-05-12T00:00:00.000Z",
    contactNumber: "+1 (555) 017-7722",
    safetyScore: 52.0, // Critical safety score
    status: "SUSPENDED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Marcus Vance",
    licenseNumber: "DL-554019-A",
    licenseCategory: "Class A CDL",
    licenseExpiry: "2026-08-05T00:00:00.000Z", // Expiring soon!
    contactNumber: "+1 (555) 015-8833",
    safetyScore: 89.5,
    status: "AVAILABLE",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Helper to ensure data file exists and read it
function getDriversFromFile(): Driver[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      // Ensure the directory exists
      const dir = path.dirname(DATA_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(INITIAL_DRIVERS, null, 2));
      return INITIAL_DRIVERS;
    }
    const data = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading drivers from file, returning empty list:", error);
    return [];
  }
}

// Helper to write data back to the file
function writeDriversToFile(drivers: Driver[]): void {
  try {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(drivers, null, 2));
  } catch (error) {
    console.error("Error writing drivers to file:", error);
  }
}

// Helper for Vehicles
function getVehiclesFromFile(): Vehicle[] {
  try {
    if (!fs.existsSync(VEHICLES_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(VEHICLES_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading vehicles from file, returning empty list:", error);
    return [];
  }
}

function writeVehiclesToFile(vehicles: Vehicle[]): void {
  try {
    fs.writeFileSync(VEHICLES_FILE_PATH, JSON.stringify(vehicles, null, 2));
  } catch (error) {
    console.error("Error writing vehicles to file:", error);
  }
}

// Helper for Trips
function getTripsFromFile(): Trip[] {
  try {
    if (!fs.existsSync(TRIPS_FILE_PATH)) {
      return [];
    }
    const data = fs.readFileSync(TRIPS_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading trips from file, returning empty list:", error);
    return [];
  }
}

function writeTripsToFile(trips: Trip[]): void {
  try {
    fs.writeFileSync(TRIPS_FILE_PATH, JSON.stringify(trips, null, 2));
  } catch (error) {
    console.error("Error writing trips to file:", error);
  }
}

// Helpers for Maintenance, Fuel Logs, Expenses
function getMaintenanceFromFile(): any[] {
  try {
    if (!fs.existsSync(MAINTENANCE_FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(MAINTENANCE_FILE_PATH, "utf-8"));
  } catch (error) {
    console.error("Error reading maintenance from file:", error);
    return [];
  }
}

function getFuelLogsFromFile(): any[] {
  try {
    if (!fs.existsSync(FUEL_LOGS_FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(FUEL_LOGS_FILE_PATH, "utf-8"));
  } catch (error) {
    console.error("Error reading fuel logs from file:", error);
    return [];
  }
}

function getExpensesFromFile(): any[] {
  try {
    if (!fs.existsSync(EXPENSES_FILE_PATH)) return [];
    return JSON.parse(fs.readFileSync(EXPENSES_FILE_PATH, "utf-8"));
  } catch (error) {
    console.error("Error reading expenses from file:", error);
    return [];
  }
}

export const DataStore = {
  // ---------- DRIVERS ----------
  getDrivers: (): Driver[] => {
    return getDriversFromFile();
  },

  getDriverById: (id: number): Driver | undefined => {
    const drivers = getDriversFromFile();
    return drivers.find((d) => d.id === id);
  },

  createDriver: (formData: DriverFormData): Driver => {
    const drivers = getDriversFromFile();
    const nextId = drivers.length > 0 ? Math.max(...drivers.map((d) => d.id)) + 1 : 1;
    
    // Check for unique license number
    const exists = drivers.some(
      (d) => d.licenseNumber.toLowerCase() === formData.licenseNumber.toLowerCase()
    );
    if (exists) {
      throw new Error(`A driver with license number ${formData.licenseNumber} already exists.`);
    }

    const newDriver: Driver = {
      id: nextId,
      name: formData.name,
      licenseNumber: formData.licenseNumber,
      licenseCategory: formData.licenseCategory,
      licenseExpiry: new Date(formData.licenseExpiry).toISOString(),
      contactNumber: formData.contactNumber,
      safetyScore: Number(formData.safetyScore) || 100.0,
      status: formData.status || "AVAILABLE",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    drivers.push(newDriver);
    writeDriversToFile(drivers);
    return newDriver;
  },

  updateDriver: (id: number, formData: Partial<DriverFormData>): Driver => {
    const drivers = getDriversFromFile();
    const index = drivers.findIndex((d) => d.id === id);
    if (index === -1) {
      throw new Error(`Driver with ID ${id} not found.`);
    }

    // Check for unique license number if it's changing
    if (formData.licenseNumber) {
      const exists = drivers.some(
        (d) =>
          d.id !== id &&
          d.licenseNumber.toLowerCase() === formData.licenseNumber!.toLowerCase()
      );
      if (exists) {
        throw new Error(`A driver with license number ${formData.licenseNumber} already exists.`);
      }
    }

    const updatedDriver: Driver = {
      ...drivers[index],
      ...formData,
      // Handle conversion of licenseExpiry to proper format if provided
      licenseExpiry: formData.licenseExpiry
        ? new Date(formData.licenseExpiry).toISOString()
        : drivers[index].licenseExpiry,
      updatedAt: new Date().toISOString(),
    };

    drivers[index] = updatedDriver;
    writeDriversToFile(drivers);
    return updatedDriver;
  },

  deleteDriver: (id: number): boolean => {
    const drivers = getDriversFromFile();
    const initialLength = drivers.length;
    const filtered = drivers.filter((d) => d.id !== id);
    
    if (filtered.length === initialLength) {
      return false;
    }

    writeDriversToFile(filtered);
    return true;
  },

  // ---------- VEHICLES ----------
  getVehicles: (): Vehicle[] => {
    return getVehiclesFromFile();
  },

  getVehicleById: (id: number): Vehicle | undefined => {
    const vehicles = getVehiclesFromFile();
    return vehicles.find((v) => v.id === id);
  },

  getAvailableVehicles: (): Vehicle[] => {
    const vehicles = getVehiclesFromFile();
    return vehicles
      .filter((v) => v.status === "AVAILABLE")
      .sort((a, b) => a.registrationNumber.localeCompare(b.registrationNumber));
  },

  updateVehicleStatus: (id: number, status: any): Vehicle => {
    const vehicles = getVehiclesFromFile();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found.`);
    }
    vehicles[index].status = status;
    vehicles[index].updatedAt = new Date().toISOString();
    writeVehiclesToFile(vehicles);
    return vehicles[index];
  },

  updateVehicleOdometer: (id: number, odometerKm: number): Vehicle => {
    const vehicles = getVehiclesFromFile();
    const index = vehicles.findIndex((v) => v.id === id);
    if (index === -1) {
      throw new Error(`Vehicle with ID ${id} not found.`);
    }
    vehicles[index].odometerKm = odometerKm;
    vehicles[index].updatedAt = new Date().toISOString();
    writeVehiclesToFile(vehicles);
    return vehicles[index];
  },

  // ---------- TRIPS ----------
  getTrips: (): Trip[] => {
    const trips = getTripsFromFile();
    const vehicles = getVehiclesFromFile();
    const drivers = getDriversFromFile();

    return trips.map((t) => ({
      ...t,
      vehicle: vehicles.find((v) => v.id === t.vehicleId),
      driver: drivers.find((d) => d.id === t.driverId),
    }));
  },

  getTripById: (id: number): (Trip & { fuelLogs: any[]; expenses: any[] }) | undefined => {
    const trips = getTripsFromFile();
    const trip = trips.find((t) => t.id === id);
    if (!trip) return undefined;

    const vehicles = getVehiclesFromFile();
    const drivers = getDriversFromFile();

    return {
      ...trip,
      vehicle: vehicles.find((v) => v.id === trip.vehicleId),
      driver: drivers.find((d) => d.id === trip.driverId),
      fuelLogs: [],
      expenses: [],
    };
  },

  createTrip: (formData: TripFormData): Trip => {
    const trips = getTripsFromFile();
    
    // Check vehicle status and capacity
    const vehicles = getVehiclesFromFile();
    const vehicle = vehicles.find((v) => v.id === Number(formData.vehicleId));
    if (!vehicle) {
      throw new Error("Vehicle not found.");
    }
    if (vehicle.status !== "AVAILABLE") {
      throw new Error(`Vehicle is currently not available (status: ${vehicle.status})`);
    }
    if (Number(formData.cargoWeightKg) > vehicle.maxLoadCapacityKg) {
      throw new Error(`Cargo weight (${formData.cargoWeightKg} kg) exceeds vehicle's maximum load capacity (${vehicle.maxLoadCapacityKg} kg)`);
    }

    // Check driver status and license expiry
    const drivers = getDriversFromFile();
    const driver = drivers.find((d) => d.id === Number(formData.driverId));
    if (!driver) {
      throw new Error("Driver not found.");
    }
    if (driver.status !== "AVAILABLE") {
      throw new Error(`Driver is currently not available (status: ${driver.status})`);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(driver.licenseExpiry) < today) {
      throw new Error("Driver's license is expired");
    }

    const nextId = trips.length > 0 ? Math.max(...trips.map((t) => t.id)) + 1 : 1;
    const newTrip: Trip = {
      id: nextId,
      vehicleId: Number(formData.vehicleId),
      driverId: Number(formData.driverId),
      source: formData.source,
      destination: formData.destination,
      cargoWeightKg: Number(formData.cargoWeightKg),
      distanceKm: Number(formData.distanceKm),
      revenue: Number(formData.revenue),
      status: "DRAFT",
      finalOdometer: null,
      fuelConsumedLiters: null,
      createdAt: new Date().toISOString(),
      dispatchedAt: null,
      completedAt: null,
    };

    trips.push(newTrip);
    writeTripsToFile(trips);

    return {
      ...newTrip,
      vehicle,
      driver,
    };
  },

  updateTrip: (id: number, formData: any): Trip => {
    const trips = getTripsFromFile();
    const index = trips.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Trip with ID ${id} not found.`);
    }

    const trip = trips[index];
    if (trip.status !== "DRAFT") {
      throw new Error(`Cannot edit trip in ${trip.status} status. Only DRAFT trips can be edited.`);
    }

    const vehicles = getVehiclesFromFile();
    const drivers = getDriversFromFile();

    const updatedTrip: Trip = {
      ...trip,
      ...formData,
      vehicleId: formData.vehicleId !== undefined ? Number(formData.vehicleId) : trip.vehicleId,
      driverId: formData.driverId !== undefined ? Number(formData.driverId) : trip.driverId,
      cargoWeightKg: formData.cargoWeightKg !== undefined ? Number(formData.cargoWeightKg) : trip.cargoWeightKg,
      distanceKm: formData.distanceKm !== undefined ? Number(formData.distanceKm) : trip.distanceKm,
      revenue: formData.revenue !== undefined ? Number(formData.revenue) : trip.revenue,
    };

    // Validations on updated vehicle
    if (formData.vehicleId !== undefined && Number(formData.vehicleId) !== trip.vehicleId) {
      const vehicle = vehicles.find((v) => v.id === Number(formData.vehicleId));
      if (!vehicle || vehicle.status !== "AVAILABLE") {
        throw new Error("New vehicle is not available");
      }
      if (updatedTrip.cargoWeightKg > vehicle.maxLoadCapacityKg) {
        throw new Error(`Cargo weight exceeds new vehicle's capacity (${vehicle.maxLoadCapacityKg} kg)`);
      }
    } else if (formData.cargoWeightKg !== undefined) {
      const vehicle = vehicles.find((v) => v.id === updatedTrip.vehicleId);
      if (vehicle && updatedTrip.cargoWeightKg > vehicle.maxLoadCapacityKg) {
        throw new Error(`Cargo weight exceeds vehicle's capacity (${vehicle.maxLoadCapacityKg} kg)`);
      }
    }

    // Validations on updated driver
    if (formData.driverId !== undefined && Number(formData.driverId) !== trip.driverId) {
      const driver = drivers.find((d) => d.id === Number(formData.driverId));
      if (!driver || driver.status !== "AVAILABLE") {
        throw new Error("New driver is not available");
      }
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(driver.licenseExpiry) < today) {
        throw new Error("New driver's license is expired");
      }
    }

    trips[index] = updatedTrip;
    writeTripsToFile(trips);

    return {
      ...updatedTrip,
      vehicle: vehicles.find((v) => v.id === updatedTrip.vehicleId),
      driver: drivers.find((d) => d.id === updatedTrip.driverId),
    };
  },

  dispatchTrip: (id: number): Trip => {
    const trips = getTripsFromFile();
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error(`Trip with ID ${id} not found.`);
    }

    const trip = trips[tripIndex];
    if (trip.status !== "DRAFT") {
      throw new Error(`Only DRAFT trips can be dispatched. Current status: ${trip.status}`);
    }

    const vehicles = getVehiclesFromFile();
    const vehicleIndex = vehicles.findIndex((v) => v.id === trip.vehicleId);
    if (vehicleIndex === -1) {
      throw new Error("Assigned vehicle not found.");
    }
    if (vehicles[vehicleIndex].status !== "AVAILABLE") {
      throw new Error(`Assigned vehicle is not available (current status: ${vehicles[vehicleIndex].status})`);
    }

    const drivers = getDriversFromFile();
    const driverIndex = drivers.findIndex((d) => d.id === trip.driverId);
    if (driverIndex === -1) {
      throw new Error("Assigned driver not found.");
    }
    if (drivers[driverIndex].status !== "AVAILABLE") {
      throw new Error(`Assigned driver is not available (current status: ${drivers[driverIndex].status})`);
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(drivers[driverIndex].licenseExpiry) < today) {
      throw new Error("Assigned driver's license has expired and cannot be dispatched");
    }

    // Update vehicle status
    vehicles[vehicleIndex].status = "ON_TRIP";
    vehicles[vehicleIndex].updatedAt = new Date().toISOString();
    writeVehiclesToFile(vehicles);

    // Update driver status
    drivers[driverIndex].status = "ON_TRIP";
    drivers[driverIndex].updatedAt = new Date().toISOString();
    writeDriversToFile(drivers);

    // Update trip status
    trips[tripIndex].status = "DISPATCHED";
    trips[tripIndex].dispatchedAt = new Date().toISOString();
    writeTripsToFile(trips);

    return {
      ...trips[tripIndex],
      vehicle: vehicles[vehicleIndex],
      driver: drivers[driverIndex],
    };
  },

  completeTrip: (id: number, finalOdometer: number, fuelConsumedLiters: number): Trip => {
    const trips = getTripsFromFile();
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error(`Trip with ID ${id} not found.`);
    }

    const trip = trips[tripIndex];
    if (trip.status !== "DISPATCHED") {
      throw new Error(`Only DISPATCHED trips can be completed. Current status: ${trip.status}`);
    }

    const vehicles = getVehiclesFromFile();
    const vehicleIndex = vehicles.findIndex((v) => v.id === trip.vehicleId);
    if (vehicleIndex === -1) {
      throw new Error("Assigned vehicle not found.");
    }

    if (finalOdometer < vehicles[vehicleIndex].odometerKm) {
      throw new Error(`Final odometer (${finalOdometer} km) cannot be less than the vehicle's starting odometer (${vehicles[vehicleIndex].odometerKm} km)`);
    }

    const drivers = getDriversFromFile();
    const driverIndex = drivers.findIndex((d) => d.id === trip.driverId);
    if (driverIndex === -1) {
      throw new Error("Assigned driver not found.");
    }

    // Update vehicle status & odometer
    vehicles[vehicleIndex].status = "AVAILABLE";
    vehicles[vehicleIndex].odometerKm = finalOdometer;
    vehicles[vehicleIndex].updatedAt = new Date().toISOString();
    writeVehiclesToFile(vehicles);

    // Update driver status
    drivers[driverIndex].status = "AVAILABLE";
    drivers[driverIndex].updatedAt = new Date().toISOString();
    writeDriversToFile(drivers);

    // Update trip details
    trips[tripIndex].status = "COMPLETED";
    trips[tripIndex].finalOdometer = finalOdometer;
    trips[tripIndex].fuelConsumedLiters = fuelConsumedLiters;
    trips[tripIndex].completedAt = new Date().toISOString();
    writeTripsToFile(trips);

    return {
      ...trips[tripIndex],
      vehicle: vehicles[vehicleIndex],
      driver: drivers[driverIndex],
    };
  },

  cancelTrip: (id: number): Trip => {
    const trips = getTripsFromFile();
    const tripIndex = trips.findIndex((t) => t.id === id);
    if (tripIndex === -1) {
      throw new Error(`Trip with ID ${id} not found.`);
    }

    const trip = trips[tripIndex];
    if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
      throw new Error(`Cannot cancel a trip in ${trip.status} status`);
    }

    const wasDispatched = trip.status === "DISPATCHED";

    const vehicles = getVehiclesFromFile();
    const drivers = getDriversFromFile();

    if (wasDispatched) {
      const vehicleIndex = vehicles.findIndex((v) => v.id === trip.vehicleId);
      if (vehicleIndex !== -1) {
        vehicles[vehicleIndex].status = "AVAILABLE";
        vehicles[vehicleIndex].updatedAt = new Date().toISOString();
        writeVehiclesToFile(vehicles);
      }

      const driverIndex = drivers.findIndex((d) => d.id === trip.driverId);
      if (driverIndex !== -1) {
        drivers[driverIndex].status = "AVAILABLE";
        drivers[driverIndex].updatedAt = new Date().toISOString();
        writeDriversToFile(drivers);
      }
    }

    trips[tripIndex].status = "CANCELLED";
    writeTripsToFile(trips);

    return {
      ...trips[tripIndex],
      vehicle: vehicles.find((v) => v.id === trip.vehicleId),
      driver: drivers.find((d) => d.id === trip.driverId),
    };
  },

  // ---------- OTHER ENTITIES ----------
  getMaintenanceLogs: (): any[] => {
    return getMaintenanceFromFile();
  },
  
  getFuelLogs: (): any[] => {
    return getFuelLogsFromFile();
  },

  getExpenses: (): any[] => {
    return getExpensesFromFile();
  },
};

export default DataStore;
