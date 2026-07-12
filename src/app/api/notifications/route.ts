import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export interface AppNotification {
  id: string;
  type: "warning" | "info" | "danger" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export async function GET() {
  const notifications: AppNotification[] = [];

  try {
    if (!prisma) {
      return NextResponse.json({ notifications: [], total: 0 });
    }
    const now = new Date();
    const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const expiringDrivers = await prisma.driver.findMany({
      where: { licenseExpiry: { lte: in30Days, gte: now } },
      orderBy: { licenseExpiry: "asc" },
      take: 5,
    });

    for (const driver of expiringDrivers) {
      const daysLeft = Math.ceil(
        (driver.licenseExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      notifications.push({
        id: `license-${driver.id}`,
        type: "warning",
        title: "License Expiring Soon",
        message: `${driver.name}'s license expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}.`,
        time: driver.licenseExpiry.toISOString(),
        read: false,
      });
    }

    const expiredDrivers = await prisma.driver.findMany({
      where: { licenseExpiry: { lt: now }, status: { not: "SUSPENDED" } },
      take: 5,
    });

    for (const driver of expiredDrivers) {
      notifications.push({
        id: `expired-${driver.id}`,
        type: "danger",
        title: "License Expired",
        message: `${driver.name}'s license has already expired. Immediate action required.`,
        time: driver.licenseExpiry.toISOString(),
        read: false,
      });
    }

    const openMaintenance = await prisma.maintenanceLog.findMany({
      where: { status: "OPEN" },
      include: { vehicle: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    for (const log of openMaintenance) {
      notifications.push({
        id: `maintenance-${log.id}`,
        type: "warning",
        title: "Vehicle in Maintenance",
        message: `${log.vehicle.registrationNumber} has an open ${log.type.replace(/_/g, " ").toLowerCase()} job.`,
        time: log.createdAt.toISOString(),
        read: false,
      });
    }

    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentDispatches = await prisma.trip.findMany({
      where: { status: "DISPATCHED", dispatchedAt: { gte: yesterday } },
      include: { vehicle: true, driver: true },
      orderBy: { dispatchedAt: "desc" },
      take: 3,
    });

    for (const trip of recentDispatches) {
      notifications.push({
        id: `dispatch-${trip.id}`,
        type: "info",
        title: "Trip Dispatched",
        message: `Trip #${trip.id} - ${trip.vehicle.registrationNumber} dispatched to ${trip.destination}.`,
        time: (trip.dispatchedAt ?? trip.createdAt).toISOString(),
        read: false,
      });
    }

    const halfDayAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000);
    const recentCompletions = await prisma.trip.findMany({
      where: { status: "COMPLETED", completedAt: { gte: halfDayAgo } },
      include: { vehicle: true, driver: true },
      orderBy: { completedAt: "desc" },
      take: 3,
    });

    for (const trip of recentCompletions) {
      notifications.push({
        id: `complete-${trip.id}`,
        type: "success",
        title: "Trip Completed",
        message: `Trip #${trip.id} completed. ${trip.driver.name} returned ${trip.vehicle.registrationNumber}.`,
        time: (trip.completedAt ?? trip.createdAt).toISOString(),
        read: false,
      });
    }

    notifications.sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return NextResponse.json({ notifications, total: notifications.length });
  } catch (error) {
    console.error("Notification fetch error:", error);
    return NextResponse.json({ notifications: [], total: 0 });
  }
}