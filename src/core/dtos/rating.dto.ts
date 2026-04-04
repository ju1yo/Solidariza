import { z } from "zod";

export const createRatingSchema = z.object({
  donationId: z.string().min(1, "ID da doação é obrigatório"),
  score: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type CreateRatingDTO = z.infer<typeof createRatingSchema>;
