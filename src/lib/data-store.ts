import fs from "fs";
import path from "path";
import type { Driver, DriverFormData } from "@/types";

const DATA_FILE_PATH = path.join(process.cwd(), "src/lib/drivers-data.json");

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

export const DataStore = {
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
};
