import { Position } from '@prisma/client';
import { Context } from 'lib/prisma';
import { UncreatedPosition } from 'types/types';

export const createPosition = async (
  ctx: Context,
  position: UncreatedPosition
) => {
  const result = await ctx.prisma.position.create({
    data: position
  });

  return result;
};

export const getAdminPosition = async (ctx: Context, adminId: string) => {
  const result = await ctx.prisma.position.findUnique({
    where: {
      adminId
    }
  });

  return result;
};

export const updatePosition = async (ctx: Context, position: Position) => {
  const result = await ctx.prisma.position.update({
    where: {
      id: position.id
    },
    data: position
  });

  return result;
};
