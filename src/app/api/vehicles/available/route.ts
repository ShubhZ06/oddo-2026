import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let vehicles;
    try {
      vehicles = await prisma.vehicle.findMany({
        where: {
          status: "AVAILABLE",
        },
        orderBy: {
          registrationNumber: "asc",
        },
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      vehicles = DataStore.getAvailableVehicles();
    }
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error: any) {
    console.error("Error fetching available vehicles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch available vehicles" },
      { status: 500 }
    );
  }
}
