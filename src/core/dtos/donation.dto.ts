import { z } from "zod";

export const createDonationSchema = z.object({
  helpRequestId: z.string().min(1, "ID do pedido é obrigatório"),
  message: z.string().optional(),
});

export const updateDonationStatusSchema = z.object({
  status: z.enum(["oferecido", "aceito", "entregue", "confirmado", "cancelado"]),
});

export type CreateDonationDTO = z.infer<typeof createDonationSchema>;
export type UpdateDonationStatusDTO = z.infer<typeof updateDonationStatusSchema>;
