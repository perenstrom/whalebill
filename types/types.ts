import { z } from 'zod';

export const UncreatedPositionSchema = z.object({
  name: z.string(),
  openSeats: z.number()
});

export type UncreatedPosition = z.infer<typeof UncreatedPositionSchema>;
