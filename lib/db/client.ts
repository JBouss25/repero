import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getOrCreatePrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  return globalForPrisma.prisma;
}

// Proxy : retarde la création du client jusqu'au premier vrai appel DB
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return getOrCreatePrisma()[prop as keyof PrismaClient];
  },
});