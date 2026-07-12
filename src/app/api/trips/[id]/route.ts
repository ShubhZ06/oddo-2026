import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripIdStr } = await props.params;
    const tripId = Number(tripIdStr);

    if (isNaN(tripId)) {
      return NextResponse.json(
        { success: false, error: "Invalid trip ID" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        vehicle: true,
        driver: true,
        fuelLogs: true,
        expenses: true,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: trip });
  } catch (error: any) {
    console.error("Error fetching trip details:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch trip details" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripIdStr } = await props.params;
    const tripId = Number(tripIdStr);

    if (isNaN(tripId)) {
      return NextResponse.json(
        { success: false, error: "Invalid trip ID" },
        { status: 400 }
      );
    }

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

    // Fetch current trip state
    const currentTrip = await prisma.trip.findUnique({
      where: { id: tripId },
    });

    if (!currentTrip) {
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 }
      );
    }

    // Only allow modification if the trip is in DRAFT status
    if (currentTrip.status !== "DRAFT") {
      return NextResponse.json(
        { success: false, error: `Cannot edit trip in ${currentTrip.status} status. Only DRAFT trips can be edited.` },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (vehicleId !== undefined) {
      // Validate vehicle availability if changing
      if (Number(vehicleId) !== currentTrip.vehicleId) {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: Number(vehicleId) },
        });
        if (!vehicle || vehicle.status !== "AVAILABLE") {
          return NextResponse.json(
            { success: false, error: "New vehicle is not available" },
            { status: 400 }
          );
        }
        // Also check if cargo weight fits the new vehicle
        const weight = cargoWeightKg !== undefined ? Number(cargoWeightKg) : currentTrip.cargoWeightKg;
        if (weight > vehicle.maxLoadCapacityKg) {
          return NextResponse.json(
            { success: false, error: `Cargo weight exceeds new vehicle's capacity (${vehicle.maxLoadCapacityKg} kg)` },
            { status: 400 }
          );
        }
      }
      updateData.vehicleId = Number(vehicleId);
    }

    if (driverId !== undefined) {
      // Validate driver availability if changing
      if (Number(driverId) !== currentTrip.driverId) {
        const driver = await prisma.driver.findUnique({
          where: { id: Number(driverId) },
        });
        if (!driver || driver.status !== "AVAILABLE") {
          return NextResponse.json(
            { success: false, error: "New driver is not available" },
            { status: 400 }
          );
        }
        // Check license expiry
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (new Date(driver.licenseExpiry) < today) {
          return NextResponse.json(
            { success: false, error: "New driver's license is expired" },
            { status: 400 }
          );
        }
      }
      updateData.driverId = Number(driverId);
    }

    if (source !== undefined) updateData.source = source;
    if (destination !== undefined) updateData.destination = destination;
    if (cargoWeightKg !== undefined) {
      // If weight is changing but vehicle is not, check current vehicle capacity
      if (vehicleId === undefined) {
        const vehicle = await prisma.vehicle.findUnique({
          where: { id: currentTrip.vehicleId },
        });
        if (vehicle && Number(cargoWeightKg) > vehicle.maxLoadCapacityKg) {
          return NextResponse.json(
            { success: false, error: `Cargo weight exceeds vehicle's capacity (${vehicle.maxLoadCapacityKg} kg)` },
            { status: 400 }
          );
        }
      }
      updateData.cargoWeightKg = Number(cargoWeightKg);
    }
    if (distanceKm !== undefined) updateData.distanceKm = Number(distanceKm);
    if (revenue !== undefined) updateData.revenue = Number(revenue);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        vehicle: true,
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error: any) {
    console.error("Error updating trip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update trip" },
      { status: 500 }
    );
  }
}
