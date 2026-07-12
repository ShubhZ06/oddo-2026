"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function logMaintenance(data: {
  vehicleId: number;
  type: any;
  cost: number;
  description: string;
}) {
  try {
    const log = await prisma.$transaction(async (tx: any) => {
      // Create maintenance log
      const newLog = await tx.maintenanceLog.create({
        data: {
          vehicleId: data.vehicleId,
          type: data.type,
          cost: data.cost,
          description: data.description,
          status: "OPEN",
        }
      });

      // Update vehicle status
      await tx.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: "IN_SHOP" }
      });

      // Create expense
      await tx.expense.create({
        data: {
          vehicleId: data.vehicleId,
          amount: data.cost,
          category: "MAINTENANCE",
          description: `Auto-generated: ${data.type} - ${data.description}`,
          date: new Date(),
        }
      });

      return newLog;
    });
    
    revalidatePath("/maintenance");
    revalidatePath("/dashboard");
    revalidatePath("/expenses");
    return { success: true, data: log };
  } catch (error: any) {
    console.error("Error logging maintenance:", error);
    return { success: false, error: error.message };
  }
}

export async function closeMaintenance(logId: number) {
  try {
    const log = await prisma.maintenanceLog.findUnique({
      where: { id: logId },
      include: { vehicle: true }
    });

    if (!log) throw new Error("Log not found");

    await prisma.$transaction(async (tx: any) => {
      // Close log
      await tx.maintenanceLog.update({
        where: { id: logId },
        data: { status: "CLOSED" }
      });

      // Restore vehicle to AVAILABLE if it wasn't retired
      if (log.vehicle && log.vehicle.status !== "RETIRED") {
        await tx.vehicle.update({
          where: { id: log.vehicleId },
          data: { status: "AVAILABLE" }
        });
      }
    });
    
    revalidatePath("/maintenance");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("Error closing maintenance:", error);
    return { success: false, error: error.message };
  }
}
