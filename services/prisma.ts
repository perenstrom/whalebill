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
