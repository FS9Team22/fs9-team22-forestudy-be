import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const globalForPrisma = global;

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}