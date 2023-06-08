import { Position } from '@prisma/client';
import { Context } from 'lib/prisma';
import {
  UncreatedBallotItem,
  UncreatedCandidateWithPositionId,
  UncreatedPosition
} from 'types/types';

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
    },
    include: {
      candidates: true
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

export const createCandidate = async (
  ctx: Context,
  candidate: UncreatedCandidateWithPositionId
) => {
  const result = await ctx.prisma.candidate.create({
    data: candidate
  });

  return result;
};

export const createBallot = async (
  ctx: Context,
  positionId: string,
  ballotItems: UncreatedBallotItem[]
) => {
  const result = await ctx.prisma.ballot.create({
    data: {
      positionId,
      ballotItems: {
        createMany: {
          data: ballotItems
        }
      }
    }
  });

  return result;
};
