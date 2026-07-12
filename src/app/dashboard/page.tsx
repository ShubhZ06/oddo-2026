import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let vehicles: any[] = [];
  let maintenanceLogs: any[] = [];
  let trips: any[] = [];
  let drivers: any[] = [];

  try {
    vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
    maintenanceLogs = await prisma.maintenanceLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { vehicle: true }
    });
    trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehicle: true, driver: true },
    });
    drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database connection failed on dashboard, falling back to JSON DataStore.", error);
    vehicles = DataStore.getVehicles();
    maintenanceLogs = DataStore.getMaintenanceLogs().slice(0, 3);
    trips = DataStore.getTrips();
    drivers = DataStore.getDrivers();
  }

  return (
    <DashboardClient 
      vehicles={vehicles} 
      trips={trips} 
      drivers={drivers} 
    />
  );
}
