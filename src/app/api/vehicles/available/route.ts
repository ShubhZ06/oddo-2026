import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "AVAILABLE",
      },
      orderBy: {
        registrationNumber: "asc",
      },
    });
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error: any) {
    console.error("Error fetching available vehicles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch available vehicles" },
      { status: 500 }
    );
  }
}
