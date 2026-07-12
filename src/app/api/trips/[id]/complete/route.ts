import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import prisma from "@/lib/prisma";

export async function PATCH(
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
    const { finalOdometer, fuelConsumedLiters } = body;

    if (finalOdometer === undefined || fuelConsumedLiters === undefined) {
      return NextResponse.json(
        { success: false, error: "Final odometer and fuel consumed are required" },
        { status: 400 }
      );
    }

    const odometer = Number(finalOdometer);
    const fuel = Number(fuelConsumedLiters);

    if (isNaN(odometer) || odometer < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid final odometer value" },
        { status: 400 }
      );
    }

    if (isNaN(fuel) || fuel < 0) {
      return NextResponse.json(
        { success: false, error: "Invalid fuel consumed value" },
        { status: 400 }
      );
    }

    let updatedTrip;
    try {
      // 1. Fetch the trip
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          vehicle: true,
          driver: true,
        },
      });

      if (!trip) {
        return NextResponse.json(
          { success: false, error: "Trip not found" },
          { status: 404 }
        );
      }

      if (trip.status !== "DISPATCHED") {
        return NextResponse.json(
          { success: false, error: `Only DISPATCHED trips can be completed. Current status: ${trip.status}` },
          { status: 400 }
        );
      }

      // Odometer validation: final odometer must be >= starting odometer
      if (odometer < trip.vehicle.odometerKm) {
        return NextResponse.json(
          {
            success: false,
            error: `Final odometer (${odometer} km) cannot be less than the vehicle's starting odometer (${trip.vehicle.odometerKm} km)`,
          },
          { status: 400 }
        );
      }

      // 2. Transaction to update statuses and log readings
      updatedTrip = await prisma.$transaction(async (tx: any) => {
        // Update vehicle status & odometer
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: {
            status: "AVAILABLE",
            odometerKm: odometer,
          },
        });

        // Update driver status
        await tx.driver.update({
          where: { id: trip.driverId },
          data: {
            status: "AVAILABLE",
          },
        });

        // Update trip details
        return await tx.trip.update({
          where: { id: tripId },
          data: {
            status: "COMPLETED",
            finalOdometer: odometer,
            fuelConsumedLiters: fuel,
            completedAt: new Date(),
          },
          include: {
            vehicle: true,
            driver: true,
          },
        });
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      try {
        updatedTrip = DataStore.completeTrip(tripId, odometer, fuel);
      } catch (storeError: any) {
        return NextResponse.json(
          { success: false, error: storeError.message || "Failed to complete trip" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error: any) {
    console.error("Error completing trip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to complete trip" },
      { status: 500 }
    );
  }
}
