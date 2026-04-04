import { prisma } from "@/lib/prisma";
import { NotificationService } from "./notification.service";
import { AppError } from "../domain/errors/domain.error";

export class CommentService {
  private notificationService = new NotificationService();

  async create(authorId: string, helpRequestId: string, content: string) {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpRequestId },
      select: { authorId: true, title: true },
    });

    if (!helpRequest) {
      throw new AppError("Pedido de ajuda não encontrado", 404);
    }

    const comment = await prisma.comment.create({
      data: {
        authorId,
        helpRequestId,
        content,
      },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
      },
    });

    // Notify receptor if someone else commented on their request
    if (helpRequest.authorId !== authorId) {
      await this.notificationService.create(
        helpRequest.authorId,
        "new_comment",
        "Novo comentário no seu pedido!",
        `Alguém comentou no seu pedido de ajuda "${helpRequest.title}".`,
        `/solicitacoes/${helpRequestId}`
      );
    }

    return comment;
  }

  async listByHelpRequest(helpRequestId: string) {
    return prisma.comment.findMany({
      where: { helpRequestId },
      include: {
        author: { select: { id: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async delete(id: string, userId: string) {
    const comment = await prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new AppError("Comentário não encontrado", 404);
    }

    if (comment.authorId !== userId) {
      throw new AppError("Não tem permissão para excluir este comentário", 403);
    }

    return prisma.comment.delete({ where: { id } });
  }
}
