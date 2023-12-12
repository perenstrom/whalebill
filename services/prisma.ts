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
      candidates: true,
      ballots: {
        include: {
          ballotItems: true
        }
      },
      graph: {
        select: {
          graph: true
        }
      }
    }
  });

  return result;
};

export const getIncrementedCandidateId = async (
  ctx: Context,
  positionId: string
) => {
  const result = await ctx.prisma.candidate.findFirst({
    where: {
      positionId
    },
    orderBy: {
      smallId: 'desc'
    }
  });

  return (result?.smallId || 0) + 1;
};

export const updatePosition = async (ctx: Context, position: Position) => {
  const result = await ctx.prisma.position.update({
    where: {
      id: position.id
    },
    data: { ...position, winnerPath: position.winnerPath || undefined }
  });

  return result;
};

export const createCandidate = async (
  ctx: Context,
  candidate: UncreatedCandidateWithPositionId
) => {
  const incrementedId = await getIncrementedCandidateId(
    ctx,
    candidate.positionId
  );

  const newCandidate = {
    ...candidate,
    smallId: incrementedId
  };

  const result = await ctx.prisma.candidate.create({
    data: newCandidate
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

export const deleteBallot = async (ctx: Context, ballotId: string) => {
  const result = await ctx.prisma.ballot.delete({
    where: {
      id: ballotId
    }
  });

  return result;
};

export const createGraph = async (
  ctx: Context,
  positionId: string,
  graph: string
) => {
  const result = await ctx.prisma.graph.create({
    data: {
      positionId,
      graph
    }
  });

  return result;
};

export const invalidateGraph = async (ctx: Context, positionId: string) => {
  await ctx.prisma.graph.delete({
    where: {
      positionId
    }
  });

  return true;
};
