import { z } from "zod";

export const sendMessageSchema = z.object({
    receiverId: z.string().min(1, "ID do destinatário é obrigatório"),
    content: z.string().min(1, "Mensagem não pode ser vazia"),
});

export type SendMessageDTO = z.infer<typeof sendMessageSchema>;
