import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const UncreatedPositionSchema = z.object({
  name: z.string(),
  openSeats: z.number()
});

export type UncreatedPosition = z.infer<typeof UncreatedPositionSchema>;

export const PositionSchema = z.object({
  id: z.string(),
  name: z.string(),
  openSeats: z.number(),
  adminId: z.string()
});

export type AdminPosition = Prisma.PositionGetPayload<{
  include: {
    candidates: true;
  };
}>;

export const UncreatedCandidateSchema = z.object({
  name: z.string()
});
export const UncreatedCandidateWithPositionIdSchema = z.object({
  name: z.string(),
  positionId: z.string()
});

export type UncreatedCandidate = z.infer<typeof UncreatedCandidateSchema>;
export type UncreatedCandidateWithPositionId = z.infer<
  typeof UncreatedCandidateWithPositionIdSchema
>;

export const UncreatedBallotItemSchema = z.object({
  ballotId: z.string(),
  candidateId: z.string(),
  order: z.number()
});

export type UncreatedBallotItem = z.infer<typeof UncreatedBallotItemSchema>;
