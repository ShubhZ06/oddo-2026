import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/trips - List all trips
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        vehicle: true,
        driver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: trips });
  } catch (error: any) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

// POST /api/trips - Create trip in DRAFT status
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      vehicleId,
      driverId,
      source,
      destination,
      cargoWeightKg,
      distanceKm,
      revenue,
    } = body;

    // Basic fields validation
    if (
      !vehicleId ||
      !driverId ||
      !source ||
      !destination ||
      cargoWeightKg === undefined ||
      distanceKm === undefined ||
      revenue === undefined
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Fetch and validate Vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(vehicleId) },
    });

    if (!vehicle) {
      return NextResponse.json(
        { success: false, error: "Vehicle not found" },
        { status: 404 }
      );
    }

    if (vehicle.status !== "AVAILABLE") {
      return NextResponse.json(
        { success: false, error: `Vehicle is currently not available (status: ${vehicle.status})` },
        { status: 400 }
      );
    }

    // 2. Fetch and validate Driver
    const driver = await prisma.driver.findUnique({
      where: { id: Number(driverId) },
    });

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    if (driver.status !== "AVAILABLE") {
      return NextResponse.json(
        { success: false, error: `Driver is currently not available (status: ${driver.status})` },
        { status: 400 }
      );
    }

    // License expiry check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(driver.licenseExpiry) < today) {
      return NextResponse.json(
        { success: false, error: "Driver's license is expired" },
        { status: 400 }
      );
    }

    // 3. Cargo weight capacity validation
    if (Number(cargoWeightKg) > vehicle.maxLoadCapacityKg) {
      return NextResponse.json(
        {
          success: false,
          error: `Cargo weight (${cargoWeightKg} kg) exceeds vehicle's maximum load capacity (${vehicle.maxLoadCapacityKg} kg)`,
        },
        { status: 400 }
      );
    }

    // 4. Create the trip in DRAFT
    const newTrip = await prisma.trip.create({
      data: {
        vehicleId: Number(vehicleId),
        driverId: Number(driverId),
        source,
        destination,
        cargoWeightKg: Number(cargoWeightKg),
        distanceKm: Number(distanceKm),
        revenue: Number(revenue),
        status: "DRAFT",
      },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: newTrip }, { status: 211 }); // Using 201 Created or 200 is fine, 201 is standard
  } catch (error: any) {
    console.error("Error creating trip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create trip" },
      { status: 500 }
    );
  }
}
