import prisma from "@/lib/prisma";
import MaintenanceClient from "./MaintenanceClient";

export const dynamic = "force-dynamic";

export default async function MaintenancePage() {
  const maintenanceLogs = await prisma.maintenanceLog.findMany({
    orderBy: { createdAt: "desc" },
  });

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <MaintenanceClient initialLogs={maintenanceLogs} vehicles={vehicles} />;
}
