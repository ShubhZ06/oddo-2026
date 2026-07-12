import prisma from "@/lib/prisma";
import { DataStore } from "@/lib/data-store";
import ExpensesClient from "./ExpensesClient";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  let expenses = [];
  let fuelLogs = [];
  let vehicles = [];
  let trips = [];

  try {
    expenses = await prisma.expense.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
        trip: true,
      }
    });

    fuelLogs = await prisma.fuelLog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vehicle: true,
        trip: true,
      }
    });

    vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: "desc" },
    });

    trips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database connection failed, falling back to JSON DataStore.", error);
    expenses = DataStore.getExpenses();
    fuelLogs = DataStore.getFuelLogs();
    vehicles = DataStore.getVehicles();
    trips = DataStore.getTrips();
  }

  return (
    <ExpensesClient 
      initialExpenses={expenses} 
      initialFuelLogs={fuelLogs} 
      vehicles={vehicles}
      trips={trips}
    />
  );
}
