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
  adminId: z.string(),
  winnerPath: z.string().nullable()
});

export type AdminPosition = Prisma.PositionGetPayload<{
  include: {
    candidates: true;
    ballots: {
      include: {
        ballotItems: true;
      };
    };
    graph: {
      select: {
        graph: true;
      };
    };
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

const UncreatedBallotItemSchema = z.object({
  candidateId: z.string(),
  candidateSmallId: z.number(),
  order: z.number()
});
export const UncreatedBallotItemsSchema = z.array(UncreatedBallotItemSchema);

export type UncreatedBallotItem = z.infer<typeof UncreatedBallotItemSchema>;

export type BallotWithItems = Prisma.BallotGetPayload<{
  include: {
    ballotItems: true;
  };
}>;

export type ServerAction = (formData: FormData) => void;
