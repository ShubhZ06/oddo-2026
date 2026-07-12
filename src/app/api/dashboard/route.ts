import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. KPI Counts
    const [
      availableVehicles,
      maintenanceVehicles,
      activeTrips,
      pendingTrips,
      availableDrivers,
      onDutyDrivers,
      totalVehicles
    ] = await Promise.all([
      prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
      prisma.vehicle.count({ where: { status: "IN_SHOP" } }),
      prisma.trip.count({ where: { status: "DISPATCHED" } }),
      prisma.trip.count({ where: { status: "DRAFT" } }),
      prisma.driver.count({ where: { status: "AVAILABLE" } }),
      prisma.driver.count({ where: { status: "ON_TRIP" } }),
      prisma.vehicle.count()
    ]);

    const activeVehicles = await prisma.vehicle.count({ where: { status: "ON_TRIP" } });
    const driversOnDuty = availableDrivers + onDutyDrivers;
    const fleetUtilization = totalVehicles > 0 
      ? Math.round(((activeVehicles + availableVehicles) / totalVehicles) * 100) 
      : 0;

    // 2. Recent Trips
    const recentTripsRaw = await prisma.trip.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
        driver: true,
      },
    });

    const recentTrips = recentTripsRaw.map(trip => {
      let statusColor = "bg-gray-50 text-gray-600 border-gray-200";
      if (trip.status === "DISPATCHED") statusColor = "bg-blue-50 text-blue-700 border-blue-200";
      if (trip.status === "COMPLETED") statusColor = "bg-green-50 text-green-700 border-green-200";
      if (trip.status === "CANCELLED") statusColor = "bg-red-50 text-red-700 border-red-200";

      return {
        id: `TR-${trip.id.toString().padStart(3, '0')}`,
        vehicle: trip.vehicle?.registrationNumber || "—",
        driver: trip.driver?.name || "—",
        status: trip.status,
        statusColor,
        eta: trip.status === "DISPATCHED" ? "In Progress" : trip.status === "COMPLETED" ? "—" : "Pending",
      };
    });

    // 3. Vehicle Status Breakdown
    const vehicleCounts = await prisma.vehicle.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const statusMap = Object.fromEntries(vehicleCounts.map(v => [v.status, v._count.id]));
    const available = statusMap['AVAILABLE'] || 0;
    const onTrip = statusMap['ON_TRIP'] || 0;
    const inShop = statusMap['IN_SHOP'] || 0;
    const retired = statusMap['RETIRED'] || 0;

    const vehicleStatus = [
      { label: "Available", percent: totalVehicles > 0 ? Math.round((available / totalVehicles) * 100) : 0, color: "bg-green-500" },
      { label: "On Trip", percent: totalVehicles > 0 ? Math.round((onTrip / totalVehicles) * 100) : 0, color: "bg-blue-500" },
      { label: "In Shop", percent: totalVehicles > 0 ? Math.round((inShop / totalVehicles) * 100) : 0, color: "bg-orange-500" },
      { label: "Retired", percent: totalVehicles > 0 ? Math.round((retired / totalVehicles) * 100) : 0, color: "bg-red-400" },
    ];

    return NextResponse.json({
      kpis: {
        activeVehicles,
        availableVehicles,
        maintenanceVehicles,
        activeTrips,
        pendingTrips,
        driversOnDuty,
        fleetUtilization,
      },
      recentTrips,
      vehicleStatus
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
