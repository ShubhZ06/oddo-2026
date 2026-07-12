const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
  try {
    await prisma.$connect();
    console.log('Connected!');
    
    // Test a simple query to ensure tables exist
    const vehicleCount = await prisma.vehicle.count();
    console.log(`Found ${vehicleCount} vehicles.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect or query:', error);
    process.exit(1);
  }
}

main();
