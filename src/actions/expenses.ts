"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(data: {
  vehicleId: number;
  tripId?: number | null;
  category: any;
  amount: number;
  description: string;
  date: Date;
}) {
  try {
    const expense = await prisma.expense.create({
      data: {
        vehicleId: data.vehicleId,
        tripId: data.tripId || null,
        category: data.category,
        amount: data.amount,
        description: data.description,
        date: data.date,
      },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true, data: expense };
  } catch (error: any) {
    console.error("Error creating expense:", error);
    return { success: false, error: error.message };
  }
}

export async function createFuelLog(data: {
  vehicleId: number;
  tripId?: number | null;
  liters: number;
  costPerLiter: number;
  odometerAtFill: number;
  date: Date;
}) {
  try {
    const fuelLog = await prisma.$transaction(async (tx: any) => {
      const totalCost = data.liters * data.costPerLiter;

      const newLog = await tx.fuelLog.create({
        data: {
          vehicleId: data.vehicleId,
          tripId: data.tripId || null,
          liters: data.liters,
          costPerLiter: data.costPerLiter,
          totalCost: totalCost,
          odometerAtFill: data.odometerAtFill,
          date: data.date,
        },
      });

      // Optionally, create an expense for the fuel log automatically.
      // We will do this so it shows up in general expenses as well.
      await tx.expense.create({
        data: {
          vehicleId: data.vehicleId,
          tripId: data.tripId || null,
          category: "FUEL",
          amount: totalCost,
          description: `Fuel Log: ${data.liters}L @ ${data.costPerLiter}/L`,
          date: data.date,
        },
      });

      return newLog;
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true, data: fuelLog };
  } catch (error: any) {
    console.error("Error creating fuel log:", error);
    return { success: false, error: error.message };
  }
}
