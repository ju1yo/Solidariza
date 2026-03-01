import { prisma } from "@/lib/prisma";
import { CreateHelpRequestDTO } from "../dtos/help-request.dto";
import { AppError } from "../domain/errors/domain.error";

export class HelpRequestService {
    async create(userId: string, data: CreateHelpRequestDTO) {
        if (!userId) {
            throw new AppError("Usuário não identificado", 401);
        }

        try {
            const helpRequest = await prisma.helpRequest.create({
                data: {
                    title: data.title,
                    description: data.description,
                    location: data.location,
                    items: data.items,
                    customItemsDescription: data.customItemsDescription,
                    helpType: data.helpType,
                    imageUrl: data.imageUrl,
                    authorId: userId,
                },
            });

            return helpRequest;
        } catch (error: any) {
            console.error("Erro no Service de HelpRequest:", error);
            throw new AppError("Erro ao criar solicitação de ajuda", 500);
        }
    }
}
