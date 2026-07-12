const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/DATABASE_URL="(.*?)"/);
if (match) {
  process.env.DATABASE_URL = match[1];
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the live database!');
    
    const vehicleCount = await prisma.vehicle.count();
    console.log(`Found ${vehicleCount} vehicles.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect or query:', error);
    process.exit(1);
  }
}

main();
