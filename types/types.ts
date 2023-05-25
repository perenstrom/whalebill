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
