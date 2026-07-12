import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import MaintenanceClient from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  let maintenanceLogs = [];
  let vehicles = [];

  try {
    maintenanceLogs = await prisma.maintenanceLog.findMany({
      orderBy: { createdAt: "desc" },
    });

    vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database connection failed, falling back to JSON DataStore.", error);
    maintenanceLogs = DataStore.getMaintenanceLogs();
    vehicles = DataStore.getVehicles();
  }

  return <MaintenanceClient initialLogs={maintenanceLogs} vehicles={vehicles} />;
}
