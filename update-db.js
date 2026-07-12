const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function main() { 
  await prisma.$executeRawUnsafe("UPDATE expenses SET category = 'MISC' WHERE category IN ('FUEL', 'MAINTENANCE')"); 
} 
main().catch(console.error).finally(() => prisma.$disconnect());
