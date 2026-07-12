import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);

    let drivers;
    try {
      drivers = await prisma.driver.findMany({
        where: {
          status: "AVAILABLE",
          licenseExpiry: {
            gte: today,
          },
        },
        orderBy: {
          name: "asc",
        },
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      let localDrivers = DataStore.getDrivers();
      localDrivers = localDrivers.filter((d) => {
        const expiry = new Date(d.licenseExpiry);
        expiry.setHours(0, 0, 0, 0);
        return d.status === "AVAILABLE" && expiry >= today;
      });
      localDrivers.sort((a, b) => a.name.localeCompare(b.name));
      drivers = localDrivers;
    }

    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    console.error("Error fetching available drivers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch available drivers" },
      { status: 500 }
    );
  }
}
