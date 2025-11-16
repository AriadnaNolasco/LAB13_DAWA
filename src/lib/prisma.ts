// IMPORTAMOS PrismaClient DESDE LA RUTA GENERADA usando el alias @/
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Exportamos la instancia de Prisma
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // Opcional: para ver las consultas SQL en desarrollo
    // log: ["query"], 
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;