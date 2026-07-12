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

      if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
        return NextResponse.json(
          { success: false, error: `Cannot cancel a trip in ${trip.status} status` },
          { status: 400 }
        );
      }

      const wasDispatched = trip.status === "DISPATCHED";

      // 2. Transaction to update statuses
      updatedTrip = await prisma.$transaction(async (tx) => {
        if (wasDispatched) {
          // Restore vehicle status to AVAILABLE
          await tx.vehicle.update({
            where: { id: trip.vehicleId },
            data: { status: "AVAILABLE" },
          });

          // Restore driver status to AVAILABLE
          await tx.driver.update({
            where: { id: trip.driverId },
            data: { status: "AVAILABLE" },
          });
        }

        // Update trip status to CANCELLED
        return await tx.trip.update({
          where: { id: tripId },
          data: {
            status: "CANCELLED",
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
        updatedTrip = DataStore.cancelTrip(tripId);
      } catch (storeError: any) {
        return NextResponse.json(
          { success: false, error: storeError.message || "Failed to cancel trip" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, data: updatedTrip });
  } catch (error: any) {
    console.error("Error cancelling trip:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to cancel trip" },
      { status: 500 }
    );
  }
}
