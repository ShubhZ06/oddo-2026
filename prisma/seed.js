const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // 1. Clean existing data (order matters due to foreign key constraints)
  await prisma.expense.deleteMany({});
  await prisma.fuelLog.deleteMany({});
  await prisma.maintenanceLog.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Cleared existing data.");

  // 2. Hash passwords
  const passwordHash = await bcrypt.hash("TransitOps@123", 10);

  // 3. Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: "Alice Fleet Manager",
        email: "admin@transitops.com",
        passwordHash,
        role: "FLEET_MANAGER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Bob Driver",
        email: "driver@transitops.com",
        passwordHash,
        role: "DRIVER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Charlie Safety Officer",
        email: "safety@transitops.com",
        passwordHash,
        role: "SAFETY_OFFICER",
      },
    }),
    prisma.user.create({
      data: {
        name: "Diana Financial Analyst",
        email: "finance@transitops.com",
        passwordHash,
        role: "FINANCIAL_ANALYST",
      },
    }),
  ]);

  console.log(`Seeded ${users.length} users.`);

  // 4. Seed Vehicles
  const vehiclesData = [
    {
      registrationNumber: "MH-12-PQ-1234",
      nameModel: "Tata Prima 4925.S (Truck)",
      type: "TRUCK",
      maxLoadCapacityKg: 25000,
      odometerKm: 45200.5,
      acquisitionCost: 4500000,
      status: "AVAILABLE",
      region: "North",
    },
    {
      registrationNumber: "KA-03-MJ-5678",
      nameModel: "Mahindra Bolero Pik-Up (Van)",
      type: "VAN",
      maxLoadCapacityKg: 1700,
      odometerKm: 12800.2,
      acquisitionCost: 950000,
      status: "ON_TRIP",
      region: "South",
    },
    {
      registrationNumber: "DL-01-CA-9012",
      nameModel: "Maruti Suzuki Super Carry (Van)",
      type: "VAN",
      maxLoadCapacityKg: 1000,
      odometerKm: 8500.0,
      acquisitionCost: 600000,
      status: "IN_SHOP",
      region: "North",
    },
    {
      registrationNumber: "MH-02-AB-3456",
      nameModel: "BharatBenz 3523R (Truck)",
      type: "TRUCK",
      maxLoadCapacityKg: 35000,
      odometerKm: 98100.8,
      acquisitionCost: 5200000,
      status: "AVAILABLE",
      region: "West",
    },
    {
      registrationNumber: "TN-07-CD-7890",
      nameModel: "Ashok Leyland Oyster (Bus)",
      type: "BUS",
      maxLoadCapacityKg: 8000,
      odometerKm: 62400.3,
      acquisitionCost: 3200000,
      status: "AVAILABLE",
      region: "South",
    },
    {
      registrationNumber: "HR-55-XY-4321",
      nameModel: "Tata Winger Cargo (Van)",
      type: "VAN",
      maxLoadCapacityKg: 2200,
      odometerKm: 34000.1,
      acquisitionCost: 1400000,
      status: "RETIRED",
      region: "North",
    },
    {
      registrationNumber: "GJ-01-ZZ-9999",
      nameModel: "Eicher Pro 2049 (Truck)",
      type: "TRUCK",
      maxLoadCapacityKg: 5000,
      odometerKm: 15400.9,
      acquisitionCost: 1800000,
      status: "AVAILABLE",
      region: "West",
    },
    {
      registrationNumber: "WB-20-EF-6543",
      nameModel: "Mahindra Treo Zor (Car)",
      type: "CAR",
      maxLoadCapacityKg: 550,
      odometerKm: 4200.4,
      acquisitionCost: 400000,
      status: "AVAILABLE",
      region: "East",
    },
  ];

  const vehicles = [];
  for (const v of vehiclesData) {
    const createdVehicle = await prisma.vehicle.create({ data: v });
    vehicles.push(createdVehicle);
  }

  console.log(`Seeded ${vehicles.length} vehicles.`);

  // 5. Seed Drivers
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
  const inTwoMonths = new Date(today.getFullYear(), today.getMonth() + 2, today.getDate());

  const driversData = [
    {
      name: "Rajesh Kumar",
      licenseNumber: "DL-12345678901",
      licenseCategory: "MCWG/LMV/HMV",
      licenseExpiry: nextYear,
      contactNumber: "+91 98765 43210",
      safetyScore: 94.5,
      status: "AVAILABLE",
    },
    {
      name: "Amit Patel",
      licenseNumber: "GJ-98765432109",
      licenseCategory: "LMV/HMV",
      licenseExpiry: inTwoMonths,
      contactNumber: "+91 87654 32109",
      safetyScore: 88.0,
      status: "ON_TRIP",
    },
    {
      name: "Suresh Pillai",
      licenseNumber: "KA-45678901234",
      licenseCategory: "HMV",
      licenseExpiry: nextYear,
      contactNumber: "+91 76543 21098",
      safetyScore: 92.2,
      status: "AVAILABLE",
    },
    {
      name: "Vijay Singh",
      licenseNumber: "HR-22003344556",
      licenseCategory: "LMV",
      licenseExpiry: lastMonth, // Expired
      contactNumber: "+91 99887 76655",
      safetyScore: 78.4,
      status: "OFF_DUTY",
    },
    {
      name: "Gurpreet Singh",
      licenseNumber: "PB-99887766554",
      licenseCategory: "HMV",
      licenseExpiry: nextYear,
      contactNumber: "+91 88776 65544",
      safetyScore: 65.0,
      status: "SUSPENDED",
    },
    {
      name: "Subhash Bose",
      licenseNumber: "WB-11223344556",
      licenseCategory: "LMV/HMV",
      licenseExpiry: nextYear,
      contactNumber: "+91 77665 54433",
      safetyScore: 96.8,
      status: "AVAILABLE",
    },
  ];

  const drivers = [];
  for (const d of driversData) {
    const createdDriver = await prisma.driver.create({ data: d });
    drivers.push(createdDriver);
  }

  console.log(`Seeded ${drivers.length} drivers.`);

  // Find IDs for relations
  const tatas = vehicles.find((v) => v.registrationNumber === "MH-12-PQ-1234");
  const mahindra = vehicles.find((v) => v.registrationNumber === "KA-03-MJ-5678");
  const carry = vehicles.find((v) => v.registrationNumber === "DL-01-CA-9012");
  const benz = vehicles.find((v) => v.registrationNumber === "MH-02-AB-3456");
  const eicher = vehicles.find((v) => v.registrationNumber === "GJ-01-ZZ-9999");

  const rajesh = drivers.find((d) => d.licenseNumber === "DL-12345678901");
  const amit = drivers.find((d) => d.licenseNumber === "GJ-98765432109");
  const suresh = drivers.find((d) => d.licenseNumber === "KA-45678901234");
  const subhash = drivers.find((d) => d.licenseNumber === "WB-11223344556");

  // 6. Seed Trips
  const tripsData = [
    {
      vehicleId: tatas.id,
      driverId: rajesh.id,
      source: "Mumbai",
      destination: "Delhi",
      cargoWeightKg: 18000,
      distanceKm: 1420,
      revenue: 120000,
      status: "COMPLETED",
      finalOdometer: tatas.odometerKm,
      fuelConsumedLiters: 480,
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000),
      dispatchedAt: new Date(today.getTime() - 9 * 24 * 60 * 60 * 1000),
      completedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: mahindra.id,
      driverId: amit.id,
      source: "Bengaluru",
      destination: "Chennai",
      cargoWeightKg: 1500,
      distanceKm: 350,
      revenue: 25000,
      status: "DISPATCHED",
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
      dispatchedAt: new Date(today.getTime() - 20 * 60 * 60 * 1000),
    },
    {
      vehicleId: benz.id,
      driverId: suresh.id,
      source: "Pune",
      destination: "Nagpur",
      cargoWeightKg: 28000,
      distanceKm: 720,
      revenue: 85000,
      status: "DRAFT",
      createdAt: new Date(today.getTime() - 5 * 60 * 60 * 1000),
    },
    {
      vehicleId: eicher.id,
      driverId: subhash.id,
      source: "Ahmedabad",
      destination: "Surat",
      cargoWeightKg: 4200,
      distanceKm: 260,
      revenue: 18000,
      status: "COMPLETED",
      finalOdometer: eicher.odometerKm,
      fuelConsumedLiters: 65,
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000),
      dispatchedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000 - 6 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      driverId: rajesh.id,
      source: "Delhi",
      destination: "Jaipur",
      cargoWeightKg: 12000,
      distanceKm: 270,
      revenue: 35000,
      status: "CANCELLED",
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
  ];

  const trips = [];
  for (const t of tripsData) {
    const createdTrip = await prisma.trip.create({ data: t });
    trips.push(createdTrip);
  }

  console.log(`Seeded ${trips.length} trips.`);

  const completedTrip1 = trips[0];
  const activeTrip = trips[1];
  const completedTrip2 = trips[3];

  // 7. Seed Maintenance Logs
  const maintenanceData = [
    {
      vehicleId: carry.id,
      type: "ENGINE_REPAIR",
      description: "Overheating issue. Replaced radiator fan and coolant thermostat.",
      cost: 15500,
      status: "OPEN",
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      type: "OIL_CHANGE",
      description: "Scheduled 45k km engine oil and filter change.",
      cost: 8500,
      status: "CLOSED",
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
      closedAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
    },
    {
      vehicleId: benz.id,
      type: "BRAKE_SERVICE",
      description: "Replaced front brake pads and serviced rotors.",
      cost: 22000,
      status: "CLOSED",
      createdAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
      closedAt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    },
  ];

  const maintenanceLogs = [];
  for (const m of maintenanceData) {
    const log = await prisma.maintenanceLog.create({ data: m });
    maintenanceLogs.push(log);
  }

  console.log(`Seeded ${maintenanceLogs.length} maintenance records.`);

  // 8. Seed Fuel Logs
  const fuelData = [
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      liters: 240,
      costPerLiter: 92.5,
      totalCost: 22200,
      odometerAtFill: tatas.odometerKm - 710,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      liters: 240,
      costPerLiter: 93.0,
      totalCost: 22320,
      odometerAtFill: tatas.odometerKm,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: mahindra.id,
      tripId: activeTrip.id,
      liters: 45,
      costPerLiter: 94.2,
      totalCost: 4239,
      odometerAtFill: mahindra.odometerKm,
      date: new Date(today.getTime() - 18 * 60 * 60 * 1000),
    },
    {
      vehicleId: eicher.id,
      tripId: completedTrip2.id,
      liters: 65,
      costPerLiter: 91.8,
      totalCost: 5967,
      odometerAtFill: eicher.odometerKm,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
  ];

  const fuelLogs = [];
  for (const f of fuelData) {
    const log = await prisma.fuelLog.create({ data: f });
    fuelLogs.push(log);
  }

  console.log(`Seeded ${fuelLogs.length} fuel logs.`);

  // 9. Seed Expenses
  const expenseData = [
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      category: "TOLL",
      description: "NH48 Expressway tolls (Mumbai to Delhi)",
      amount: 4850,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      category: "FUEL",
      description: "First mid-trip refueling",
      amount: 22200,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      category: "FUEL",
      description: "End of trip refueling",
      amount: 22320,
      date: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: mahindra.id,
      tripId: activeTrip.id,
      category: "TOLL",
      description: "NICE Road + Bengaluru-Chennai highway tolls",
      amount: 850,
      date: new Date(today.getTime() - 19 * 60 * 60 * 1000),
    },
    {
      vehicleId: mahindra.id,
      tripId: activeTrip.id,
      category: "FUEL",
      description: "Initial dispatch refueling",
      amount: 4239,
      date: new Date(today.getTime() - 18 * 60 * 60 * 1000),
    },
    {
      vehicleId: eicher.id,
      tripId: completedTrip2.id,
      category: "FUEL",
      description: "Refueling",
      amount: 5967,
      date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      category: "MAINTENANCE",
      description: "Oil change and filters replacement expense",
      amount: 8500,
      date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: benz.id,
      category: "MAINTENANCE",
      description: "Brake service and front rotors expense",
      amount: 22000,
      date: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: carry.id,
      category: "MAINTENANCE",
      description: "Radiator, fan, coolant repair expense",
      amount: 15500,
      date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      category: "INSURANCE",
      description: "Annual commercial vehicle insurance premium payment",
      amount: 48000,
      date: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: benz.id,
      category: "INSURANCE",
      description: "Annual commercial vehicle insurance premium payment",
      amount: 54000,
      date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000),
    },
    {
      vehicleId: tatas.id,
      tripId: completedTrip1.id,
      category: "MISC",
      description: "State border permit permits (Rajasthan & Haryana entry)",
      amount: 3200,
      date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
    },
  ];

  const expenses = [];
  for (const e of expenseData) {
    const expense = await prisma.expense.create({ data: e });
    expenses.push(expense);
  }

  console.log(`Seeded ${expenses.length} expenses.`);
  console.log("Database seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
