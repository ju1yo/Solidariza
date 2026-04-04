import { prisma } from "@/lib/prisma";
import { AppError } from "../domain/errors/domain.error";

export class AdminService {
  async listUsers(page = 1, perPage = 10, search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const [total, users] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
        },
      }),
    ]);

    return { total, users, page, perPage };
  }

  async toggleUserActive(userId: string, active: boolean) {
    return prisma.user.update({
      where: { id: userId },
      data: { active },
    });
  }

  async listAllRequests(page = 1, perPage = 10, status?: string) {
    const where: any = status ? { status } : {};

    const [total, requests] = await prisma.$transaction([
      prisma.helpRequest.count({ where }),
      prisma.helpRequest.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, email: true } } },
      }),
    ]);

    return { total, requests, page, perPage };
  }

  async deleteRequest(requestId: string) {
    return prisma.helpRequest.delete({
      where: { id: requestId },
    });
  }

  async getSystemMetrics() {
    const [totalUsers, totalRequests, totalDonations, totalMessages] = await Promise.all([
      prisma.user.count(),
      prisma.helpRequest.count(),
      prisma.donation.count(),
      prisma.message.count(),
    ]);

    return {
      totalUsers,
      totalRequests,
      totalDonations,
      totalMessages,
    };
  }
}
