import { z } from "zod";

export const createHelpRequestSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    location: z.string().min(1, "Localização é obrigatória"),
    items: z.any().refine((val) => val !== null && val !== undefined, "Itens são obrigatórios"), // Aceita qualquer JSON por enquanto
    customItemsDescription: z.string().optional(),
    helpType: z.string().min(1, "Tipo de ajuda é obrigatório"),
    imageUrl: z.string().optional(),
});

export type CreateHelpRequestDTO = z.infer<typeof createHelpRequestSchema>;
