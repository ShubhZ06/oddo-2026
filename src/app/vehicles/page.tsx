import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import VehiclesClient from "./VehiclesClient";

export const dynamic = "force-dynamic";

export default async function VehiclesPage() {
  let vehicles = [];
  
  try {
    vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database connection failed, falling back to JSON DataStore.", error);
    vehicles = DataStore.getVehicles();
  }

  return <VehiclesClient initialVehicles={vehicles} />;
}
