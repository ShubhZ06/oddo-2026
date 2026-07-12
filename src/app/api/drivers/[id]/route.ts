import { NextResponse } from "next/server";
import { DataStore } from "@/lib/data-store";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driverId = parseInt(id, 10);

    if (isNaN(driverId)) {
      return NextResponse.json(
        { success: false, error: "Invalid driver ID" },
        { status: 400 }
      );
    }

    let driver;
    try {
      driver = await prisma.driver.findUnique({
        where: { id: driverId },
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      driver = DataStore.getDriverById(driverId);
    }

    if (!driver) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: driver });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch driver" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driverId = parseInt(id, 10);
    const body = await request.json();

    if (isNaN(driverId)) {
      return NextResponse.json(
        { success: false, error: "Invalid driver ID" },
        { status: 400 }
      );
    }

    let updatedDriver;
    try {
      // Check duplicate license number if it's changing
      if (body.licenseNumber) {
        const existing = await prisma.driver.findUnique({
          where: { licenseNumber: body.licenseNumber },
        });
        if (existing && existing.id !== driverId) {
          return NextResponse.json(
            { success: false, error: `A driver with license number ${body.licenseNumber} already exists.` },
            { status: 400 }
          );
        }
      }

      updatedDriver = await prisma.driver.update({
        where: { id: driverId },
        data: {
          ...body,
          licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : undefined,
          safetyScore: body.safetyScore !== undefined ? parseFloat(body.safetyScore) : undefined,
        },
      });
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      try {
        updatedDriver = DataStore.updateDriver(driverId, body);
      } catch (storeError: any) {
        return NextResponse.json(
          { success: false, error: storeError.message || "Failed to update driver" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({ success: true, data: updatedDriver });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update driver" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const driverId = parseInt(id, 10);

    if (isNaN(driverId)) {
      return NextResponse.json(
        { success: false, error: "Invalid driver ID" },
        { status: 400 }
      );
    }

    let deleted = false;
    try {
      await prisma.driver.delete({
        where: { id: driverId },
      });
      deleted = true;
    } catch (dbError) {
      console.warn("Database connection failed, falling back to JSON DataStore.");
      deleted = DataStore.deleteDriver(driverId);
    }

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Driver not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Driver deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete driver" },
      { status: 500 }
    );
  }
}
