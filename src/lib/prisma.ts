import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

let prismaInstance: any = null;

try {
  // In Prisma 7, calling new PrismaClient() without an adapter or Accelerate URL
  // will throw an initialization/validation error immediately at runtime if not configured.
  // We wrap this in a try-catch to allow module importing without crashing, enabling mock-fallback APIs.
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient();
  
  if (process.env.NODE_ENV !== "production" && prismaInstance) {
    globalForPrisma.prisma = prismaInstance;
  }
} catch (error) {
  console.warn(
    "[Prisma] Could not initialize PrismaClient. Fallback mock store will be used.\nDetails:",
    error
  );
  prismaInstance = null;
}

export const prisma = prismaInstance;
export default prisma;
