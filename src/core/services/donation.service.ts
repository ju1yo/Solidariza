import { prisma } from "@/lib/prisma";
import { NotificationService } from "./notification.service";
import { AppError } from "../domain/errors/domain.error";

export class DonationService {
  private notificationService = new NotificationService();

  async offer(donorId: string, helpRequestId: string, message?: string) {
    const helpRequest = await prisma.helpRequest.findUnique({
      where: { id: helpRequestId },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!helpRequest) {
      throw new AppError("Pedido de ajuda não encontrado", 404);
    }

    if (helpRequest.authorId === donorId) {
      throw new AppError("Não pode oferecer ajuda ao próprio pedido", 400);
    }

    const donation = await prisma.donation.create({
      data: {
        donorId,
        helpRequestId,
        message,
        status: "oferecido",
      },
    });

    // Notify receptor
    await this.notificationService.create(
      helpRequest.authorId,
      "donation_offer",
      "Nova oferta de ajuda!",
      `Recebeu uma oferta de ajuda no pedido "${helpRequest.title}".`,
      `/solicitacoes/${helpRequestId}`
    );

    return donation;
  }

  async accept(donationId: string, userId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { 
        helpRequest: { select: { authorId: true, title: true } },
        donor: { select: { id: true, name: true } } 
      },
    });

    if (!donation) {
      throw new AppError("Doação não encontrada", 404);
    }

    if (donation.helpRequest.authorId !== userId) {
      throw new AppError("Apenas o autor do pedido pode aceitar ofertas", 403);
    }

    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: { status: "aceito" },
    });

    // Notify donor
    await this.notificationService.create(
      donation.donorId,
      "donation_accepted",
      "Oferta aceita!",
      `Sua oferta de ajuda no pedido "${donation.helpRequest.title}" foi aceita.`,
      `/solicitacoes/${donation.helpRequestId}`
    );

    return updatedDonation;
  }

  async markDelivered(donationId: string, userId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { 
        helpRequest: { select: { authorId: true, title: true } },
      },
    });

    if (!donation) {
      throw new AppError("Doação não encontrada", 404);
    }

    if (donation.donorId !== userId) {
      throw new AppError("Apenas o doador pode marcar como entregue", 403);
    }

    return prisma.donation.update({
      where: { id: donationId },
      data: { status: "entregue" },
    });
  }

  async confirm(donationId: string, userId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { 
        helpRequest: { select: { id: true, authorId: true, title: true } },
      },
    });

    if (!donation) {
      throw new AppError("Doação não encontrada", 404);
    }

    if (donation.helpRequest.authorId !== userId) {
      throw new AppError("Apenas o autor do pedido pode confirmar o recebimento", 403);
    }

    const [updatedDonation] = await prisma.$transaction([
      prisma.donation.update({
        where: { id: donationId },
        data: { status: "confirmado" },
      }),
      prisma.helpRequest.update({
        where: { id: donation.helpRequestId },
        data: { status: "Concluído" },
      }),
    ]);

    // Notify donor
    await this.notificationService.create(
      donation.donorId,
      "donation_completed",
      "Doação confirmada!",
      `Receptor confirmou a doação do pedido "${donation.helpRequest.title}". Obrigado!`,
      `/solicitacoes/${donation.helpRequestId}`
    );

    return updatedDonation;
  }

  async cancel(donationId: string, userId: string) {
    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: { helpRequest: { select: { authorId: true } } },
    });

    if (!donation) {
      throw new AppError("Doação não encontrada", 404);
    }

    if (donation.donorId !== userId && donation.helpRequest.authorId !== userId) {
      throw new AppError("Não tem permissão para cancelar esta doação", 403);
    }

    return prisma.donation.update({
      where: { id: donationId },
      data: { status: "cancelado" },
    });
  }

  async listByHelpRequest(helpRequestId: string) {
    return prisma.donation.findMany({
      where: { helpRequestId },
      include: { donor: { select: { id: true, name: true, profileImage: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async listByDonor(donorId: string) {
    return prisma.donation.findMany({
      where: { donorId },
      include: { helpRequest: { select: { id: true, title: true, status: true } } },
      orderBy: { createdAt: "desc" },
    });
  }
}
