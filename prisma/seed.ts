import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add some vehicles
  await prisma.vehicle.createMany({
    data: [
      { registrationNumber: "TRK-092", nameModel: "Volvo FH16", type: "TRUCK", maxLoadCapacityKg: 24000, odometerKm: 145000, acquisitionCost: 8500000, status: "IN_SHOP", region: "North Zone" },
      { registrationNumber: "VAN-014", nameModel: "Mercedes Sprinter", type: "VAN", maxLoadCapacityKg: 3500, odometerKm: 85000, acquisitionCost: 4500000, status: "ON_TRIP", region: "South Zone" },
      { registrationNumber: "TRK-105", nameModel: "Scania R500", type: "TRUCK", maxLoadCapacityKg: 22000, odometerKm: 210000, acquisitionCost: 9000000, status: "IN_SHOP", region: "East Zone" },
      { registrationNumber: "CAR-042", nameModel: "Toyota Corolla", type: "CAR", maxLoadCapacityKg: 450, odometerKm: 42000, acquisitionCost: 1800000, status: "AVAILABLE", region: "West Zone" },
    ]
  });
  console.log("Seeding complete!");
}

main()
  .then(() => console.log("Done"))
  .finally(async () => {
    await prisma.$disconnect();
  });
