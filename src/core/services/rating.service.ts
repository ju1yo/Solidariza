import { prisma } from "@/lib/prisma";
import { CreateRatingDTO } from "../dtos/rating.dto";
import { AppError } from "../domain/errors/domain.error";

export class RatingService {
  async create(raterId: string, data: CreateRatingDTO) {
    const donation = await prisma.donation.findUnique({
      where: { id: data.donationId },
      include: { helpRequest: { select: { authorId: true } } },
    });

    if (!donation) {
      throw new AppError("Doação não encontrada", 404);
    }

    if (donation.status !== "confirmado") {
      throw new AppError("Apenas doações confirmadas podem ser avaliadas", 400);
    }

    // Identify ratedId
    const ratedId = raterId === donation.donorId 
      ? donation.helpRequest.authorId 
      : (raterId === donation.helpRequest.authorId ? donation.donorId : null);

    if (!ratedId) {
      throw new AppError("Não faz parte desta doação para avaliar", 403);
    }

    // Check if donation already has rating from this rater
    const existing = await prisma.rating.findFirst({
      where: { donationId: data.donationId, raterId },
    });

    if (existing) {
      throw new AppError("Você já avaliou esta doação", 409);
    }

    return prisma.rating.create({
      data: {
        donationId: data.donationId,
        raterId,
        ratedId,
        score: data.score,
        comment: data.comment,
      },
    });
  }

  async getByDonation(donationId: string) {
    return prisma.rating.findMany({
      where: { donationId },
      include: {
        rater: { select: { id: true, name: true, profileImage: true } },
      },
    });
  }

  async getAverageForUser(userId: string) {
    const ratings = await prisma.rating.aggregate({
      where: { ratedId: userId },
      _avg: { score: true },
      _count: { score: true },
    });

    return {
      average: ratings._avg.score || 0,
      count: ratings._count.score || 0,
    };
  }

  async listByUser(userId: string) {
    return prisma.rating.findMany({
      where: { ratedId: userId },
      include: {
        rater: { select: { id: true, name: true, profileImage: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
