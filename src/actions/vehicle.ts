"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addVehicle(data: any) {
  try {
    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNumber: data.registrationNumber,
        nameModel: data.nameModel,
        type: data.type,
        maxLoadCapacityKg: Number(data.maxLoadCapacityKg),
        odometerKm: Number(data.odometerKm),
        acquisitionCost: Number(data.acquisitionCost),
        region: data.region,
        status: data.status,
      }
    });
    
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { success: true, data: vehicle };
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    return { success: false, error: error.message };
  }
}

export async function updateVehicle(id: number, data: any) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: {
        registrationNumber: data.registrationNumber,
        nameModel: data.nameModel,
        type: data.type,
        maxLoadCapacityKg: data.maxLoadCapacityKg ? Number(data.maxLoadCapacityKg) : undefined,
        odometerKm: data.odometerKm ? Number(data.odometerKm) : undefined,
        acquisitionCost: data.acquisitionCost ? Number(data.acquisitionCost) : undefined,
        region: data.region,
        status: data.status,
      }
    });
    
    revalidatePath("/vehicles");
    revalidatePath(`/vehicles/${id}`);
    revalidatePath("/dashboard");
    return { success: true, data: vehicle };
  } catch (error: any) {
    console.error("Error updating vehicle:", error);
    return { success: false, error: error.message };
  }
}

export async function retireVehicle(id: number) {
  try {
    const vehicle = await prisma.vehicle.update({
      where: { id },
      data: { status: "RETIRED" }
    });
    
    revalidatePath("/vehicles");
    revalidatePath("/dashboard");
    return { success: true, data: vehicle };
  } catch (error: any) {
    console.error("Error retiring vehicle:", error);
    return { success: false, error: error.message };
  }
}
