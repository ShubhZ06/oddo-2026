import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    let drivers;
    try {
      // Try to fetch from Prisma if connected
      const dbDrivers = await prisma.driver.findMany({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    { name: { contains: search } },
                    { licenseNumber: { contains: search } },
                  ],
                }
              : {},
            status ? { status: status as any } : {},
          ],
        },
        orderBy: { name: "asc" },
      });
      drivers = dbDrivers;
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      // Fallback to JSON DataStore
      let localDrivers = DataStore.getDrivers();
      if (search) {
        const lowerSearch = search.toLowerCase();
        localDrivers = localDrivers.filter(
          (d) =>
            d.name.toLowerCase().includes(lowerSearch) ||
            d.licenseNumber.toLowerCase().includes(lowerSearch)
        );
      }
      if (status) {
        localDrivers = localDrivers.filter((d) => d.status === status);
      }
      // Sort by name
      localDrivers.sort((a, b) => a.name.localeCompare(b.name));
      drivers = localDrivers;
    }

    return NextResponse.json({ success: true, data: drivers });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, licenseNumber, licenseCategory, licenseExpiry, contactNumber, safetyScore, status } = body;

    // Validation
    if (!name || !licenseNumber || !licenseCategory || !licenseExpiry || !contactNumber) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    let newDriver;
    try {
      // Check duplicate license number in DB
      const existing = await prisma.driver.findUnique({
        where: { licenseNumber },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: `A driver with license number ${licenseNumber} already exists.` },
          { status: 400 }
        );
      }

      newDriver = await prisma.driver.create({
        data: {
          name,
          licenseNumber,
          licenseCategory,
          licenseExpiry: new Date(licenseExpiry),
          contactNumber,
          safetyScore: safetyScore !== undefined ? parseFloat(safetyScore) : 100,
          status: status || "AVAILABLE",
        },
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      try {
        newDriver = DataStore.createDriver({
          name,
          licenseNumber,
          licenseCategory,
          licenseExpiry,
          contactNumber,
          safetyScore: safetyScore !== undefined ? parseFloat(safetyScore) : 100,
          status: status || "AVAILABLE",
        });
      } catch (storeError: any) {
        return NextResponse.json(
          { success: false, error: storeError.message || "Failed to create driver" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, data: newDriver });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create driver" },
      { status: 500 }
    );
  }
}
