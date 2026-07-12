import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    // Reset time to start of day for comparison
    today.setHours(0, 0, 0, 0);

    const drivers = await prisma.driver.findMany({
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

    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    console.error("Error fetching available drivers:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch available drivers" },
      { status: 500 }
    );
  }
}
