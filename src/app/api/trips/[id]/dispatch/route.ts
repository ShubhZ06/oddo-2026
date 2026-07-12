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

    let updatedTrip;
    try {
      // 1. Retrieve the trip and verify its existence and status
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

      if (trip.status !== "DRAFT") {
        return NextResponse.json(
          { success: false, error: `Only DRAFT trips can be dispatched. Current status: ${trip.status}` },
          { status: 400 }
        );
      }

      // 2. Double-check that both assigned vehicle and driver are still AVAILABLE
      if (trip.vehicle.status !== "AVAILABLE") {
        return NextResponse.json(
          { success: false, error: `Assigned vehicle is not available (current status: ${trip.vehicle.status})` },
          { status: 400 }
        );
      }

      if (trip.driver.status !== "AVAILABLE") {
        return NextResponse.json(
          { success: false, error: `Assigned driver is not available (current status: ${trip.driver.status})` },
          { status: 400 }
        );
      }

      // Verify driver license has not expired in the meantime
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(trip.driver.licenseExpiry) < today) {
        return NextResponse.json(
          { success: false, error: "Assigned driver's license has expired and cannot be dispatched" },
          { status: 400 }
        );
      }

      // 3. Atomically perform the status updates in a Prisma Transaction
      updatedTrip = await prisma.$transaction(async (tx) => {
        // Update vehicle status
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { status: "ON_TRIP" },
        });

        // Update driver status
        await tx.driver.update({
          where: { id: trip.driverId },
          data: { status: "ON_TRIP" },
        });

        // Update trip status
        return await tx.trip.update({
          where: { id: tripId },
          data: {
            status: "DISPATCHED",
            dispatchedAt: new Date(),
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
        updatedTrip = DataStore.dispatchTrip(tripId);
      } catch (storeError: any) {
        return NextResponse.json(
          { success: false, error: storeError.message || "Failed to dispatch trip" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error: any) {
    console.error("Error dispatching trip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to dispatch trip" },
      { status: 500 }
    );
  }
}
