import prisma from "@/lib/prisma";
import VehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  let vehicles: any[] = [];
  try {
    if (prisma) {
      vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (error) {
    console.error("Failed to query vehicles from Prisma:", error);
  }

  return <VehiclesClient initialVehicles={vehicles} />;
}
