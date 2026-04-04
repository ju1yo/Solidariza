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
          latitude: data.latitude,
          longitude: data.longitude,
        },
      });

      return helpRequest;
    } catch (error: any) {
      console.error("Erro no Service de HelpRequest:", error);
      throw new AppError("Erro ao criar solicitação de ajuda", 500);
    }
  }

  async list(take = 6) {
    const requests = await prisma.helpRequest.findMany({
      take,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, profileImage: true },
        },
      },
    });

    return requests.map((req) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      location: req.location,
      items: req.items,
      helpType: req.helpType,
      imageUrl: req.imageUrl,
      status: req.status,
      createdAt: req.createdAt,
      authorName: req.author.name,
      authorImage: req.author.profileImage,
      latitude: req.latitude,
      longitude: req.longitude,
    }));
  }

  async search(query?: string, filters?: { helpType?: string; status?: string; location?: string }) {
    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
      ];
    }

    if (filters?.helpType) where.helpType = filters.helpType;
    if (filters?.status) where.status = filters.status;
    if (filters?.location) where.location = { contains: filters.location };

    const requests = await prisma.helpRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, profileImage: true } },
      },
    });

    return requests.map((req) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      location: req.location,
      items: req.items,
      helpType: req.helpType,
      imageUrl: req.imageUrl,
      status: req.status,
      createdAt: req.createdAt,
      authorName: req.author.name,
      authorImage: req.author.profileImage,
      latitude: req.latitude,
      longitude: req.longitude,
    }));
  }

  async getById(id: string) {
    const request = await prisma.helpRequest.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, profileImage: true, email: true, phoneNumber: true } },
        comments: {
          include: { author: { select: { id: true, name: true, profileImage: true } } },
          orderBy: { createdAt: "asc" },
        },
        donations: {
          include: { donor: { select: { id: true, name: true, profileImage: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!request) {
      throw new AppError("Pedido não encontrado", 404);
    }

    return request;
  }

  async listByUser(userId: string) {
    return prisma.helpRequest.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: string, userId: string, status: string) {
    const request = await prisma.helpRequest.findUnique({ where: { id } });

    if (!request) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (request.authorId !== userId) {
      throw new AppError("Não tem permissão para alterar este pedido", 403);
    }

    return prisma.helpRequest.update({
      where: { id },
      data: { status },
    });
  }

  async delete(id: string, userId: string) {
    const request = await prisma.helpRequest.findUnique({ where: { id } });

    if (!request) {
      throw new AppError("Pedido não encontrado", 404);
    }

    if (request.authorId !== userId) {
      throw new AppError("Não tem permissão para excluir este pedido", 403);
    }

    return prisma.helpRequest.delete({ where: { id } });
  }

  async getMapData() {
    return prisma.helpRequest.findMany({
      where: { status: "Pendente" }, // Usually only show pending on map
      select: {
        id: true,
        title: true,
        latitude: true,
        longitude: true,
        helpType: true,
      },
    });
  }
}
