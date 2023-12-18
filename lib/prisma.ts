import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
  });

export const prismaContext = { prisma };

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export type Context = {
  prisma: PrismaClient;
};