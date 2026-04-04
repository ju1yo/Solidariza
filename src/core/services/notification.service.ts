import { prisma } from "@/lib/prisma";

export class NotificationService {
  async create(userId: string, type: string, title: string, body: string, link?: string) {
    return prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        link,
        read: false,
      },
    });
  }

  async list(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async countUnread(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
}
