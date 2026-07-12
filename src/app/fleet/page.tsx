import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import VehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  let vehicles: any[] = [];
  try {
    if (prisma) {
      vehicles = await prisma.vehicle.findMany({
        orderBy: { createdAt: "desc" },
      });
    } else {
      vehicles = DataStore.getVehicles();
    }
  } catch (error) {
    console.warn("Prisma connection/query failed. Falling back to JSON DataStore:", error);
    vehicles = DataStore.getVehicles();
  }

  return <VehiclesClient initialVehicles={vehicles} />;
}
