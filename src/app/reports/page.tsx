import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import ReportsClient from "./ReportsClient";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  let vehicles: any[] = [];
  let maintenanceLogs: any[] = [];
  let trips: any[] = [];
  let fuelLogs: any[] = [];
  let expenses: any[] = [];

  try {
    vehicles = await prisma.vehicle.findMany();
    maintenanceLogs = await prisma.maintenanceLog.findMany();
    trips = await prisma.trip.findMany();
    fuelLogs = await prisma.fuelLog.findMany();
    expenses = await prisma.expense.findMany();
  } catch (error) {
    console.warn("Database connection failed on reports, falling back to JSON DataStore.", error);
    vehicles = DataStore.getVehicles();
    maintenanceLogs = DataStore.getMaintenanceLogs();
    trips = DataStore.getTrips();
    fuelLogs = DataStore.getFuelLogs();
    expenses = DataStore.getExpenses();
  }

  return (
    <ReportsClient 
      vehicles={vehicles}
      trips={trips}
      maintenanceLogs={maintenanceLogs}
      fuelLogs={fuelLogs}
      expenses={expenses}
    />
  );
}
