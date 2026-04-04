import { z } from "zod";

export const createHelpRequestSchema = z.object({
    title: z.string().min(1, "Título é obrigatório"),
    description: z.string().min(1, "Descrição é obrigatória"),
    location: z.string().min(1, "Localização é obrigatória"),
    latitude: z.number().optional().nullable(),
    longitude: z.number().optional().nullable(),
    items: z.any().refine((val) => val !== null && val !== undefined, "Itens são obrigatórios"),
    customItemsDescription: z.string().optional().nullable(),
    helpType: z.string().min(1, "Tipo de ajuda é obrigatório"),
    imageUrl: z.string().optional().nullable(),
});

export type CreateHelpRequestDTO = z.infer<typeof createHelpRequestSchema>;
